'use server'

import { auth } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import { checkRateLimit, resetRateLimit } from '@/lib/auth/rate-limit'
import { logAdminAction } from '@/lib/auth/audit-log'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { signupOtps, userProfiles } from '@/lib/db/schema'
import { eq, and, gt, lt, desc, sql, or } from 'drizzle-orm'
import { seal, open } from '@/lib/auth/secret-box'

// Rate limit: 5 login attempts per 15 minutes per email
const LOGIN_RATE_LIMIT_MAX = 5;
const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

// A 6-digit code is only 10^6 wide and lives for 15 minutes. Unmetered guessing
// walks that space; these two caps are what make the code worth anything.
const OTP_VERIFY_MAX_ATTEMPTS = 5;
const OTP_RESEND_MAX = 3;
const OTP_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Codes are a credential, so they come from the CSPRNG, not Math.random. */
function generateOtp(): string {
  return String(crypto.getRandomValues(new Uint32Array(1))[0] % 900000 + 100000);
}

/** Constant-time compare so a wrong code cannot be narrowed by response timing. */
function otpMatches(expected: string, provided: string): boolean {
  if (expected.length !== provided.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Deletes pending signups whose code has expired. Rows were previously removed
 * only on successful verification, so every abandoned signup left its stored
 * credential behind permanently. Runs on the same paths that already touch this
 * table, so it needs no scheduler.
 */
async function purgeExpiredSignupOtps() {
  try {
    await db.delete(signupOtps).where(lt(signupOtps.expiresAt, new Date()));
  } catch (err) {
    console.error("Failed to purge expired signup OTP rows:", err);
  }
}

async function ensureSignupOtpsTable() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS signup_otps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        otp VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
  } catch (err) {
    console.error("Failed to ensure signup_otps table:", err);
  }
}

function safeRedirectPath(next: unknown): string | null {
  if (typeof next !== 'string' || !next.startsWith('/')) return null;
  if (next.startsWith('//') || next.startsWith('/\\')) return null;
  return next;
}

export async function authenticateWithTurnstile(formData: FormData) {
  const email = (formData.get('email') as string || '').toLowerCase().trim();
  const password = formData.get('password') as string;
  const turnstileToken = formData.get('cf-turnstile-response') as string;
  const isSignUp = formData.get('isSignUp') === 'true';

  if (!email || !password || !turnstileToken) {
    return { error: "Missing required fields or human verification failed." };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  // Validate email length
  if (email.length > 254) {
    return { error: "Email address is too long." };
  }

  // Validate password length
  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  // Rate limiting — keyed by email to prevent brute-force per account
  const rateLimitKey = `login:${email}`;
  const rateCheck = checkRateLimit(rateLimitKey, LOGIN_RATE_LIMIT_MAX, LOGIN_RATE_LIMIT_WINDOW_MS);

  if (!rateCheck.allowed) {
    const retryMinutes = Math.ceil(rateCheck.retryAfterMs / 60_000);
    return { error: `Too many attempts. Please try again in ${retryMinutes} minute${retryMinutes > 1 ? 's' : ''}.` };
  }

  // 1. Verify Turnstile token
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: turnstileToken,
    }).toString()
  });
  
  const outcome = await res.json();
  if (!outcome.success) {
    return { error: "Security check failed. Please complete Turnstile verification." };
  }

  if (isSignUp) {
    // Strengthen password requirements
    if (password.length < 10) {
      return { error: "Password must be at least 10 characters long." };
    }

    // Require at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { error: "Password must contain at least one uppercase letter." };
    }

    // Require at least one number
    if (!/[0-9]/.test(password)) {
      return { error: "Password must contain at least one number." };
    }

    // Require at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { error: "Password must contain at least one special character (!@#$%^&* etc)." };
    }

    // Check if user has already completed registration
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, email))
      .limit(1);

    if (existingProfile.length > 0) {
      return { error: "An account with this email already exists. Please sign in instead." };
    }

    await ensureSignupOtpsTable();
    await purgeExpiredSignupOtps();

    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Save pending registration in signup_otps table
    await db.insert(signupOtps).values({
      email: email,
      // Sealed, not hashed — it has to be replayed into auth.signUp once the
      // code is verified. See lib/auth/secret-box.ts for why.
      passwordHash: seal(password),
      otp: otpCode,
      expiresAt: expiresAt,
      status: "pending",
    });

    // Dispatch OTP email via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM || "onboarding@resend.dev";
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: email,
            subject: `Your Vision Wings Verification Code: ${otpCode}`,
            html: `
              <div style="font-family: sans-serif; padding: 24px; background-color: #0f172a; color: #fdfbf7; border-radius: 16px;">
                <h2 style="color: #b87333; margin-bottom: 12px;">Vision Wings Marketing</h2>
                <p style="font-size: 15px; color: #cbd5e1;">Your cryptographic one-time verification code is:</p>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 20px; background-color: #1e293b; color: #fbbf24; text-align: center; border-radius: 12px; margin: 24px 0; border: 1px solid #334155;">
                  ${otpCode}
                </div>
                <p style="font-size: 13px; color: #94a3b8;">This code will expire in 15 minutes. Enter this code to verify your identity and unlock onboarding.</p>
              </div>
            `,
          }),
        });
      } catch (e) {
        console.error("Failed to dispatch OTP email via Resend:", e);
      }
    } else {
      console.log(`\n========================================\n[SIGNUP OTP GENERATED] Email: ${email} | Code: ${otpCode}\n========================================\n`);
    }

    // Set HTTP-only cookie to lock page refresh onto OTP screen
    const cookieStore = await cookies();
    cookieStore.set("pending_signup_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 900,
      path: "/",
    });

    return { showOtp: true, email: email };
  }

  // 2. Sign-in Flow with Neon Auth
  let result;
  try {
    result = await auth.signIn.email({ email, password });

    if (result?.error) {
      return { error: result.error.message || "Authentication failed. Please check your credentials." };
    }
  } catch (err: any) {
    console.error("Auth action error:", err);
    const msg = err?.message || "";
    if (msg.includes('password authentication failed') || msg.includes('28P01')) {
      return { error: "Database connection failed. Please verify environment settings." };
    }
    return { error: msg || "An unexpected authentication error occurred." };
  }

  resetRateLimit(rateLimitKey);

  logAdminAction("auth.login", email, email, { success: true });

  // Check if sign-in user needs onboarding. Both arms of this `or` tested the
  // email, so the check only ever ran one way — but saveOnboardingProfile keys
  // the row by the Better Auth user id, which meant the row was never found and
  // a reader who had already completed onboarding was sent back through it on
  // every single sign-in.
  const signedInUserId = result?.data?.user?.id;
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(
      signedInUserId
        ? or(eq(userProfiles.userId, signedInUserId), eq(userProfiles.userId, email))
        : eq(userProfiles.userId, email)
    )
    .limit(1);

  if (!profile) {
    redirect('/onboarding');
  }

  redirect(safeRedirectPath(formData.get('next')) || '/');
}

export async function getPendingSignupStatus() {
  try {
    const cookieStore = await cookies();
    const pendingEmail = cookieStore.get("pending_signup_email")?.value;
    if (!pendingEmail) return { pendingEmail: null };

    await ensureSignupOtpsTable();
    const [pendingOtp] = await db
      .select()
      .from(signupOtps)
      .where(
        and(
          eq(signupOtps.email, pendingEmail),
          eq(signupOtps.status, "pending"),
          gt(signupOtps.expiresAt, new Date())
        )
      )
      .orderBy(desc(signupOtps.createdAt))
      .limit(1);

    if (pendingOtp) {
      return { pendingEmail: pendingEmail };
    }
    return { pendingEmail: null };
  } catch (err) {
    return { pendingEmail: null };
  }
}

export async function verifySignupOtp(formData: FormData) {
  // The email is taken from the httpOnly cookie set when the code was issued,
  // never from the form. Trusting the posted value let anyone submit guesses
  // against any address with a pending registration, not just their own.
  const cookieStore = await cookies();
  const email = (cookieStore.get('pending_signup_email')?.value || '').toLowerCase().trim();
  const otp = (formData.get('otp') as string || '').trim();

  if (!email) {
    return { error: "This verification session has expired. Please sign up again." };
  }
  if (!/^\d{6}$/.test(otp)) {
    return { error: "Enter the 6-digit code from your email." };
  }

  const otpRateKey = `otp-verify:${email}`;
  const rateCheck = checkRateLimit(otpRateKey, OTP_VERIFY_MAX_ATTEMPTS, OTP_RATE_LIMIT_WINDOW_MS);
  if (!rateCheck.allowed) {
    const retryMinutes = Math.ceil(rateCheck.retryAfterMs / 60_000);
    return { error: `Too many incorrect codes. Please try again in ${retryMinutes} minute${retryMinutes > 1 ? 's' : ''}.` };
  }

  await ensureSignupOtpsTable();

  const [pendingRecord] = await db
    .select()
    .from(signupOtps)
    .where(
      and(
        eq(signupOtps.email, email),
        eq(signupOtps.status, "pending"),
        gt(signupOtps.expiresAt, new Date())
      )
    )
    .orderBy(desc(signupOtps.createdAt))
    .limit(1);

  if (!pendingRecord) {
    return { error: "Verification code expired or not found. Please request a new code." };
  }

  if (!otpMatches(pendingRecord.otp, otp)) {
    return { error: "Invalid verification code. Please check your email and try again." };
  }

  // Mark OTP record as verified
  await db
    .update(signupOtps)
    .set({ status: "verified" })
    .where(eq(signupOtps.id, pendingRecord.id));

  resetRateLimit(otpRateKey);

  // Create authentic account & session in Neon Auth
  try {
    const name = email.split('@')[0] || 'User';
    const submittedPassword = open(pendingRecord.passwordHash);

    let result = await auth.signUp.email({
      name,
      email: pendingRecord.email,
      password: submittedPassword,
    });

    if (result?.error) {
      result = await auth.signIn.email({
        email: pendingRecord.email,
        password: submittedPassword,
      });
    }

    if (result?.error) {
      return { error: result.error.message || "Failed to establish authenticated session." };
    }
  } catch (err: any) {
    console.error("Sign up error after OTP verify:", err);
    return { error: err?.message || "Authentication error after OTP verification." };
  }

  // The row holds the submitted password sealed with AES-256-GCM, because it
  // has to be replayed into auth.signUp once the code checks out. Marking it
  // "verified" left every registration sitting in the table indefinitely. It
  // has served its purpose now, so it goes.
  try {
    await db.delete(signupOtps).where(eq(signupOtps.email, pendingRecord.email));
  } catch (err) {
    console.error("Failed to purge consumed signup OTP rows:", err);
  }

  cookieStore.delete("pending_signup_email");

  logAdminAction("auth.signup_verified", email, email, { success: true });

  redirect('/onboarding');
}

export async function resendSignupOtp() {
  // Took an arbitrary email as its argument, with no session check and no rate
  // limit — so it would mail a code to any address on demand, reroll a pending
  // code repeatedly, and report back whether a registration existed for that
  // address. The pending email now comes from the same httpOnly cookie the
  // verify step uses, so a caller can only resend their own code.
  const cookieStore = await cookies();
  const cleanEmail = (cookieStore.get('pending_signup_email')?.value || '').toLowerCase().trim();
  if (!cleanEmail) {
    return { error: "This verification session has expired. Please sign up again." };
  }

  const resendRateKey = `otp-resend:${cleanEmail}`;
  const rateCheck = checkRateLimit(resendRateKey, OTP_RESEND_MAX, OTP_RATE_LIMIT_WINDOW_MS);
  if (!rateCheck.allowed) {
    const retryMinutes = Math.ceil(rateCheck.retryAfterMs / 60_000);
    return { error: `Too many code requests. Please try again in ${retryMinutes} minute${retryMinutes > 1 ? 's' : ''}.` };
  }

  await ensureSignupOtpsTable();

  const [pendingRecord] = await db
    .select()
    .from(signupOtps)
    .where(
      and(
        eq(signupOtps.email, cleanEmail),
        eq(signupOtps.status, "pending")
      )
    )
    .orderBy(desc(signupOtps.createdAt))
    .limit(1);

  if (!pendingRecord) {
    return { error: "No pending registration found for this email. Please sign up again." };
  }

  const newOtp = generateOtp();
  const newExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db
    .update(signupOtps)
    .set({
      otp: newOtp,
      expiresAt: newExpiresAt,
    })
    .where(eq(signupOtps.id, pendingRecord.id));

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM || "onboarding@resend.dev";
  if (resendApiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: cleanEmail,
          subject: `Your Vision Wings Verification Code: ${newOtp}`,
          html: `
            <div style="font-family: sans-serif; padding: 24px; background-color: #0f172a; color: #fdfbf7; border-radius: 16px;">
              <h2 style="color: #b87333; margin-bottom: 12px;">Vision Wings Marketing</h2>
              <p style="font-size: 15px; color: #cbd5e1;">Your new cryptographic one-time verification code is:</p>
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; padding: 20px; background-color: #1e293b; color: #fbbf24; text-align: center; border-radius: 12px; margin: 24px 0; border: 1px solid #334155;">
                ${newOtp}
              </div>
              <p style="font-size: 13px; color: #94a3b8;">This code will expire in 15 minutes.</p>
            </div>
          `,
        }),
      });
    } catch (e) {
      console.error("Failed to resend OTP email:", e);
    }
  } else {
    console.log(`\n========================================\n[RESEND OTP GENERATED] Email: ${cleanEmail} | Code: ${newOtp}\n========================================\n`);
  }

  return { success: true, message: `A new 6-digit code has been sent to ${cleanEmail}.` };
}

export async function cancelSignupOtp() {
  const cookieStore = await cookies();
  cookieStore.delete("pending_signup_email");
  return { success: true };
}

export async function logoutUser() {
  try {
    await auth.signOut();
  } catch (err) {
    console.error("Logout error:", err);
  }
  redirect('/');
}

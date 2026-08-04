'use server'

import { auth } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import { checkRateLimit, resetRateLimit } from '@/lib/auth/rate-limit'
import { logAdminAction } from '@/lib/auth/audit-log'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { signupOtps, userProfiles } from '@/lib/db/schema'
import { eq, and, gt, desc, sql, or } from 'drizzle-orm'

// Rate limit: 5 login attempts per 15 minutes per email
const LOGIN_RATE_LIMIT_MAX = 5;
const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

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
    if (password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
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

    // Generate 6-digit cryptographic OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Save pending registration in signup_otps table
    await db.insert(signupOtps).values({
      email: email,
      passwordHash: password,
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

  // Check if sign-in user needs onboarding
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(or(eq(userProfiles.userId, email), eq(userProfiles.userId, email)))
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
  const email = (formData.get('email') as string || '').toLowerCase().trim();
  const otp = (formData.get('otp') as string || '').trim();

  if (!email || !otp) {
    return { error: "Missing email or verification code." };
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

  if (pendingRecord.otp !== otp) {
    return { error: "Invalid verification code. Please check your email and try again." };
  }

  // Mark OTP record as verified
  await db
    .update(signupOtps)
    .set({ status: "verified" })
    .where(eq(signupOtps.id, pendingRecord.id));

  // Create authentic account & session in Neon Auth
  try {
    const name = email.split('@')[0] || 'User';
    let result = await auth.signUp.email({
      name,
      email: pendingRecord.email,
      password: pendingRecord.passwordHash,
    });

    if (result?.error) {
      result = await auth.signIn.email({
        email: pendingRecord.email,
        password: pendingRecord.passwordHash,
      });
    }

    if (result?.error) {
      return { error: result.error.message || "Failed to establish authenticated session." };
    }
  } catch (err: any) {
    console.error("Sign up error after OTP verify:", err);
    return { error: err?.message || "Authentication error after OTP verification." };
  }

  // Clear pending signup cookie
  const cookieStore = await cookies();
  cookieStore.delete("pending_signup_email");

  logAdminAction("auth.signup_verified", email, email, { success: true });

  redirect('/onboarding');
}

export async function resendSignupOtp(email: string) {
  const cleanEmail = (email || '').toLowerCase().trim();
  if (!cleanEmail) return { error: "Email is required." };

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

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
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

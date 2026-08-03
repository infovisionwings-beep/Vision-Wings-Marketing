import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_missing_key');
// `onboarding@resend.dev` is Resend's only sandbox sender — the previous
// `admin@resend.dev` is not a valid one, so every send was rejected before it
// reached the dashboard. Even the real sandbox address delivers ONLY to the Resend
// account owner, so set RESEND_FROM to an address on a domain you have verified
// before sending mail to anyone else.
export const MAIL_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
// RESEND_FROM only has to be on the verified domain — it needs no real mailbox, so
// replies to it bounce. Point them at an inbox someone actually reads.
const MAIL_REPLY_TO = process.env.RESEND_REPLY_TO || undefined;

/**
 * Send one email, returning null on success or a human-readable reason on failure.
 *
 * The Resend SDK RESOLVES with `{ data: null, error }` for API-level rejections —
 * unverified domain, sandbox recipient restrictions, bad key — and only throws on
 * transport errors. A bare try/catch therefore reports success on a rejected send,
 * which is how invites once appeared to send while never reaching Resend at all.
 * Every caller in this codebase must go through this helper rather than the SDK
 * directly, so that failure mode stays fixed in one place.
 */
export async function sendEmail(payload: Parameters<typeof resend.emails.send>[0]): Promise<string | null> {
  try {
    const { error } = await resend.emails.send({ replyTo: MAIL_REPLY_TO, ...payload });
    if (error) {
      console.error('Resend rejected the send:', error);
      return `${error.name}: ${error.message}`;
    }
    return null;
  } catch (err: any) {
    console.error('Email transport failed:', err);
    return err?.message || 'Email transport failed';
  }
}

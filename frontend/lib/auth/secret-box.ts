import { createCipheriv, createDecipheriv, randomBytes, createHash } from "node:crypto";

/**
 * Authenticated encryption for the one secret this app is forced to hold onto
 * temporarily: the password submitted at signup.
 *
 * Why it exists: the signup flow cannot hash that password, because after the
 * emailed code is verified it has to be replayed verbatim into
 * `auth.signUp.email()`. Better Auth does its own hashing at that point. So the
 * value sat in `signup_otps.password_hash` in clear text — a column whose name
 * says otherwise — readable by anyone with database access, and left behind
 * indefinitely whenever someone requested a code and never finished.
 *
 * Encrypting it does not make storing it good; it makes a database dump stop
 * being a password dump. The key never touches the database.
 *
 * AES-256-GCM: the tag detects tampering, so a modified ciphertext fails to
 * decrypt rather than silently yielding a different password.
 */

const VERSION = "v1";

function key(): Buffer {
  const secret =
    process.env.SIGNUP_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "SIGNUP_SECRET (or BETTER_AUTH_SECRET) must be set to encrypt pending signup credentials.",
    );
  }

  // Accepts a passphrase of any length; SHA-256 gives the 32 bytes AES-256 needs.
  return createHash("sha256").update(secret).digest();
}

/** Returns `v1.<iv>.<tag>.<ciphertext>`, all base64url. */
export function seal(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), enc.toString("base64url")].join(".");
}

/**
 * Reverses `seal`. Rows written before this was introduced are stored in clear
 * text and carry no version prefix, so they are returned as-is rather than
 * failing — existing pending signups still complete. Those rows disappear on
 * first use or on expiry sweep, after which every stored value is sealed.
 */
export function open(stored: string): string {
  if (!stored.startsWith(`${VERSION}.`)) return stored;

  const [, ivB64, tagB64, dataB64] = stored.split(".");
  if (!ivB64 || !tagB64 || !dataB64) return stored;

  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));

  return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64url")), decipher.final()]).toString("utf8");
}

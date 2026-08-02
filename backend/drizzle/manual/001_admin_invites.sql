-- admin_invites: single-use signed invite links that replace the dual-OTP flow.
--
-- Hand-written rather than drizzle-kit generated: the committed snapshot predates the
-- live schema, so `drizzle-kit generate` emits CREATE TABLE for every existing table.
-- This is the only additive change, and it is idempotent — safe to re-run.
--
-- Apply with:  psql "$DATABASE_URL" -f drizzle/manual/001_admin_invites.sql
--          or: npm run migrate:invites

CREATE TABLE IF NOT EXISTS "admin_invites" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(255) NOT NULL,
  "name" varchar(255) NOT NULL,
  "role" varchar(50) NOT NULL,
  "token_hash" varchar(64) NOT NULL,
  "invited_by" varchar(255) NOT NULL,
  "status" varchar(20) DEFAULT 'pending' NOT NULL,
  "expires_at" timestamp NOT NULL,
  "accepted_at" timestamp,
  "created_at" timestamp DEFAULT now(),
  CONSTRAINT "admin_invites_token_hash_unique" UNIQUE ("token_hash")
);

-- Lookup is by token hash on every accept, and by status for the pending list.
CREATE INDEX IF NOT EXISTS "admin_invites_status_idx" ON "admin_invites" ("status");

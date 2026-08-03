-- Adds contact_submissions: the public /contact page form previously called
-- e.preventDefault() and showed a fake "success" alert with nowhere for the
-- data to go. This gives it somewhere real to land.
--
-- Hand-written, not drizzle-kit generated, for the same reason as
-- 001_admin_invites.sql and 002_projects_status_and_client_logos.sql.
-- Idempotent -- safe to re-run.
--
-- Apply with:  cd backend && npm run migrate:contact
--          or: node scripts/apply-sql.js drizzle/manual/003_contact_submissions.sql

CREATE TABLE IF NOT EXISTS "contact_submissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "first_name" varchar(255) NOT NULL,
  "last_name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "company" varchar(255),
  "message" text NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'new',
  "created_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "contact_submissions_created_at_idx" ON "contact_submissions" ("created_at");

-- Adds a publish_status lifecycle to projects (they had none -- only create/edit,
-- with a hard delete function that existed in code but had no UI to reach it) and
-- creates client_logos for the homepage logo marquee.
--
-- Hand-written, not drizzle-kit generated, for the same reason as
-- 001_admin_invites.sql: the committed snapshot predates the live schema.
-- Idempotent -- safe to re-run.
--
-- Apply with:  cd backend && npm run migrate:projects-logos
--          or: node scripts/apply-sql.js drizzle/manual/002_projects_status_and_client_logos.sql

ALTER TABLE "projects"
  ADD COLUMN IF NOT EXISTS "publish_status" varchar(20) NOT NULL DEFAULT 'active';

CREATE TABLE IF NOT EXISTS "client_logos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(255) NOT NULL,
  "logo_url" text NOT NULL,
  "link_url" text,
  "display_order" integer NOT NULL DEFAULT 0,
  "publish_status" varchar(20) NOT NULL DEFAULT 'active',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "client_logos_status_idx" ON "client_logos" ("publish_status");
CREATE INDEX IF NOT EXISTS "projects_status_idx" ON "projects" ("publish_status");

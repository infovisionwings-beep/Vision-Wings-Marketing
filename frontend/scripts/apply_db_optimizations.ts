/**
 * Applies the schema changes in lib/db/schema.ts that this project has no
 * migration runner to apply. Idempotent — safe to re-run.
 *
 * Deliberately short. See the audit note in docs for why only two indexes are
 * created: every other table in this database holds between 1 and 15 rows and
 * fits in a single heap page, where Postgres correctly ignores an index and a
 * sequential scan already costs one buffer hit.
 */
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const STATEMENTS: { sql: string; why: string }[] = [
  {
    sql: `ALTER TABLE insights ADD COLUMN IF NOT EXISTS excerpt TEXT`,
    why: "Listing pages had no excerpt column, so cards borrowed another article's text and every list query pulled the full body to compensate.",
  },
  {
    sql: `CREATE INDEX IF NOT EXISTS admin_audit_logs_timestamp_idx ON admin_audit_logs (timestamp DESC)`,
    why: "Append-only and never pruned — the only table here that grows without bound. The audit view reads it newest-first.",
  },
  {
    sql: `CREATE INDEX IF NOT EXISTS signup_otps_email_created_at_idx ON signup_otps (email, created_at DESC)`,
    why: "Every signup path looks up the newest pending OTP for one email; rows accumulate per failed attempt.",
  },
];

async function main() {
  const { db } = await import("../lib/db");
  const { sql } = await import("drizzle-orm");

  for (const s of STATEMENTS) {
    await db.execute(sql.raw(s.sql));
    console.log(`OK  ${s.sql}`);
    console.log(`    ${s.why}`);
  }

  // Backfill excerpts for articles that have one in the local manifest, so the
  // listing stops falling back to an unrelated article's text.
  const { localInsights } = await import("../lib/content/localInsights");
  for (const item of localInsights) {
    const r: any = await db.execute(
      sql`UPDATE insights SET excerpt = ${item.excerpt}
          WHERE slug = ${item.slug} AND (excerpt IS NULL OR excerpt = '')`,
    );
    const n = r.rowCount ?? r.rows?.length ?? 0;
    if (n) console.log(`OK  backfilled excerpt for ${item.slug}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

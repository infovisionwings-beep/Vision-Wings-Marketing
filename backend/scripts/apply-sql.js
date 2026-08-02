// Apply a hand-written .sql file to DATABASE_URL over the Neon serverless driver,
// so no psql install is needed. Idempotent files only — this has no rollback.
// Usage: node scripts/apply-sql.js drizzle/manual/001_admin_invites.sql
require('dotenv').config();
const fs = require('fs');
// `neon()` is tagged-template only in v0.10 and cannot run a SQL string built at
// runtime; Client is the node-postgres-compatible surface that can.
const { Client } = require('@neondatabase/serverless');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/apply-sql.js <path-to.sql>');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set (checked backend/.env).');
  process.exit(1);
}

// Split on semicolons at end of line; adequate for plain DDL, which is all this runs.
const statements = fs
  .readFileSync(file, 'utf8')
  .split(/;\s*$/m)
  .map((s) => s.replace(/^\s*--.*$/gm, '').trim())
  .filter(Boolean);

(async () => {
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();
  try {
    for (const statement of statements) {
      await client.query(statement);
      console.log(`  ok  ${statement.split('\n')[0].slice(0, 70)}`);
    }
    console.log(`Applied ${statements.length} statement(s) from ${file}`);
  } finally {
    await client.end();
  }
})().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});

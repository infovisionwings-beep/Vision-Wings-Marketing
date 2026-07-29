const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function dropSchema() {
  try {
    await client.connect();
    console.log("Connected to database.");
    console.log("Dropping neon_auth schema...");
    await client.query('DROP SCHEMA IF EXISTS neon_auth CASCADE;');
    console.log("Successfully dropped neon_auth schema!");
  } catch (err) {
    console.error("Error dropping schema:", err);
  } finally {
    await client.end();
  }
}

dropSchema();

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import { pgTable, serial, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

dotenv.config({ path: '.env.local' });

const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

let url = process.env.DATABASE_URL;
if (!url.includes('-pooler')) {
  url = url.replace('ep-dry-sky-auq2rmju', 'ep-dry-sky-auq2rmju-pooler');
}
console.log('Testing with url:', url.split('@')[1]);

const sql = neon(url);
const db = drizzle(sql);

async function check() {
  try {
    const res = await db.select().from(projects).orderBy(projects.createdAt);
    console.log('SUCCESS PROJECTS:', res);
  } catch (e) {
    console.error('FAILED PROJECTS CAUSE:', e.cause || e);
  }
}
check();

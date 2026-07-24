import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import { pgTable, serial, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import https from 'https';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  year: varchar("year", { length: 4 }).notNull(),
  coverImage: text("cover_image"),
  content: text("content").notNull(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

neonConfig.fetchConnectionCache = true;
neonConfig.fetchFunction = (url, options) => {
  return fetch(url, { ...options, agent: new https.Agent({ family: 4 }) });
};

const sql = neon(process.env.DATABASE_URL);
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

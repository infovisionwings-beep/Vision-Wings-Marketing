// Must load before `neon()` reads DATABASE_URL below. ES imports are hoisted, so
// index.ts's own dotenv.config() runs *after* this module is evaluated — without
// this line the backend cannot start locally at all.
import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });

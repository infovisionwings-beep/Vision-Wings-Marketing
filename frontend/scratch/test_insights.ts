import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "../lib/db";
import { insights } from "../lib/db/schema";

async function test() {
  try {
    console.log("Querying insights table from DB...");
    const res = await db.select().from(insights);
    console.log("Successfully fetched insights:", res.length, "rows found.");
  } catch (err) {
    console.error("DB Query failed:", err);
  }
}

test();

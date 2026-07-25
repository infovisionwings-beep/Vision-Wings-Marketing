import { pgTable, serial, text, varchar, timestamp, boolean, jsonb, uuid, bigint } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
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

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  coverImage: text("cover_image"),
  content: text("content").notNull(),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(), // maps to Better Auth user email or id
  type: varchar("type", { length: 50 }).notNull(), // 'individual' or 'company'
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  address: jsonb("address"), // { country, state, city, pincode, fullAddress }
  companyName: varchar("company_name", { length: 255 }),
  employeesCount: varchar("employees_count", { length: 50 }),
  interests: jsonb("interests"), // array of selected services
  source: varchar("source", { length: 255 }), // where did you hear of us
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  originalFileName: text("original_file_name").notNull(),
  originalSize: bigint("original_size", { mode: "number" }).notNull(),
  durationSeconds: varchar("duration_seconds", { length: 50 }),
  status: varchar("status", { length: 50 }).notNull().default("uploaded"), // uploaded, queued, processing, completed, failed, retrying
  inputPath: text("input_path").notNull(),
  webmPath: text("webm_path"),
  mp4Path: text("mp4_path"),
  thumbnailPath: text("thumbnail_path"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});


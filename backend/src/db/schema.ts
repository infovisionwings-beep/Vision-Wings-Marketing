import { pgTable, serial, text, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

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

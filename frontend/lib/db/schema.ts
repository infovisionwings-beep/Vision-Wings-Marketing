import { pgTable, serial, text, varchar, timestamp, boolean, jsonb, uuid, bigint, integer, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  year: varchar("year", { length: 4 }).notNull(),
  coverImage: text("cover_image"),
  content: text("content").notNull(),
  isFeatured: boolean("is_featured").default(false),
  // 'active' | 'archived'. Defaults to 'active' so every existing project stays
  // visible exactly as before this column existed. There was previously no way
  // to archive a project short of a hard delete with no confirmation step.
  publishStatus: varchar("publish_status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company/client logos for the homepage marquee. Images come from the existing
// Media Library photo picker, so no separate upload path or conversion pipeline
// is needed here.
export const clientLogos = pgTable("client_logos", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: text("logo_url").notNull(),
  linkUrl: text("link_url"),
  displayOrder: integer("display_order").notNull().default(0),
  publishStatus: varchar("publish_status", { length: 20 }).notNull().default("active"),
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
  // Listing pages read this instead of the article body. Without it the cards
  // fell back to another article's excerpt, and every list query had to pull the
  // full `content` column just to have something to show.
  excerpt: text("excerpt"),
  authorName: varchar("author_name", { length: 255 }),
  authorRole: varchar("author_role", { length: 255 }),
  authorAvatar: text("author_avatar"),
  contributors: jsonb("contributors"),
  isPublished: boolean("is_published").default(false),
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, published, archived
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

/**
 * A reader's saved essays. Holds only the pairing — the essay itself is read
 * back through a join, so an essay the admin archives or deletes leaves every
 * reader's library on its own. There is no copy here to go stale.
 *
 * userId matches userProfiles.userId: the Better Auth email, lowercased.
 */
export const savedEssays = pgTable("saved_essays", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  insightId: integer("insight_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Newsletter opt-ins.
 *
 * There is no email field on the sign-up control: the address comes from the
 * session, so the only person who can subscribe an address is the person who
 * owns it. A row here means subscribed — unsubscribing deletes it rather than
 * setting a flag, so there is no "is it null or false" question to get wrong,
 * and re-subscribing is the same insert as the first time.
 *
 * userId matches userProfiles.userId: the Better Auth email, lowercased. It is
 * both the identity and the address to send to, so no second column is needed.
 */
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("new"), // new, contacted, archived
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  originalFileName: text("original_file_name").notNull(),
  originalSize: bigint("original_size", { mode: "number" }).notNull(),
  durationSeconds: varchar("duration_seconds", { length: 50 }),
  status: varchar("status", { length: 50 }).notNull().default("uploaded"), // processing status
  inputPath: text("input_path").notNull(),
  webmPath: text("webm_path"),
  mp4Path: text("mp4_path"),
  thumbnailPath: text("thumbnail_path"),
  errorMessage: text("error_message"),
  // New Admin Media Fields
  heading: varchar("heading", { length: 255 }),
  subHeading: varchar("sub_heading", { length: 255 }),
  description: text("description"),
  tags: jsonb("tags"),
  category: varchar("category", { length: 100 }),
  publishStatus: varchar("publish_status", { length: 50 }).notNull().default("draft"), // published, draft, archived
  isStarred: boolean("is_starred").default(false),
  displayOrder: integer("display_order").default(0),
  createdBy: varchar("created_by", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const photos = pgTable("photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  originalFileName: text("original_file_name").notNull(),
  originalSize: bigint("original_size", { mode: "number" }).notNull(),
  originalMimeType: varchar("original_mime_type", { length: 100 }).notNull(),
  width: bigint("width", { mode: "number" }),
  height: bigint("height", { mode: "number" }),
  status: varchar("status", { length: 50 }).notNull().default("uploaded"), // processing status
  inputPath: text("input_path").notNull(),
  webpPath: text("webp_path"),
  thumbnailPath: text("thumbnail_path"),
  errorMessage: text("error_message"),
  // New Admin Media Fields
  heading: varchar("heading", { length: 255 }),
  subHeading: varchar("sub_heading", { length: 255 }),
  description: text("description"),
  altText: varchar("alt_text", { length: 255 }),
  tags: jsonb("tags"),
  category: varchar("category", { length: 100 }),
  publishStatus: varchar("publish_status", { length: 50 }).notNull().default("draft"), // published, draft, archived
  isStarred: boolean("is_starred").default(false),
  displayOrder: integer("display_order").default(0),
  createdBy: varchar("created_by", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Admin Roles
export const adminRoles = pgTable("admin_roles", {
  email: varchar("email", { length: 255 }).primaryKey(),
  role: varchar("role", { length: 50 }).notNull(), // Developer, Admin, SEO, Content Manager
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by", { length: 255 }),
});

// Admin Audit Logs
export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  adminName: varchar("admin_name", { length: 255 }),
  adminEmail: varchar("admin_email", { length: 255 }),
  role: varchar("role", { length: 50 }),
  ipAddress: varchar("ip_address", { length: 100 }),
  userAgent: text("user_agent"),
  action: varchar("action", { length: 100 }).notNull(),
  resourceType: varchar("resource_type", { length: 100 }),
  resourceId: varchar("resource_id", { length: 255 }),
  previousValue: jsonb("previous_value"),
  newValue: jsonb("new_value"),
  status: varchar("status", { length: 50 }), // success, failure
  failureReason: text("failure_reason"),
}, (t) => ({
  // The only table here that grows without bound — it is append-only and never
  // pruned. The audit view reads it newest-first, so this is the one ordering
  // that will stop being free once the table outgrows a few pages.
  timestampIdx: index("admin_audit_logs_timestamp_idx").on(sql`${t.timestamp} DESC`),
}));

// Admin OTPs for Dual Verification
export const adminOtps = pgTable("admin_otps", {
  id: uuid("id").defaultRandom().primaryKey(),
  superAdminEmail: varchar("super_admin_email", { length: 255 }).notNull(),
  promotedEmail: varchar("promoted_email", { length: 255 }).notNull(),
  promotedName: varchar("promoted_name", { length: 255 }),
  roleToAssign: varchar("role_to_assign", { length: 50 }),
  superAdminOtp: varchar("super_admin_otp", { length: 10 }).notNull(),
  promotedOtp: varchar("promoted_otp", { length: 10 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // pending, verified, expired
  createdAt: timestamp("created_at").defaultNow(),
});

// Campaigns – Unified CMS table powering homepage marketing sections
export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description"),

  // Media
  coverImage: text("cover_image"),
  videoUrl: text("video_url"),
  posterImage: text("poster_image"),

  // Metadata
  client: varchar("client", { length: 255 }),
  category: varchar("category", { length: 100 }),
  year: varchar("year", { length: 4 }),
  duration: varchar("duration", { length: 20 }),
  quoteText: text("quote_text"),

  // Section assignment: "hero" | "samples" | "showcases" | "archive"
  section: varchar("section", { length: 50 }).notNull(),

  // Badges / Features (e.g. ["4K", "HLS", "HDR"])
  badges: jsonb("badges"),

  // CTAs (primarily for hero section)
  primaryCtaText: varchar("primary_cta_text", { length: 100 }),
  primaryCtaLink: varchar("primary_cta_link", { length: 500 }),
  secondaryCtaText: varchar("secondary_cta_text", { length: 100 }),
  secondaryCtaLink: varchar("secondary_cta_link", { length: 500 }),

  // SEO
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),

  // Publishing
  publishStatus: varchar("publish_status", { length: 50 }).notNull().default("draft"),
  isFeatured: boolean("is_featured").default(false),
  isStarred: boolean("is_starred").default(false),
  displayOrder: integer("display_order").default(0),
  scheduledAt: timestamp("scheduled_at"),

  // Audit
  createdBy: varchar("created_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Signup OTPs for first-time email verification
export const signupOtps = pgTable("signup_otps", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  otp: varchar("otp", { length: 10 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // pending, verified, expired
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  // Every signup path looks up the newest pending OTP for one email. Rows
  // accumulate per attempt and are only deleted on success, so this table grows
  // with failed signups even though it holds few rows at any moment.
  emailCreatedIdx: index("signup_otps_email_created_at_idx").on(t.email, sql`${t.createdAt} DESC`),
}));

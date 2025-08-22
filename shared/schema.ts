import { sql } from 'drizzle-orm';
import {
	boolean,
	index,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
	integer,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
	"sessions",
	{
		sid: varchar("sid").primaryKey(),
		sess: jsonb("sess").notNull(),
		expire: timestamp("expire").notNull(),
	},
	(table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
	id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
	email: varchar("email").unique(),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
	profileImageUrl: varchar("profile_image_url"),
	role: varchar("role").default("editor"), // 'admin' | 'editor'
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table (extended with status/progress)
export const projects = pgTable("projects", {
	id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
	nameEn: text("name_en").notNull(),
	nameAr: text("name_ar"),
	descriptionEn: text("description_en").notNull(),
	descriptionAr: text("description_ar"),
	imageUrl: text("image_url").notNull(),
	demoUrl: text("demo_url"),
	technologies: text("technologies").array().notNull().default(sql`'{}'::text[]`),
	isFeatured: boolean("is_featured").default(false),
	status: varchar("status").default("active"), // 'active' | 'completed'
	progress: integer("progress").default(0), // 0-100
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// Project images table
export const projectImages = pgTable("project_images", {
	id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
	projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
	url: text("url").notNull(),
	captionEn: text("caption_en"),
	captionAr: text("caption_ar"),
	orderIndex: integer("order_index").default(0),
	createdAt: timestamp("created_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
	id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
	name: text("name").notNull(),
	email: text("email").notNull(),
	subject: text("subject").notNull(),
	message: text("message").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

// News table
export const news = pgTable(
	"news",
	{
		id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
		slug: varchar("slug").notNull(),
		titleEn: text("title_en").notNull(),
		titleAr: text("title_ar"),
		summaryEn: text("summary_en"),
		summaryAr: text("summary_ar"),
		contentEn: text("content_en"),
		contentAr: text("content_ar"),
		images: text("images").array().notNull().default(sql`'{}'::text[]`),
		tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
		category: varchar("category"),
		status: varchar("status").default("draft"), // 'draft' | 'published'
		publishedAt: timestamp("published_at"),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => [uniqueIndex("idx_news_slug").on(table.slug)],
);

// Pages table
export const pages = pgTable(
	"pages",
	{
		id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
		slug: varchar("slug").notNull(),
		titleEn: text("title_en"),
		titleAr: text("title_ar"),
		contentEn: text("content_en"),
		contentAr: text("content_ar"),
		status: varchar("status").default("published"),
		updatedAt: timestamp("updated_at").defaultNow(),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => [uniqueIndex("idx_pages_slug").on(table.slug)],
);

// Albums table
export const albums = pgTable("albums", {
	id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
	nameEn: text("name_en").notNull(),
	nameAr: text("name_ar"),
	descriptionEn: text("description_en"),
	descriptionAr: text("description_ar"),
	coverImageUrl: text("cover_image_url"),
	createdAt: timestamp("created_at").defaultNow(),
});

// Photos table
export const photos = pgTable("photos", {
	id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
	albumId: varchar("album_id").notNull().references(() => albums.id, { onDelete: "cascade" }),
	url: text("url").notNull(),
	captionEn: text("caption_en"),
	captionAr: text("caption_ar"),
	orderIndex: integer("order_index").default(0),
	createdAt: timestamp("created_at").defaultNow(),
});

// Schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const updateProjectSchema = insertProjectSchema.partial();

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
	id: true,
	createdAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const updateNewsSchema = insertNewsSchema.partial();

export const insertPageSchema = createInsertSchema(pages).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const updatePageSchema = insertPageSchema.partial();

export const insertAlbumSchema = createInsertSchema(albums).omit({
	id: true,
	createdAt: true,
});

export const updateAlbumSchema = insertAlbumSchema.partial();

export const insertPhotoSchema = createInsertSchema(photos).omit({
	id: true,
	createdAt: true,
});

export const updatePhotoSchema = insertPhotoSchema.partial();

export const insertProjectImageSchema = createInsertSchema(projectImages).omit({
	id: true,
	createdAt: true,
});

export const updateProjectImageSchema = insertProjectImageSchema.partial();

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type UpdateNews = z.infer<typeof updateNewsSchema>;
export type Page = typeof pages.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type UpdatePage = z.infer<typeof updatePageSchema>;
export type Album = typeof albums.$inferSelect;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type UpdateAlbum = z.infer<typeof updateAlbumSchema>;
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type UpdatePhoto = z.infer<typeof updatePhotoSchema>;
export type ProjectImage = typeof projectImages.$inferSelect;
export type InsertProjectImage = z.infer<typeof insertProjectImageSchema>;
export type UpdateProjectImage = z.infer<typeof updateProjectImageSchema>;

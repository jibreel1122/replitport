var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  albums: () => albums,
  contactMessages: () => contactMessages,
  insertAlbumSchema: () => insertAlbumSchema,
  insertContactMessageSchema: () => insertContactMessageSchema,
  insertNewsSchema: () => insertNewsSchema,
  insertPageSchema: () => insertPageSchema,
  insertPhotoSchema: () => insertPhotoSchema,
  insertProjectImageSchema: () => insertProjectImageSchema,
  insertProjectSchema: () => insertProjectSchema,
  news: () => news,
  pages: () => pages,
  photos: () => photos,
  projectImages: () => projectImages,
  projects: () => projects,
  sessions: () => sessions,
  updateAlbumSchema: () => updateAlbumSchema,
  updateNewsSchema: () => updateNewsSchema,
  updatePageSchema: () => updatePageSchema,
  updatePhotoSchema: () => updatePhotoSchema,
  updateProjectImageSchema: () => updateProjectImageSchema,
  updateProjectSchema: () => updateProjectSchema,
  users: () => users
});
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("editor"),
  // 'admin' | 'editor'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar"),
  descriptionEn: text("description_en").notNull(),
  descriptionAr: text("description_ar"),
  imageUrl: text("image_url").notNull(),
  demoUrl: text("demo_url"),
  technologies: text("technologies").array().notNull().default(sql`'{}'::text[]`),
  isFeatured: boolean("is_featured").default(false),
  status: varchar("status").default("active"),
  // 'active' | 'completed'
  progress: integer("progress").default(0),
  // 0-100
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var projectImages = pgTable("project_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  captionEn: text("caption_en"),
  captionAr: text("caption_ar"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var news = pgTable(
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
    status: varchar("status").default("draft"),
    // 'draft' | 'published'
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
  },
  (table) => [uniqueIndex("idx_news_slug").on(table.slug)]
);
var pages = pgTable(
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
    createdAt: timestamp("created_at").defaultNow()
  },
  (table) => [uniqueIndex("idx_pages_slug").on(table.slug)]
);
var albums = pgTable("albums", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar"),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at").defaultNow()
});
var photos = pgTable("photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  albumId: varchar("album_id").notNull().references(() => albums.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  captionEn: text("caption_en"),
  captionAr: text("caption_ar"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updateProjectSchema = insertProjectSchema.partial();
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true
});
var insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updateNewsSchema = insertNewsSchema.partial();
var insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updatePageSchema = insertPageSchema.partial();
var insertAlbumSchema = createInsertSchema(albums).omit({
  id: true,
  createdAt: true
});
var updateAlbumSchema = insertAlbumSchema.partial();
var insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true
});
var updatePhotoSchema = insertPhotoSchema.partial();
var insertProjectImageSchema = createInsertSchema(projectImages).omit({
  id: true,
  createdAt: true
});
var updateProjectImageSchema = insertProjectImageSchema.partial();

// server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Please set up your Supabase database connection.");
}
var client = postgres(process.env.DATABASE_URL);
var db = drizzle(client, { schema: schema_exports });

// server/storage.ts
import { and, desc, eq, ilike, or, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Project operations
  async getProjects() {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }
  async getProjectById(id) {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  async createProject(project) {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }
  async updateProject(id, project) {
    const [updatedProject] = await db.update(projects).set({ ...project, updatedAt: /* @__PURE__ */ new Date() }).where(eq(projects.id, id)).returning();
    return updatedProject;
  }
  async deleteProject(id) {
    await db.delete(projects).where(eq(projects.id, id));
  }
  async getProjectImages(projectId) {
    return await db.select().from(projectImages).where(eq(projectImages.projectId, projectId)).orderBy(projectImages.orderIndex);
  }
  async addProjectImage(image) {
    const [row] = await db.insert(projectImages).values(image).returning();
    return row;
  }
  async updateProjectImage(id, data) {
    const [row] = await db.update(projectImages).set(data).where(eq(projectImages.id, id)).returning();
    return row;
  }
  async deleteProjectImage(id) {
    await db.delete(projectImages).where(eq(projectImages.id, id));
  }
  // Contact message operations
  async createContactMessage(message) {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
  async getContactMessages() {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
  // News operations
  async listNews(filters) {
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(news.status, filters.status));
    }
    if (filters?.category) {
      conditions.push(eq(news.category, filters.category));
    }
    if (filters?.search) {
      const like = `%${filters.search}%`;
      conditions.push(or(ilike(news.titleEn, like), ilike(news.titleAr, like), ilike(news.summaryEn, like), ilike(news.summaryAr, like)));
    }
    if (filters?.year) {
      conditions.push(sql2`EXTRACT(YEAR FROM ${news.publishedAt}) = ${filters.year}`);
    }
    if (filters?.tags && filters.tags.length > 0) {
      conditions.push(sql2`${filters.tags} && ${news.tags}`);
    }
    const whereClause = conditions.length ? and(...conditions) : void 0;
    let query = db.select().from(news).orderBy(desc(news.publishedAt ?? news.createdAt));
    if (whereClause) {
      query = query.where(whereClause);
    }
    if (filters?.limit && filters.limit > 0) {
      const rows = await query;
      return rows.slice(0, filters.limit);
    }
    return await query;
  }
  async getNewsBySlug(slugStr) {
    const [row] = await db.select().from(news).where(eq(news.slug, slugStr));
    return row;
  }
  async createNews(article) {
    const [row] = await db.insert(news).values(article).returning();
    return row;
  }
  async updateNews(id, article) {
    const [row] = await db.update(news).set({ ...article, updatedAt: /* @__PURE__ */ new Date() }).where(eq(news.id, id)).returning();
    return row;
  }
  async deleteNews(id) {
    await db.delete(news).where(eq(news.id, id));
  }
  // Pages
  async getPageBySlug(slug) {
    const [row] = await db.select().from(pages).where(eq(pages.slug, slug));
    return row;
  }
  async listPages() {
    return await db.select().from(pages).orderBy(desc(pages.updatedAt));
  }
  async createPage(pageData) {
    const [row] = await db.insert(pages).values(pageData).returning();
    return row;
  }
  async updatePage(id, pageData) {
    const [row] = await db.update(pages).set({ ...pageData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(pages.id, id)).returning();
    return row;
  }
  async deletePage(id) {
    await db.delete(pages).where(eq(pages.id, id));
  }
  // Albums & Photos
  async listAlbums() {
    return await db.select().from(albums).orderBy(desc(albums.createdAt));
  }
  async getAlbumById(id) {
    const [row] = await db.select().from(albums).where(eq(albums.id, id));
    return row;
  }
  async listPhotosByAlbum(albumId) {
    return await db.select().from(photos).where(eq(photos.albumId, albumId)).orderBy(photos.orderIndex);
  }
  async createAlbum(data) {
    const [row] = await db.insert(albums).values(data).returning();
    return row;
  }
  async updateAlbum(id, data) {
    const [row] = await db.update(albums).set(data).where(eq(albums.id, id)).returning();
    return row;
  }
  async deleteAlbum(id) {
    await db.delete(albums).where(eq(albums.id, id));
  }
  async addPhoto(photoData) {
    const [row] = await db.insert(photos).values(photoData).returning();
    return row;
  }
  async updatePhoto(id, data) {
    const [row] = await db.update(photos).set(data).where(eq(photos.id, id)).returning();
    return row;
  }
  async deletePhoto(id) {
    await db.delete(photos).where(eq(photos.id, id));
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client2 from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client2.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client2.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client2.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
import { z } from "zod";
function requireRole(role) {
  return async (req, res, next) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      if (role === "admin" && user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
      return next();
    } catch (e) {
      return res.status(500).json({ message: "Failed to authorize" });
    }
  };
}
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/projects", async (_req, res) => {
    try {
      const projects2 = await storage.getProjects();
      res.json(projects2);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  app2.post("/api/projects", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  app2.put("/api/projects/:id", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validatedData = updateProjectSchema.parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });
  app2.delete("/api/projects/:id", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });
  app2.get("/api/projects/:id/images", async (req, res) => {
    try {
      const images = await storage.getProjectImages(req.params.id);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project images" });
    }
  });
  app2.post("/api/projects/:id/images", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validated = insertProjectImageSchema.parse({ ...req.body, projectId: req.params.id });
      const img = await storage.addProjectImage(validated);
      res.status(201).json(img);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project image data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add project image" });
    }
  });
  app2.put("/api/project-images/:imageId", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validated = updateProjectImageSchema.parse(req.body);
      const img = await storage.updateProjectImage(req.params.imageId, validated);
      res.json(img);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project image data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project image" });
    }
  });
  app2.delete("/api/project-images/:imageId", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      await storage.deleteProjectImage(req.params.imageId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project image" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json({ message: "Message sent successfully", id: message.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      console.error("Error sending contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  app2.get("/api/contact-messages", isAuthenticated, requireRole("editor"), async (_req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const { q, year, category, tags, status, limit } = req.query;
      const list = await storage.listNews({
        search: q,
        year: year ? parseInt(year, 10) : void 0,
        category: category || void 0,
        tags: tags ? String(tags).split(",").map((t) => t.trim()).filter(Boolean) : void 0,
        status: status || "published",
        limit: limit ? parseInt(limit, 10) : void 0
      });
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });
  app2.get("/api/news/:slug", async (req, res) => {
    try {
      const article = await storage.getNewsBySlug(req.params.slug);
      if (!article) return res.status(404).json({ message: "Not found" });
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });
  app2.post("/api/news", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validated = insertNewsSchema.parse(req.body);
      const article = await storage.createNews(validated);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });
  app2.put("/api/news/:id", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validated = updateNewsSchema.parse(req.body);
      const article = await storage.updateNews(req.params.id, validated);
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update article" });
    }
  });
  app2.delete("/api/news/:id", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      await storage.deleteNews(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });
  app2.get("/api/pages", async (_req, res) => {
    try {
      const pages2 = await storage.listPages();
      res.json(pages2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });
  app2.get("/api/pages/:slug", async (req, res) => {
    try {
      const page = await storage.getPageBySlug(req.params.slug);
      if (!page) return res.status(404).json({ message: "Not found" });
      res.json(page);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });
  app2.post("/api/pages", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validated = insertPageSchema.parse(req.body);
      const page = await storage.createPage(validated);
      res.status(201).json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid page data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create page" });
    }
  });
  app2.put("/api/pages/:id", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validated = updatePageSchema.parse(req.body);
      const page = await storage.updatePage(req.params.id, validated);
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid page data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update page" });
    }
  });
  app2.delete("/api/pages/:id", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      await storage.deletePage(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete page" });
    }
  });
  app2.get("/api/albums", async (_req, res) => {
    try {
      const list = await storage.listAlbums();
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch albums" });
    }
  });
  app2.get("/api/albums/:id", async (req, res) => {
    try {
      const album = await storage.getAlbumById(req.params.id);
      if (!album) return res.status(404).json({ message: "Not found" });
      const photos2 = await storage.listPhotosByAlbum(req.params.id);
      res.json({ ...album, photos: photos2 });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch album" });
    }
  });
  app2.post("/api/albums", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validated = insertAlbumSchema.parse(req.body);
      const album = await storage.createAlbum(validated);
      res.status(201).json(album);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid album data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create album" });
    }
  });
  app2.put("/api/albums/:id", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validated = updateAlbumSchema.parse(req.body);
      const album = await storage.updateAlbum(req.params.id, validated);
      res.json(album);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid album data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update album" });
    }
  });
  app2.delete("/api/albums/:id", isAuthenticated, requireRole("admin"), async (req, res) => {
    try {
      await storage.deleteAlbum(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete album" });
    }
  });
  app2.post("/api/albums/:id/photos", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validated = insertPhotoSchema.parse({ ...req.body, albumId: req.params.id });
      const photo = await storage.addPhoto(validated);
      res.status(201).json(photo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid photo data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add photo" });
    }
  });
  app2.put("/api/photos/:photoId", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      const validated = updatePhotoSchema.parse(req.body);
      const photo = await storage.updatePhoto(req.params.photoId, validated);
      res.json(photo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid photo data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update photo" });
    }
  });
  app2.delete("/api/photos/:photoId", isAuthenticated, requireRole("editor"), async (req, res) => {
    try {
      await storage.deletePhoto(req.params.photoId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

import {
	users,
	projects,
	contactMessages,
	projectImages,
	news,
	pages,
	albums,
	photos,
	type User,
	type UpsertUser,
	type Project,
	type InsertProject,
	type UpdateProject,
	type ContactMessage,
	type InsertContactMessage,
	type ProjectImage,
	type InsertProjectImage,
	type UpdateProjectImage,
	type News as NewsType,
	type InsertNews,
	type UpdateNews,
	type Page as PageType,
	type InsertPage,
	type UpdatePage,
	type Album,
	type InsertAlbum,
	type UpdateAlbum,
	type Photo,
	type InsertPhoto,
	type UpdatePhoto,
} from "@shared/schema";
import { db } from "./db";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export interface IStorage {
	// User operations (required for Replit Auth)
	getUser(id: string): Promise<User | undefined>;
	upsertUser(user: UpsertUser): Promise<User>;
	
	// Project operations
	getProjects(): Promise<Project[]>;
	getProjectById(id: string): Promise<Project | undefined>;
	createProject(project: InsertProject): Promise<Project>;
	updateProject(id: string, project: UpdateProject): Promise<Project>;
	deleteProject(id: string): Promise<void>;
	
	// Project images
	getProjectImages(projectId: string): Promise<ProjectImage[]>;
	addProjectImage(image: InsertProjectImage): Promise<ProjectImage>;
	updateProjectImage(id: string, data: UpdateProjectImage): Promise<ProjectImage>;
	deleteProjectImage(id: string): Promise<void>;

	// Contact message operations
	createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
	getContactMessages(): Promise<ContactMessage[]>;

	// News operations
	listNews(filters?: { search?: string; year?: number; category?: string; tags?: string[]; status?: string; limit?: number; }): Promise<NewsType[]>;
	getNewsBySlug(slug: string): Promise<NewsType | undefined>;
	createNews(article: InsertNews): Promise<NewsType>;
	updateNews(id: string, article: UpdateNews): Promise<NewsType>;
	deleteNews(id: string): Promise<void>;

	// Pages operations
	getPageBySlug(slug: string): Promise<PageType | undefined>;
	listPages(): Promise<PageType[]>;
	createPage(page: InsertPage): Promise<PageType>;
	updatePage(id: string, page: UpdatePage): Promise<PageType>;
	deletePage(id: string): Promise<void>;

	// Albums & Photos
	listAlbums(): Promise<Album[]>;
	getAlbumById(id: string): Promise<Album | undefined>;
	listPhotosByAlbum(albumId: string): Promise<Photo[]>;
	createAlbum(data: InsertAlbum): Promise<Album>;
	updateAlbum(id: string, data: UpdateAlbum): Promise<Album>;
	deleteAlbum(id: string): Promise<void>;
	addPhoto(photo: InsertPhoto): Promise<Photo>;
	updatePhoto(id: string, data: UpdatePhoto): Promise<Photo>;
	deletePhoto(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
	// User operations
	async getUser(id: string): Promise<User | undefined> {
		const [user] = await db.select().from(users).where(eq(users.id, id));
		return user;
	}

	async upsertUser(userData: UpsertUser): Promise<User> {
		const [user] = await db
			.insert(users)
			.values(userData)
			.onConflictDoUpdate({
				target: users.id,
				set: {
					...userData,
					updatedAt: new Date(),
				},
			})
			.returning();
		return user;
	}

	// Project operations
	async getProjects(): Promise<Project[]> {
		return await db.select().from(projects).orderBy(desc(projects.createdAt));
	}

	async getProjectById(id: string): Promise<Project | undefined> {
		const [project] = await db.select().from(projects).where(eq(projects.id, id));
		return project;
	}

	async createProject(project: InsertProject): Promise<Project> {
		const [newProject] = await db
			.insert(projects)
			.values(project)
			.returning();
		return newProject;
	}

	async updateProject(id: string, project: UpdateProject): Promise<Project> {
		const [updatedProject] = await db
			.update(projects)
			.set({ ...project, updatedAt: new Date() })
			.where(eq(projects.id, id))
			.returning();
		return updatedProject;
	}

	async deleteProject(id: string): Promise<void> {
		await db.delete(projects).where(eq(projects.id, id));
	}

	async getProjectImages(projectId: string): Promise<ProjectImage[]> {
		return await db.select().from(projectImages).where(eq(projectImages.projectId, projectId)).orderBy(projectImages.orderIndex);
	}

	async addProjectImage(image: InsertProjectImage): Promise<ProjectImage> {
		const [row] = await db.insert(projectImages).values(image).returning();
		return row;
	}

	async updateProjectImage(id: string, data: UpdateProjectImage): Promise<ProjectImage> {
		const [row] = await db.update(projectImages).set(data).where(eq(projectImages.id, id)).returning();
		return row;
	}

	async deleteProjectImage(id: string): Promise<void> {
		await db.delete(projectImages).where(eq(projectImages.id, id));
	}

	// Contact message operations
	async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
		const [newMessage] = await db
			.insert(contactMessages)
			.values(message)
			.returning();
		return newMessage;
	}

	async getContactMessages(): Promise<ContactMessage[]> {
		return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
	}

	// News operations
	async listNews(filters?: { search?: string; year?: number; category?: string; tags?: string[]; status?: string; limit?: number; }): Promise<NewsType[]> {
		const conditions: any[] = [];
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
			conditions.push(sql`EXTRACT(YEAR FROM ${news.publishedAt}) = ${filters.year}`);
		}
		if (filters?.tags && filters.tags.length > 0) {
			conditions.push(sql`${filters.tags} && ${news.tags}`);
		}
		const whereClause = conditions.length ? and(...conditions) : undefined as any;
		let query = db.select().from(news).orderBy(desc(news.publishedAt ?? news.createdAt));
		if (whereClause) {
			// @ts-ignore drizzle type limitation for dynamic where
			query = query.where(whereClause);
		}
		if (filters?.limit && filters.limit > 0) {
			// drizzle does not support limit chaining nicely with dynamic build; rely on sql template if needed
			// For simplicity, fetch then slice
			const rows = await query;
			return rows.slice(0, filters.limit);
		}
		return await query;
	}

	async getNewsBySlug(slugStr: string): Promise<NewsType | undefined> {
		const [row] = await db.select().from(news).where(eq(news.slug, slugStr));
		return row;
	}

	async createNews(article: InsertNews): Promise<NewsType> {
		const [row] = await db.insert(news).values(article).returning();
		return row;
	}

	async updateNews(id: string, article: UpdateNews): Promise<NewsType> {
		const [row] = await db.update(news).set({ ...article, updatedAt: new Date() }).where(eq(news.id, id)).returning();
		return row;
	}

	async deleteNews(id: string): Promise<void> {
		await db.delete(news).where(eq(news.id, id));
	}

	// Pages
	async getPageBySlug(slug: string): Promise<PageType | undefined> {
		const [row] = await db.select().from(pages).where(eq(pages.slug, slug));
		return row;
	}

	async listPages(): Promise<PageType[]> {
		return await db.select().from(pages).orderBy(desc(pages.updatedAt));
	}

	async createPage(pageData: InsertPage): Promise<PageType> {
		const [row] = await db.insert(pages).values(pageData).returning();
		return row;
	}

	async updatePage(id: string, pageData: UpdatePage): Promise<PageType> {
		const [row] = await db.update(pages).set({ ...pageData, updatedAt: new Date() }).where(eq(pages.id, id)).returning();
		return row;
	}

	async deletePage(id: string): Promise<void> {
		await db.delete(pages).where(eq(pages.id, id));
	}

	// Albums & Photos
	async listAlbums(): Promise<Album[]> {
		return await db.select().from(albums).orderBy(desc(albums.createdAt));
	}

	async getAlbumById(id: string): Promise<Album | undefined> {
		const [row] = await db.select().from(albums).where(eq(albums.id, id));
		return row;
	}

	async listPhotosByAlbum(albumId: string): Promise<Photo[]> {
		return await db.select().from(photos).where(eq(photos.albumId, albumId)).orderBy(photos.orderIndex);
	}

	async createAlbum(data: InsertAlbum): Promise<Album> {
		const [row] = await db.insert(albums).values(data).returning();
		return row;
	}

	async updateAlbum(id: string, data: UpdateAlbum): Promise<Album> {
		const [row] = await db.update(albums).set(data).where(eq(albums.id, id)).returning();
		return row;
	}

	async deleteAlbum(id: string): Promise<void> {
		await db.delete(albums).where(eq(albums.id, id));
	}

	async addPhoto(photoData: InsertPhoto): Promise<Photo> {
		const [row] = await db.insert(photos).values(photoData).returning();
		return row;
	}

	async updatePhoto(id: string, data: UpdatePhoto): Promise<Photo> {
		const [row] = await db.update(photos).set(data).where(eq(photos.id, id)).returning();
		return row;
	}

	async deletePhoto(id: string): Promise<void> {
		await db.delete(photos).where(eq(photos.id, id));
	}
}

export const storage = new DatabaseStorage();

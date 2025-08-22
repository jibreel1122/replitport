import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, updateProjectSchema, insertContactMessageSchema, insertNewsSchema, updateNewsSchema, insertPageSchema, updatePageSchema, insertAlbumSchema, updateAlbumSchema, insertPhotoSchema, updatePhotoSchema, insertProjectImageSchema, updateProjectImageSchema } from "@shared/schema";
import { z } from "zod";

function requireRole(role: "admin" | "editor") {
	return async (req: any, res: any, next: any) => {
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

export async function registerRoutes(app: Express): Promise<Server> {
	// Auth middleware
	await setupAuth(app);

	// Auth routes
	app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
		try {
			const userId = req.user.claims.sub;
			const user = await storage.getUser(userId);
			res.json(user);
		} catch (error) {
			console.error("Error fetching user:", error);
			res.status(500).json({ message: "Failed to fetch user" });
		}
	});

	// Public project routes
	app.get('/api/projects', async (_req, res) => {
		try {
			const projects = await storage.getProjects();
			res.json(projects);
		} catch (error) {
			console.error("Error fetching projects:", error);
			res.status(500).json({ message: "Failed to fetch projects" });
		}
	});

	app.get('/api/projects/:id', async (req, res) => {
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

	// Protected admin project routes
	app.post('/api/projects', isAuthenticated, requireRole("editor"), async (req, res) => {
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

	app.put('/api/projects/:id', isAuthenticated, requireRole("editor"), async (req, res) => {
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

	app.delete('/api/projects/:id', isAuthenticated, requireRole("admin"), async (req, res) => {
		try {
			await storage.deleteProject(req.params.id);
			res.status(204).send();
		} catch (error) {
			console.error("Error deleting project:", error);
			res.status(500).json({ message: "Failed to delete project" });
		}
	});

	// Project images
	app.get('/api/projects/:id/images', async (req, res) => {
		try {
			const images = await storage.getProjectImages(req.params.id);
			res.json(images);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch project images" });
		}
	});
	app.post('/api/projects/:id/images', isAuthenticated, requireRole("editor"), async (req, res) => {
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
	app.put('/api/project-images/:imageId', isAuthenticated, requireRole("editor"), async (req, res) => {
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
	app.delete('/api/project-images/:imageId', isAuthenticated, requireRole("editor"), async (req, res) => {
		try {
			await storage.deleteProjectImage(req.params.imageId);
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: "Failed to delete project image" });
		}
	});

	// Contact form route
	app.post('/api/contact', async (req, res) => {
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

	// Protected admin contact messages route
	app.get('/api/contact-messages', isAuthenticated, requireRole("editor"), async (_req, res) => {
		try {
			const messages = await storage.getContactMessages();
			res.json(messages);
		} catch (error) {
			console.error("Error fetching contact messages:", error);
			res.status(500).json({ message: "Failed to fetch contact messages" });
		}
	});

	// News routes
	app.get('/api/news', async (req, res) => {
		try {
			const { q, year, category, tags, status, limit } = req.query as any;
			const list = await storage.listNews({
				search: q,
				year: year ? parseInt(year, 10) : undefined,
				category: category || undefined,
				tags: tags ? String(tags).split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
				status: status || 'published',
				limit: limit ? parseInt(limit, 10) : undefined,
			});
			res.json(list);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch news" });
		}
	});
	app.get('/api/news/:slug', async (req, res) => {
		try {
			const article = await storage.getNewsBySlug(req.params.slug);
			if (!article) return res.status(404).json({ message: "Not found" });
			res.json(article);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch article" });
		}
	});
	app.post('/api/news', isAuthenticated, requireRole("editor"), async (req, res) => {
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
	app.put('/api/news/:id', isAuthenticated, requireRole("editor"), async (req, res) => {
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
	app.delete('/api/news/:id', isAuthenticated, requireRole("admin"), async (req, res) => {
		try {
			await storage.deleteNews(req.params.id);
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: "Failed to delete article" });
		}
	});

	// Pages routes
	app.get('/api/pages', async (_req, res) => {
		try {
			const pages = await storage.listPages();
			res.json(pages);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch pages" });
		}
	});
	app.get('/api/pages/:slug', async (req, res) => {
		try {
			const page = await storage.getPageBySlug(req.params.slug);
			if (!page) return res.status(404).json({ message: "Not found" });
			res.json(page);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch page" });
		}
	});
	app.post('/api/pages', isAuthenticated, requireRole("editor"), async (req, res) => {
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
	app.put('/api/pages/:id', isAuthenticated, requireRole("editor"), async (req, res) => {
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
	app.delete('/api/pages/:id', isAuthenticated, requireRole("admin"), async (req, res) => {
		try {
			await storage.deletePage(req.params.id);
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: "Failed to delete page" });
		}
	});

	// Albums & Photos
	app.get('/api/albums', async (_req, res) => {
		try {
			const list = await storage.listAlbums();
			res.json(list);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch albums" });
		}
	});
	app.get('/api/albums/:id', async (req, res) => {
		try {
			const album = await storage.getAlbumById(req.params.id);
			if (!album) return res.status(404).json({ message: "Not found" });
			const photos = await storage.listPhotosByAlbum(req.params.id);
			res.json({ ...album, photos });
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch album" });
		}
	});
	app.post('/api/albums', isAuthenticated, requireRole("editor"), async (req, res) => {
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
	app.put('/api/albums/:id', isAuthenticated, requireRole("editor"), async (req, res) => {
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
	app.delete('/api/albums/:id', isAuthenticated, requireRole("admin"), async (req, res) => {
		try {
			await storage.deleteAlbum(req.params.id);
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: "Failed to delete album" });
		}
	});

	app.post('/api/albums/:id/photos', isAuthenticated, requireRole("editor"), async (req, res) => {
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
	app.put('/api/photos/:photoId', isAuthenticated, requireRole("editor"), async (req, res) => {
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
	app.delete('/api/photos/:photoId', isAuthenticated, requireRole("editor"), async (req, res) => {
		try {
			await storage.deletePhoto(req.params.photoId);
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: "Failed to delete photo" });
		}
	});

	const httpServer = createServer(app);
	return httpServer;
}

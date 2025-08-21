import express from "express";
import { registerRoutes } from "../server/routes";

let cachedApp: express.Express | null = null;

async function getApp(): Promise<express.Express> {
  if (cachedApp) return cachedApp;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  await registerRoutes(app);
  cachedApp = app;
  return app;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  return (app as any)(req, res);
}


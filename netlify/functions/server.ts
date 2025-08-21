import express from "express";
import serverless from "serverless-http";
import { registerRoutes } from "../../server/routes";

let cachedHandler: any;

export const handler = async (event: any, context: any) => {
  if (!cachedHandler) {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    await registerRoutes(app);

    cachedHandler = serverless(app, {
      request: (req: any, ev: any) => {
        // Preserve original path for logging
        (req as any).originalUrl = req.url;
      },
    });
  }

  return cachedHandler(event, context);
};


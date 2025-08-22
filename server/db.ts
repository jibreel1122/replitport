import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";

import Database from "better-sqlite3";
neonConfig.webSocketConstructor = ws;

let db: any;

if (!process.env.DATABASE_URL) {
  // Fallback to SQLite for development
  console.log("DATABASE_URL not set, using SQLite for development");
  const sqlite = new Database("dev.db");
  db = drizzleSqlite(sqlite, { schema });
} else if (process.env.DATABASE_URL.startsWith("file:")) {
  // SQLite database
  const dbPath = process.env.DATABASE_URL.replace("file:", "");
  const sqlite = new Database(dbPath);
  db = drizzleSqlite(sqlite, { schema });
} else {
  // PostgreSQL database
  const client = postgres(process.env.DATABASE_URL);
  db = drizzle(client, { schema });
}

export { db };
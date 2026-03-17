import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Use a placeholder URL at build time — no actual queries run during `next build`
// since all data-fetching pages use `export const dynamic = "force-dynamic"`
// and API routes are never pre-rendered.
const sql = neon(process.env.DATABASE_URL ?? "postgresql://build:build@build.neon.tech/build");

export const db = drizzle(sql, { schema });

export type DB = typeof db;

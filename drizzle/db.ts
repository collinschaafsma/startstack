import { sql } from "@vercel/postgres"
import { drizzle } from "drizzle-orm/vercel-postgres"
import * as schema from "./schema"

/**
 * DB
 *
 * This is the database instance.
 * It is used to interact with the database.
 *
 * @returns {DB} - The database instance.
 * @link https://supabase.com/docs/guides/database/connecting-to-postgres/serverless-drivers
 */
export const db = drizzle(sql, { schema })

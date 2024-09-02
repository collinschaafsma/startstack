import { defineConfig } from "drizzle-kit"

/**
 * Drizzle Config
 *
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
})

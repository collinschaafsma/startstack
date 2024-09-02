import "dotenv/config"
import { sql } from "@vercel/postgres"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { drizzle } from "drizzle-orm/vercel-postgres"

/**
 * Migrates the database.
 *
 * @returns {Promise<void>} - A promise that resolves when the migration is complete.
 * @link https://orm.drizzle.team/docs/migrations
 */
async function main() {
  const db = drizzle(sql)
  await migrate(db, { migrationsFolder: "drizzle" })
}

main()
  .then(async () => {
    await sql.end()
  })
  .catch(async error => {
    console.error(error.error)
    await sql.end()
    process.exit(1)
  })

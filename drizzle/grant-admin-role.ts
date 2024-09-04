import "dotenv/config"
import { sql } from "@vercel/postgres"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/vercel-postgres"
import { z } from "zod"
import { users } from "./schema"

/**
 * Grants the admin role to the user with the provided email.
 *
 * @returns {Promise<void>} - A promise that resolves when the role is granted.
 */
async function main() {
  const email = process.argv[2]
  const emailSchema = z.string().email()

  if (!email) {
    console.error("Please provide an email address as an argument.")
    process.exit(1)
  }

  const parsedEmail = emailSchema.safeParse(email)

  if (!parsedEmail.success) {
    console.error("Invalid email address.")
    process.exit(1)
  }

  const db = drizzle(sql)
  await db
    .update(users)
    .set({ role: "admin" })
    .where(eq(users.email, parsedEmail.data))

  console.log(`Admin role granted to ${parsedEmail.data}.`)
  await sql.end()
  process.exit(0)
}

main().catch(async error => {
  console.error(error.error)
  await sql.end()
  process.exit(1)
})

import { type InferSelectModel } from "drizzle-orm"
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { users } from "@/drizzle/schema"

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string
  }

  interface Session {
    user: {
      role?: string
    } & DefaultSession["user"]
  }
}

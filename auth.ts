import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { db } from "./drizzle/db"
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "./drizzle/schema"
import { googleOauthEnabled, resendEnabled } from "./lib/constants"
import { customSendVerificationRequest } from "./lib/email"

/**
 * Providers
 *
 * This is the list of providers that are supported.
 * Resend is used for sending emails (magic links).
 * Google is used for authentication.
 * @link https://authjs.dev/getting-started/providers/resend
 * @link https://authjs.dev/getting-started/providers/google
 * @returns {Provider[]} - The list of providers.
 */
export const providers: Provider[] = [
  ...(resendEnabled
    ? [
        Resend({
          apiKey: process.env.RESEND_API_KEY,
          from: process.env.AUTH_EMAIL_FROM,
          sendVerificationRequest: customSendVerificationRequest,
        }),
      ]
    : []),
  ...(googleOauthEnabled
    ? [
        Google({
          allowDangerousEmailAccountLinking: true, // we trust that Google has verified the email
        }),
      ]
    : []),
]

/**
 * Adapter
 *
 * This is the adapter that is used to connect to the database.
 *
 * @link https://authjs.dev/reference/drizzle-adapter
 */
const adapter = DrizzleAdapter(db, {
  usersTable: users,
  sessionsTable: sessions,
  accountsTable: accounts,
  authenticatorsTable: authenticators,
  verificationTokensTable: verificationTokens,
})

/**
 * Auth Configuration
 *
 * @link https://authjs.dev/getting-started/migrating-to-v5
 **/
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers,
  adapter,
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role
      return session
    },
    async signIn({ user, profile, account }) {
      if (user.id && account?.provider === "google") {
        // user.image = profile?.avatar_url as string
      }

      return true
    },
  },
})

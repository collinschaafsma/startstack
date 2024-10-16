import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "../globals.css"
import dynamic from "next/dynamic"
import { SessionProvider } from "next-auth/react"
import { appDescription, appName, baseUrl } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { PostHogProvider } from "@/components/post-hog-provider"
import { ThemeProvider } from "@/components/theme-provider"

const PostHogPageView = dynamic(() => import("@/components/post-hog-page-view"))

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  applicationName: appName,
  icons: {
    icon: "/favicon.ico",
  },
  title: {
    default: appName,
    template: `%s - ${appName}`,
  },
  description: appDescription,
  robots: {
    follow: true,
    index: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <PostHogProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <PostHogPageView />
          </SessionProvider>
        </body>
      </PostHogProvider>
    </html>
  )
}

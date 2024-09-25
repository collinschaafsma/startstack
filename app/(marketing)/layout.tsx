import type { Metadata } from "next"
import { Chivo, Inter as FontSans } from "next/font/google"
import "../globals.css"
import dynamic from "next/dynamic"
import { SessionProvider } from "next-auth/react"
import {
  appDescription,
  appName,
  baseUrl,
  enableComingSoon,
  environment,
  twitterCreator,
  twitterSite,
} from "@/lib/constants"
import { cn } from "@/lib/utils"
import { PostHogProvider } from "@/components/post-hog-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "./_components/footer"
import { Header } from "./_components/header"

const PostHogPageView = dynamic(
  () => import("@/components/post-hog-page-view"),
  {
    ssr: false,
  }
)

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const chivo = Chivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-chivo",
})

let robots = {
  follow: true,
  index: true,
}

if (environment !== "production") {
  robots = {
    follow: false,
    index: false,
  }
}

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
  robots,
  ...(twitterCreator && {
    twitter: {
      card: "summary_large_image",
      creator: twitterCreator,
      site: twitterSite,
    },
  }),
}

export default function RootLayout({
  children,
  comingSoon,
}: Readonly<{
  children: React.ReactNode
  comingSoon: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <PostHogProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            chivo.variable
          )}
        >
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {enableComingSoon ? (
                comingSoon
              ) : (
                <div className="flex min-h-dvh flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              )}
            </ThemeProvider>
            <PostHogPageView />
          </SessionProvider>
        </body>
      </PostHogProvider>
    </html>
  )
}

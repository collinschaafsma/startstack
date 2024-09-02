import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "../globals.css"
import dynamic from "next/dynamic"
import { SessionProvider } from "next-auth/react"
import { appDescription, appName, baseUrl } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { PostHogProvider } from "@/components/post-hog-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { DesktopNav } from "./_components/nav"
import { NavProvider } from "./_components/nav/provider"

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
    follow: false,
    index: false,
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
              <NavProvider>
                <div className="flex min-h-screen w-full flex-col bg-muted/40">
                  <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                    <DesktopNav />
                  </aside>
                  {children}
                </div>
              </NavProvider>
            </ThemeProvider>
            <PostHogPageView />
          </SessionProvider>
        </body>
      </PostHogProvider>
    </html>
  )
}

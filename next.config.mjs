import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    after: true,
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      // next15 dropped the .xml extension from the sitemap
      {
        source: "/sitemap.xml",
        destination: "/sitemap",
      },
      // posthog proxy
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ]
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
}

// export with sentry config, if you don't have a sentry auth token it will just ignore it
export default withSentryConfig(nextConfig, {
  silent: true, // Used to suppress logs, set to false to see sentry logs on build
  telemetry: false, // Set to true to send telemetry data to sentry
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#configure-tunneling-to-avoid-ad-blockers
  tunnelRoute: "/monitoring-tunnel",
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
  hideSourceMaps: process.env.NEXT_PUBLIC_VERCEL_ENV === "production",
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#disable-the-sentry-sdk-debug-logger-to-save-bundle-size
  disableLogger: process.env.NEXT_PUBLIC_VERCEL_ENV === "production",
})

import type { MetadataRoute } from "next"
import { baseUrl, environment } from "@/lib/constants"

/**
 * Robots.ts
 *
 * Configures the behavior of web crawlers (robots) for the application:
 * - Disallows crawling on non-production environments
 * - Allows crawling on production environments
 * - Sets the sitemap URL to the generated sitemap.xml file
 * - Specifies the base URL for the application
 * @link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file
 */
export default function robots(): MetadataRoute.Robots {
  // Disallow crawling on non-production environments
  if (environment !== "production") {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    }
  }

  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

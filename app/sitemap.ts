import type { MetadataRoute } from "next"
import { baseUrl, environment } from "@/lib/constants"

/**
 * Sitemap.ts
 *
 * Generates a sitemap for the application:
 * - Specifies the base URL for the application
 * @link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Generate sitemap only for production
  if (environment !== "production") return []

  // add all the routes you want to include in the sitemap here
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]
}

import type { MetadataRoute } from "next";
import { SITE_URL, NOINDEX_ROUTES } from "@/lib/site";

/**
 * robots.txt — the SEO audit reported it missing entirely.
 *
 * Legal pages are disallowed to match the `robots: { index: false }` already set
 * in their page metadata, so the two signals agree.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: NOINDEX_ROUTES,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

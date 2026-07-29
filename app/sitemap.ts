import type { MetadataRoute } from "next";
import { SITE_URL, INDEXABLE_ROUTES } from "@/lib/site";
import { BLOGS } from "@/lib/content";

/**
 * sitemap.xml — the SEO audit reported it missing entirely.
 *
 * Static routes come from lib/site; blog posts are appended from the content
 * source with their real publish dates, so new posts appear automatically.
 * Legal pages are omitted on purpose (they are noindex).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = INDEXABLE_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const posts = BLOGS.map((p) => ({
    url: `${SITE_URL}/blogs/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...pages, ...posts];
}

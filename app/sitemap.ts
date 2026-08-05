import type { MetadataRoute } from "next";
import { SITE_URL, INDEXABLE_ROUTES } from "@/lib/site";
import { getPosts } from "@/lib/public-blogs";

/**
 * sitemap.xml — the SEO audit reported it missing entirely.
 *
 * Static routes come from lib/site; blog posts are read from the database with
 * their real publish dates, so a post published in the dashboard appears here
 * without a redeploy. Legal pages are omitted on purpose (they are noindex).
 *
 * getPosts() falls back to lib/content.ts if Atlas is unreachable, so an outage
 * degrades the sitemap to the seeded posts rather than emptying it — a sitemap
 * that suddenly drops every URL is a signal Google acts on.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages = INDEXABLE_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const posts = (await getPosts()).map((p) => ({
    url: `${SITE_URL}/blogs/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...pages, ...posts];
}

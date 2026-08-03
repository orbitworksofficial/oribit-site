import type { Metadata } from "next";
import { chromeFor } from "./routes";
import { SITE_URL, NOINDEX_ROUTES } from "./site";

/**
 * The shared square share card, rendered by app/opengraph-image.tsx.
 *
 * Declared explicitly because Next only auto-attaches a file-convention OG
 * image when the route does NOT define `openGraph` itself. pageMetadata does
 * define it (for the canonical url), so inner pages were shipping no og:image
 * at all and previewed as a bare link.
 *
 * Keep the dimensions in step with `size` in app/opengraph-image.tsx.
 */
const OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 1200,
  alt: "Orbit Works: AI automation and IT services",
};

/**
 * Full per-page metadata: title, description, canonical, OpenGraph, Twitter.
 *
 * Pages previously exported only { title, description }, so every page inherited
 * the ROOT canonical (`/`) and the root OG tags. That told Google every inner
 * page was a duplicate of the homepage — which is why Services, Industries,
 * About etc. were not being indexed on their own terms — and made every shared
 * link preview show the homepage.
 *
 * One call per page keeps all of that correct and in sync with lib/routes.
 */
export function pageMetadata(path: string): Metadata {
  const { title, description } = chromeFor(path);
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const noindex = NOINDEX_ROUTES.includes(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: "Orbit Works",
      title,
      description,
      locale: "en_US",
      images: [OG_IMAGE],
    },
    /**
     * These pages inherit the square share card from app/opengraph-image.tsx,
     * so `summary` (square thumbnail) rather than `summary_large_image`, which
     * would crop it to 2:1 and cut the logo. Blog posts below keep the large
     * card — they supply their own 16:9 cover.
     */
    twitter: { card: "summary", title, description, images: [OG_IMAGE.url] },
  };
}

/** Article metadata for a blog post. */
export function postMetadata(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
}): Metadata {
  const url = `${SITE_URL}/blogs/${post.slug}`;
  return {
    title: `${post.title} | OrbitWorks`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Orbit Works",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: `${SITE_URL}${post.image}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`${SITE_URL}${post.image}`],
    },
  };
}

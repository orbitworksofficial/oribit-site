import type { Metadata } from "next";
import { chromeFor } from "./routes";
import { SITE_URL, NOINDEX_ROUTES } from "./site";

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
    },
    twitter: { card: "summary_large_image", title, description },
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

import type { Metadata } from "next";
import { chromeFor } from "./routes";
import { SITE_URL, NOINDEX_ROUTES, absoluteUrl } from "./site";

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
 * Hand-made share cards in public/og, mapped to the routes they belong to.
 *
 * These take priority over the generated square card above, so a shared link
 * previews artwork made for that page rather than one generic image for the
 * whole site.
 *
 * Fewer images than routes, so related pages share one deliberately: the four
 * legal routes all take policy, and the pages without their own card fall
 * back to home rather than to the generated square, which keeps every preview
 * the same shape. A route absent from this map still works — it simply gets
 * the generated card.
 *
 * Dimensions are the files' real size, not the 1200x630 ideal. Declaring
 * anything else makes scrapers reserve the wrong box and letterbox the image.
 */
const OG_DIR = "/og";
const OG_W = 1184;
const OG_H = 672;

const ROUTE_OG: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/contact": "contact",
  "/products/aeo-geo": "aeo-geo",
  "/privacy": "policy",
  "/terms": "policy",
  "/refund-policy": "policy",
  "/legal": "policy",
  // No card of their own yet; home keeps the preview on-brand and landscape.
  "/products": "home",
  "/industries": "home",
  "/case-studies": "home",
  "/resources": "home",
  "/blogs": "home",
};

/** The share card for a route: its own artwork, else the generated square. */
export function ogImageFor(path: string) {
  const name = ROUTE_OG[path];
  if (!name) return { image: OG_IMAGE, large: false };
  const { title } = chromeFor(path);
  return {
    image: {
      url: `${SITE_URL}${OG_DIR}/${name}.jpeg`,
      width: OG_W,
      height: OG_H,
      alt: title,
    },
    large: true,
  };
}

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
  const { image, large } = ogImageFor(path);

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
      images: [image],
    },
    /**
     * Card type follows the artwork. Routes with a landscape card in public/og
     * get `summary_large_image`; the rest still inherit the square card from
     * app/opengraph-image.tsx and must stay `summary`, since the large variant
     * would crop a square to 2:1 and cut the logo.
     */
    twitter: {
      card: large ? "summary_large_image" : "summary",
      title,
      description,
      images: [image.url],
    },
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
      images: [{ url: absoluteUrl(post.image) }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [absoluteUrl(post.image)],
    },
  };
}

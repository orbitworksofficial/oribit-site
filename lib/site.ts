/**
 * Canonical production origin, in ONE place.
 *
 * robots.txt, sitemap.xml, the JSON-LD graph and metadataBase all derive from
 * this, so switching domains is a single edit.
 *
 * NOTE: this must match the domain the site is actually served from, or Google
 * treats the canonical/sitemap URLs as cross-domain and ignores them. It is
 * currently orbitworks.com (matching the legal documents); the contact address
 * uses orb-itworks.com, which is worth reconciling.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://orb-itworks.com";

/**
 * Absolute URL for an image that may already be absolute.
 *
 * Images used to be site-relative paths only, so `${SITE_URL}${post.image}` was
 * safe. Cloudinary returns fully-qualified https URLs, and blindly prefixing
 * one produced "https://orb-itworks.comhttps://res.cloudinary.com/…" — which
 * silently broke every OpenGraph card, Twitter card and Article schema image
 * while the page itself still looked fine.
 */
export function absoluteUrl(url: string): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Routes that should be indexed, in sitemap priority order. */
export const INDEXABLE_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/industries", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/case-studies", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blogs", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/products", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/resources", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
];

/** Legal pages — reachable, but deliberately kept out of the index. */
export const NOINDEX_ROUTES = ["/privacy", "/terms", "/refund-policy", "/legal"];

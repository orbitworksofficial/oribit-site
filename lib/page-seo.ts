import "server-only";

import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

import { getPageSeo } from "./seo-settings";
import { pageMetadata } from "./seo";
import { SITE_URL } from "./site";

/**
 * Per-page metadata, database first, hardcoded second.
 *
 * The values in lib/routes.ts remain the source of truth for anything the
 * dashboard has not overridden. That ordering is deliberate: if Atlas is
 * unreachable, a row is missing, or a field is left blank, the page still ships
 * the copy it shipped before this was wired — a page with no <title> or a blank
 * description is a live SEO regression, so an outage must never be able to
 * cause one. Every DB value below is treated as an override of a working
 * default, never as a replacement for it.
 *
 * Cached with unstable_cache so this costs one Atlas round-trip per route per
 * revalidation window rather than one per request, which keeps the pages
 * effectively static. Saving from the dashboard calls revalidateSeo() to clear
 * it immediately, so an edit is live without waiting for the window to lapse.
 */

/** Shared cache tag, so one save can flush every page at once. */
export const SEO_TAG = "page-seo";

/** Seconds before a cached row is refetched even without an explicit purge. */
const REVALIDATE = 3600;

/** Treat whitespace-only admin input as "not set" rather than as an override. */
function clean(v: string | undefined | null): string | undefined {
  const t = v?.trim();
  return t ? t : undefined;
}

/**
 * `robots` arrives from the dashboard as a directive string ("noindex, follow")
 * because that is what the field shows the editor; Next wants booleans.
 */
function parseRobots(v: string | undefined) {
  const s = clean(v)?.toLowerCase();
  if (!s) return undefined;
  return { index: !s.includes("noindex"), follow: !s.includes("nofollow") };
}

const readRow = unstable_cache(
  async (pageKey: string) => {
    try {
      const doc = await getPageSeo(pageKey);
      if (!doc) return null;
      // Return a plain object: the Mongo document holds an ObjectId and Dates,
      // which are not serialisable into the cache.
      return {
        seoTitle: clean(doc.seoTitle),
        seoDescription: clean(doc.seoDescription),
        seoKeywords: clean(doc.seoKeywords),
        canonicalUrl: clean(doc.canonicalUrl),
        robots: clean(doc.robots),
        ogTitle: clean(doc.ogTitle),
        ogDescription: clean(doc.ogDescription),
        ogImage: clean(doc.ogImage),
        ogType: clean(doc.ogType),
        twitterTitle: clean(doc.twitterTitle),
        twitterDescription: clean(doc.twitterDescription),
        twitterImage: clean(doc.twitterImage),
        twitterCard: clean(doc.twitterCard),
        schemaMarkup: clean(doc.schemaMarkup),
      };
    } catch {
      // Swallowed on purpose — see the note above about outages. The hardcoded
      // metadata is returned instead of the page failing to render.
      return null;
    }
  },
  ["page-seo-row"],
  { revalidate: REVALIDATE, tags: [SEO_TAG] },
);

/** Absolute URL for an admin-supplied image, which may be a site-relative path. */
function absolute(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url) ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function pageMetadataFromDb(path: string): Promise<Metadata> {
  const base = pageMetadata(path);
  const row = await readRow(path);
  if (!row) return base;

  const title = row.seoTitle ?? (base.title as string);
  const description = row.seoDescription ?? (base.description as string | undefined);

  const baseOg = base.openGraph ?? {};
  const baseTw = base.twitter ?? {};
  const ogImage = absolute(row.ogImage);
  const twImage = absolute(row.twitterImage);

  return {
    ...base,
    title,
    description,
    ...(row.seoKeywords ? { keywords: row.seoKeywords } : {}),
    alternates: { canonical: row.canonicalUrl ?? `${SITE_URL}${path === "/" ? "" : path}` },
    robots: parseRobots(row.robots) ?? base.robots,
    openGraph: {
      ...baseOg,
      title: row.ogTitle ?? title,
      description: row.ogDescription ?? description,
      ...(row.ogType ? { type: row.ogType as "website" } : {}),
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      ...baseTw,
      title: row.twitterTitle ?? title,
      description: row.twitterDescription ?? description,
      ...(row.twitterCard ? { card: row.twitterCard as "summary" } : {}),
      ...(twImage ? { images: [twImage] } : {}),
    },
  };
}

/**
 * Same override behaviour, but starting from a Metadata object the page already
 * declares rather than from pageMetadata().
 *
 * The legal pages (privacy, terms, refund-policy, legal) hand-roll their own
 * metadata — pulling the description straight out of lib/legal-data so it can
 * never drift from the document body — and are deliberately noindex. This lets
 * them stay editable from the dashboard without flattening them onto the
 * generic marketing-page shape, which would have added OG images and an
 * indexable robots value to pages that should have neither.
 */
export async function metadataFromDb(path: string, base: Metadata): Promise<Metadata> {
  const row = await readRow(path);
  if (!row) return base;

  const title = row.seoTitle ?? (base.title as string);
  const description = row.seoDescription ?? (base.description as string | undefined);
  const ogImage = absolute(row.ogImage);

  return {
    ...base,
    title,
    description,
    ...(row.seoKeywords ? { keywords: row.seoKeywords } : {}),
    ...(row.canonicalUrl ? { alternates: { canonical: row.canonicalUrl } } : {}),
    robots: parseRobots(row.robots) ?? base.robots,
    ...(row.ogTitle || row.ogDescription || ogImage
      ? {
          openGraph: {
            ...(base.openGraph ?? {}),
            title: row.ogTitle ?? title,
            description: row.ogDescription ?? description,
            ...(ogImage ? { images: [{ url: ogImage }] } : {}),
          },
        }
      : {}),
  };
}

/** JSON-LD authored in the dashboard, for a page to render in a script tag. */
export async function pageSchema(path: string): Promise<string | null> {
  const row = await readRow(path);
  if (!row?.schemaMarkup) return null;
  try {
    // Re-serialise so malformed JSON can never reach the page as a raw string.
    return JSON.stringify(JSON.parse(row.schemaMarkup));
  } catch {
    return null;
  }
}

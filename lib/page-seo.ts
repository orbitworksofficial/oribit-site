import "server-only";

import type { Metadata } from "next";
import { cache } from "react";

import type { FaqItem } from "./models";
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
 * Reads are deduplicated per request (see readRow below) rather than cached
 * across requests, so a save in the dashboard is live on the very next request.
 */

/**
 * Shared cache tag for the route-level revalidation the save action performs.
 *
 * This no longer gates the row read itself — readRow() is per-request — but the
 * page shells are still cached by Next, so the save action tags and revalidates
 * them to push an edit out immediately.
 */
export const SEO_TAG = "page-seo";

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

/**
 * Read one page's overrides, deduplicated per request.
 *
 * React's cache(), not unstable_cache(), and the difference is a bug fix rather
 * than a preference. unstable_cache belongs to the legacy cache system, which
 * updateTag()/revalidateTag() no longer reach in Next 16 — those functions
 * target the 'use cache' store. Tagging the entry therefore bought nothing: a
 * save wrote to Atlas, called updateTag(SEO_TAG), and the page kept serving the
 * previous title and description until the hour-long window lapsed. Verified
 * directly — purging the tag left the stale value in place.
 *
 * The alternative, 'use cache' + cacheTag, needs the project-wide
 * cacheComponents flag, which changes rendering semantics for every route; that
 * is not something an SEO override should require. cache() instead scopes
 * deduplication to a single render, so a page whose metadata and body both read
 * the row still costs one query, and an edit is live on the next request.
 * Stale metadata is an SEO regression that persists in the index long after the
 * cache expires, so correctness wins over the saved round-trip here.
 */
const readRow = cache(
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
        faqs: (doc.faqs ?? [])
          .map((f) => ({ question: f.question?.trim() ?? "", answer: f.answer?.trim() ?? "" }))
          .filter((f) => f.question && f.answer),
      };
    } catch {
      // Swallowed on purpose — see the note above about outages. The hardcoded
      // metadata is returned instead of the page failing to render.
      return null;
    }
  },
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

/**
 * FAQs stored for a route, or null when the dashboard has none — in which case
 * the caller falls back to the page's own hardcoded list, on the same
 * database-first principle as the metadata above.
 *
 * An empty array from the dashboard is *not* treated as an override: the row
 * exists for the metadata fields, and an editor who has never opened the FAQ
 * block should not thereby delete the FAQs the page ships with.
 */
export async function pageFaqs(path: string): Promise<FaqItem[] | null> {
  const row = await readRow(path);
  return row?.faqs?.length ? row.faqs : null;
}

/** FAQPage JSON-LD for a list of question/answer pairs. */
export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * JSON-LD authored in the dashboard's free-form Schema markup field.
 *
 * FAQ markup is deliberately not added here. It is emitted by <FaqSection>
 * instead, next to the answers it describes, because that component is also
 * what decides whether the dashboard's FAQs or the page's hardcoded ones are
 * the ones on screen — and FAQPage markup that does not match the visible text
 * is a manual action risk, not just a missed rich result.
 */
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

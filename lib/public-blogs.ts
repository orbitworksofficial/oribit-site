import "server-only";

import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import DOMPurify from "isomorphic-dompurify";

import { getDb, isDbConfigured } from "./db";
import { COLLECTIONS, type BlogDoc, type CategoryDoc, type UserDoc } from "./models";
import { BLOGS, type Post } from "./content";
import { SITE_URL } from "./site";

/**
 * The public blog, read from MongoDB.
 *
 * lib/content.ts stays as the fallback for exactly the same reason lib/routes.ts
 * does for page metadata: if Atlas is unreachable the blog still renders the
 * four seeded posts rather than an empty listing or a 500. It is not the source
 * of truth any more — the dashboard is — but it is the floor.
 *
 * Everything is returned in the existing `Post` shape so the page markup did not
 * have to be rewritten around a new type. The one real difference is `body`:
 * content.ts holds an array of paragraphs, the dashboard stores HTML, so posts
 * from the database carry `html` instead and the page renders whichever is set.
 */

export type PublicPost = Post & {
  /** Sanitised HTML from the dashboard. When set, render this instead of body. */
  html?: string;
  categoryName?: string;
};

/** Shared cache tag so publishing a post can flush the whole public blog. */
export const BLOG_TAG = "public-blogs";

const REVALIDATE = 300;

/**
 * Author-supplied HTML is sanitised before it can reach dangerouslySetInnerHTML.
 *
 * The editor is a raw HTML textarea, so without this a stored <script> or an
 * onerror attribute would execute for every visitor to the post. Authors are
 * trusted people, but a stolen author password should not become site-wide XSS.
 * The allow-list covers what the editor is actually used to write.
 */
function sanitize(html: string): string {
  const cleaned = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "b", "i", "u", "s", "blockquote", "code", "pre",
      "h2", "h3", "h4", "ul", "ol", "li", "a", "img", "figure", "figcaption", "hr", "table",
      "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "rel", "src", "alt", "width", "height"],
    // javascript: and data: URIs in href/src are the other half of the problem.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i,
  });

  return (
    cleaned
      /**
       * Tiptap wraps list item text in a paragraph (`<li><p>text</p></li>`).
       * `.orbit-post__body p` carries `margin: 0 0 2.6rem`, so left alone every
       * bullet would be followed by a 2.6rem gap. Unwrapping the paragraph is
       * the fix that survives the author editing the post again, unlike a CSS
       * override that would have to guess at the nesting.
       */
      .replace(/<li>\s*<p>([\s\S]*?)<\/p>\s*<\/li>/g, "<li>$1</li>")
      /**
       * The editor leaves a trailing empty paragraph whenever the author ends
       * on a new line, which renders as an unexplained 2.6rem of whitespace at
       * the foot of the post.
       */
      .replace(/(?:<p>(?:\s|<br\s*\/?>)*<\/p>\s*)+$/g, "")
      .trim()
  );
}

/** ISO date (YYYY-MM-DD) for the existing `date` field. */
function isoDate(d: Date | null | undefined): string {
  return (d ?? new Date()).toISOString().slice(0, 10);
}

function toPost(
  doc: BlogDoc,
  authors: Map<string, string>,
  categories: Map<string, string>,
): PublicPost {
  const categoryName = doc.categoryId ? categories.get(String(doc.categoryId)) : undefined;
  return {
    slug: doc.slug,
    title: doc.title,
    date: isoDate(doc.publishedAt),
    // `kind` is the eyebrow label above each card; the category is the closest
    // equivalent now that posts are filed properly.
    kind: categoryName ?? "Insights",
    excerpt: doc.excerpt,
    author: (doc.authorId && authors.get(String(doc.authorId))) || "OrbitWorks",
    readingMinutes: doc.readingMinutes || 1,
    image: doc.featuredImage || "/blogs/seo-that-compounds.png",
    body: [],
    html: sanitize(doc.content ?? ""),
    categoryName,
  };
}

/** Resolve author and category names in two queries rather than N. */
async function decorate(docs: BlogDoc[]) {
  const db = await getDb();
  const authorIds = [...new Set(docs.map((d) => d.authorId).filter(Boolean))];
  const categoryIds = [...new Set(docs.map((d) => d.categoryId).filter(Boolean))];

  const [authors, categories] = await Promise.all([
    authorIds.length
      ? db.collection<UserDoc>(COLLECTIONS.users).find({ _id: { $in: authorIds as never } }).toArray()
      : Promise.resolve([]),
    categoryIds.length
      ? db
          .collection<CategoryDoc>(COLLECTIONS.categories)
          .find({ _id: { $in: categoryIds as never } })
          .toArray()
      : Promise.resolve([]),
  ]);

  return {
    authors: new Map(authors.map((a) => [String(a._id), a.name])),
    categories: new Map(categories.map((c) => [String(c._id), c.name])),
  };
}

const readAll = unstable_cache(
  async (): Promise<PublicPost[] | null> => {
    if (!isDbConfigured()) return null;
    try {
      const db = await getDb();
      const docs = await db
        .collection<BlogDoc>(COLLECTIONS.blogs)
        .find({ status: "published", publishedAt: { $lte: new Date() } })
        .sort({ publishedAt: -1 })
        .toArray();
      if (docs.length === 0) return null;
      const { authors, categories } = await decorate(docs);
      return docs.map((d) => toPost(d, authors, categories));
    } catch {
      // Fall back to the static posts rather than failing the page.
      return null;
    }
  },
  ["public-blogs-all"],
  { revalidate: REVALIDATE, tags: [BLOG_TAG] },
);

/** Every published post, newest first. Falls back to lib/content.ts. */
export async function getPosts(): Promise<PublicPost[]> {
  return (await readAll()) ?? BLOGS;
}

/** One post by slug, or null when it does not exist or is not yet published. */
export async function getPost(slug: string): Promise<PublicPost | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/** The raw SEO block for a post, cached alongside the posts themselves. */
const readSeo = unstable_cache(
  async (slug: string) => {
    if (!isDbConfigured()) return null;
    try {
      const db = await getDb();
      const doc = await db.collection<BlogDoc>(COLLECTIONS.blogs).findOne(
        { slug, status: "published" },
        {
          projection: {
            seoTitle: 1, seoDescription: 1, seoKeywords: 1, canonicalUrl: 1, robots: 1,
            ogTitle: 1, ogDescription: 1, ogImage: 1, twitterTitle: 1,
            twitterDescription: 1, twitterImage: 1, twitterCard: 1, schemaMarkup: 1,
          },
        },
      );
      if (!doc) return null;
      const t = (v: unknown) => {
        const s = typeof v === "string" ? v.trim() : "";
        return s || undefined;
      };
      return {
        seoTitle: t(doc.seoTitle), seoDescription: t(doc.seoDescription),
        seoKeywords: t(doc.seoKeywords), canonicalUrl: t(doc.canonicalUrl),
        robots: t(doc.robots), ogTitle: t(doc.ogTitle), ogDescription: t(doc.ogDescription),
        ogImage: t(doc.ogImage), twitterTitle: t(doc.twitterTitle),
        twitterDescription: t(doc.twitterDescription), twitterImage: t(doc.twitterImage),
        twitterCard: t(doc.twitterCard), schemaMarkup: t(doc.schemaMarkup),
      };
    } catch {
      return null;
    }
  },
  ["public-blog-seo"],
  { revalidate: REVALIDATE, tags: [BLOG_TAG] },
);

function absolute(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url) ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Layer the post's own SEO block over the defaults derived from its title and
 * excerpt. Same rule as everywhere else: a blank field is not an override, so
 * clearing one in the dashboard restores the sensible default rather than
 * shipping an empty tag.
 */
export async function postSeoOverride(slug: string, base: Metadata): Promise<Metadata> {
  const row = await readSeo(slug);
  if (!row) return base;

  const title = row.seoTitle ?? (base.title as string);
  const description = row.seoDescription ?? (base.description as string | undefined);
  const ogImage = absolute(row.ogImage);
  const twImage = absolute(row.twitterImage);

  return {
    ...base,
    title,
    description,
    ...(row.seoKeywords ? { keywords: row.seoKeywords } : {}),
    ...(row.canonicalUrl ? { alternates: { canonical: row.canonicalUrl } } : {}),
    ...(row.robots
      ? {
          robots: {
            index: !row.robots.toLowerCase().includes("noindex"),
            follow: !row.robots.toLowerCase().includes("nofollow"),
          },
        }
      : {}),
    openGraph: {
      ...(base.openGraph ?? {}),
      title: row.ogTitle ?? title,
      description: row.ogDescription ?? description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      ...(base.twitter ?? {}),
      title: row.twitterTitle ?? title,
      description: row.twitterDescription ?? description,
      ...(row.twitterCard ? { card: row.twitterCard as "summary" } : {}),
      ...(twImage ? { images: [twImage] } : {}),
    },
  };
}

/** Author-written JSON-LD for a post, re-serialised so malformed JSON cannot ship. */
export async function postSchema(slug: string): Promise<string | null> {
  const row = await readSeo(slug);
  if (!row?.schemaMarkup) return null;
  try {
    return JSON.stringify(JSON.parse(row.schemaMarkup));
  } catch {
    return null;
  }
}

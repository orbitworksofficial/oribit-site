import "server-only";

import { ObjectId, type Filter } from "mongodb";

import { getDb, isDbConfigured } from "./db";
import {
  COLLECTIONS,
  type BlogDoc,
  type BlogListItem,
  type BlogStatus,
  type CategoryDoc,
  type TagDoc,
  type UserDoc,
} from "./models";

/**
 * Blog reads.
 *
 * Every public-facing query filters on status:"published" AND a publishedAt in
 * the past, so scheduling a post for next week actually holds it back — Vivacity
 * checked the status alone, which meant a future publishedAt still showed
 * immediately.
 */

export type BlogQuery = {
  search?: string;
  status?: BlogStatus | "";
  categoryId?: string;
  page?: number;
  perPage?: number;
};

function toObjectId(v?: string | null): ObjectId | null {
  if (!v || !ObjectId.isValid(v)) return null;
  return new ObjectId(v);
}

/** Admin list: every status, with filters and pagination. */
export async function listBlogs(q: BlogQuery = {}): Promise<{
  items: BlogListItem[];
  total: number;
  page: number;
  perPage: number;
}> {
  const page = Math.max(1, q.page ?? 1);
  const perPage = Math.min(100, Math.max(1, q.perPage ?? 15));

  if (!isDbConfigured()) return { items: [], total: 0, page, perPage };

  const db = await getDb();
  const filter: Filter<BlogDoc> = {};

  if (q.search?.trim()) {
    // Escaped: a title search for "C++" must not be compiled as a quantifier.
    const safe = q.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.title = { $regex: safe, $options: "i" };
  }
  if (q.status) filter.status = q.status;
  const cat = toObjectId(q.categoryId);
  if (cat) filter.categoryId = cat;

  const coll = db.collection<BlogDoc>(COLLECTIONS.blogs);
  const [docs, total] = await Promise.all([
    coll
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray(),
    coll.countDocuments(filter),
  ]);

  const items = await decorate(docs);
  return { items, total, page, perPage };
}

/** Attach author/category/tag names in two queries rather than N. */
async function decorate(docs: BlogDoc[]): Promise<BlogListItem[]> {
  if (docs.length === 0) return [];
  const db = await getDb();

  const authorIds = [...new Set(docs.map((d) => String(d.authorId)))].map((id) => new ObjectId(id));
  const catIds = [
    ...new Set(docs.map((d) => (d.categoryId ? String(d.categoryId) : "")).filter(Boolean)),
  ].map((id) => new ObjectId(id));
  const tagIds = [...new Set(docs.flatMap((d) => (d.tagIds ?? []).map(String)))].map(
    (id) => new ObjectId(id),
  );

  const [authors, cats, tags] = await Promise.all([
    db
      .collection<UserDoc>(COLLECTIONS.users)
      .find({ _id: { $in: authorIds } })
      .toArray(),
    catIds.length
      ? db
          .collection<CategoryDoc>(COLLECTIONS.categories)
          .find({ _id: { $in: catIds } })
          .toArray()
      : Promise.resolve([]),
    tagIds.length
      ? db
          .collection<TagDoc>(COLLECTIONS.tags)
          .find({ _id: { $in: tagIds } })
          .toArray()
      : Promise.resolve([]),
  ]);

  const authorName = new Map(authors.map((a) => [String(a._id), a.name]));
  const catName = new Map(cats.map((c) => [String(c._id), c.name]));
  const tagName = new Map(tags.map((t) => [String(t._id), t.name]));

  return docs.map((d) => ({
    id: String(d._id),
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt,
    status: d.status,
    publishedAt: d.publishedAt ? d.publishedAt.toISOString() : null,
    updatedAt: d.updatedAt.toISOString(),
    featuredImage: d.featuredImage,
    isFeatured: d.isFeatured,
    readingMinutes: d.readingMinutes,
    viewsCount: d.viewsCount ?? 0,
    authorName: authorName.get(String(d.authorId)) ?? "Unknown",
    categoryName: d.categoryId ? catName.get(String(d.categoryId)) : undefined,
    tagNames: (d.tagIds ?? []).map((t) => tagName.get(String(t))).filter(Boolean) as string[],
  }));
}

export async function getBlogById(id: string): Promise<BlogDoc | null> {
  const _id = toObjectId(id);
  if (!_id || !isDbConfigured()) return null;
  const db = await getDb();
  return db.collection<BlogDoc>(COLLECTIONS.blogs).findOne({ _id });
}

/** Public: a single published post. */
export async function getPublishedBlog(slug: string): Promise<BlogDoc | null> {
  if (!isDbConfigured()) return null;
  const db = await getDb();
  return db.collection<BlogDoc>(COLLECTIONS.blogs).findOne({
    slug,
    status: "published",
    publishedAt: { $lte: new Date() },
  });
}

/** Public: every published post, newest first. */
export async function listPublishedBlogs(limit?: number): Promise<BlogDoc[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  const cursor = db
    .collection<BlogDoc>(COLLECTIONS.blogs)
    .find({ status: "published", publishedAt: { $lte: new Date() } })
    .sort({ publishedAt: -1 });
  if (limit) cursor.limit(limit);
  return cursor.toArray();
}

export async function listCategories(): Promise<CategoryDoc[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  return db.collection<CategoryDoc>(COLLECTIONS.categories).find().sort({ name: 1 }).toArray();
}

export async function listTags(): Promise<TagDoc[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  return db.collection<TagDoc>(COLLECTIONS.tags).find().sort({ name: 1 }).toArray();
}

/** Categories and tags with how many posts use each — one grouped count, not N. */
export async function listCategoriesWithCounts() {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  const [cats, counts] = await Promise.all([
    listCategories(),
    db
      .collection(COLLECTIONS.blogs)
      .aggregate<{ _id: ObjectId | null; n: number }>([
        { $group: { _id: "$categoryId", n: { $sum: 1 } } },
      ])
      .toArray(),
  ]);
  const by = new Map(counts.map((c) => [String(c._id), c.n]));
  return cats.map((c) => ({
    id: String(c._id),
    name: c.name,
    slug: c.slug,
    description: c.description,
    count: by.get(String(c._id)) ?? 0,
  }));
}

export async function listTagsWithCounts() {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  const [tags, counts] = await Promise.all([
    listTags(),
    db
      .collection(COLLECTIONS.blogs)
      .aggregate<{ _id: ObjectId; n: number }>([
        { $unwind: "$tagIds" },
        { $group: { _id: "$tagIds", n: { $sum: 1 } } },
      ])
      .toArray(),
  ]);
  const by = new Map(counts.map((c) => [String(c._id), c.n]));
  return tags.map((t) => ({
    id: String(t._id),
    name: t.name,
    slug: t.slug,
    count: by.get(String(t._id)) ?? 0,
  }));
}

/** Dashboard counters, in one round trip per collection. */
export async function getDashboardStats() {
  if (!isDbConfigured()) {
    return { total: 0, published: 0, draft: 0, archived: 0, views: 0, categories: 0, tags: 0, users: 0 };
  }
  const db = await getDb();
  const blogs = db.collection<BlogDoc>(COLLECTIONS.blogs);

  const [total, published, draft, archived, categories, tags, users, viewAgg] = await Promise.all([
    blogs.countDocuments({}),
    blogs.countDocuments({ status: "published" }),
    blogs.countDocuments({ status: "draft" }),
    blogs.countDocuments({ status: "archived" }),
    db.collection(COLLECTIONS.categories).countDocuments({}),
    db.collection(COLLECTIONS.tags).countDocuments({}),
    db.collection(COLLECTIONS.users).countDocuments({}),
    blogs.aggregate<{ total: number }>([
      { $group: { _id: null, total: { $sum: "$viewsCount" } } },
    ]).toArray(),
  ]);

  return {
    total,
    published,
    draft,
    archived,
    views: viewAgg[0]?.total ?? 0,
    categories,
    tags,
    users,
  };
}

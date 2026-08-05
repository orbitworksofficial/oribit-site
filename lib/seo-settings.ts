import "server-only";

import { ObjectId } from "mongodb";

import { getDb, isDbConfigured } from "./db";
import { COLLECTIONS, type PageSeoDoc } from "./models";

/**
 * Per-page SEO overrides.
 *
 * Read by the admin screens and, once wired, by each page's generateMetadata —
 * which is the half Vivacity never built: it stored these values but its Blade
 * layout only ever yielded title, description, keywords and og_title.
 */

export async function listPageSeo(): Promise<PageSeoDoc[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  return db.collection<PageSeoDoc>(COLLECTIONS.pageSeo).find().sort({ pageKey: 1 }).toArray();
}

export async function getPageSeoById(id: string): Promise<PageSeoDoc | null> {
  if (!isDbConfigured() || !ObjectId.isValid(id)) return null;
  const db = await getDb();
  return db.collection<PageSeoDoc>(COLLECTIONS.pageSeo).findOne({ _id: new ObjectId(id) });
}

/** By route path, for generateMetadata. */
export async function getPageSeo(pageKey: string): Promise<PageSeoDoc | null> {
  if (!isDbConfigured()) return null;
  const db = await getDb();
  return db.collection<PageSeoDoc>(COLLECTIONS.pageSeo).findOne({ pageKey });
}

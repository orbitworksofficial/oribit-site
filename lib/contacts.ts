import "server-only";

import { ObjectId } from "mongodb";

import { getDb, isDbConfigured } from "./db";
import { COLLECTIONS, type ContactDoc } from "./models";

/** Dashboard shape — ObjectId and Date serialised for the client. */
export type ContactRow = {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  emailed: boolean;
  emailError?: string;
  handled: boolean;
  createdAt: string;
};

function toRow(d: ContactDoc & { _id: ObjectId }): ContactRow {
  return {
    id: d._id.toString(),
    name: d.name,
    email: d.email,
    company: d.company,
    service: d.service,
    message: d.message,
    emailed: d.emailed,
    emailError: d.emailError,
    handled: d.handled,
    createdAt: d.createdAt.toISOString(),
  };
}

/**
 * Every enquiry, newest first.
 *
 * Returns an empty list rather than throwing when no database is configured,
 * so the dashboard renders its empty state during a build with no MONGODB_URI
 * instead of failing the page.
 */
export async function listContacts(): Promise<ContactRow[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();
  const docs = await db
    .collection<ContactDoc>(COLLECTIONS.contacts)
    .find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();
  return docs.map((d) => toRow(d as ContactDoc & { _id: ObjectId }));
}

/** How many enquiries still need dealing with — for the dashboard badge. */
export async function countUnhandledContacts(): Promise<number> {
  if (!isDbConfigured()) return 0;
  const db = await getDb();
  return db.collection<ContactDoc>(COLLECTIONS.contacts).countDocuments({ handled: false });
}

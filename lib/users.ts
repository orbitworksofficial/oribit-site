import "server-only";

import { ObjectId } from "mongodb";

import { getDb, isDbConfigured } from "./db";
import { COLLECTIONS, type Role, type UserDoc } from "./models";

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  postCount: number;
};

export async function listUsers(): Promise<UserListItem[]> {
  if (!isDbConfigured()) return [];
  const db = await getDb();

  const users = await db
    .collection<UserDoc>(COLLECTIONS.users)
    .find()
    .sort({ createdAt: 1 })
    .toArray();

  // One grouped count rather than a query per user.
  const counts = await db
    .collection(COLLECTIONS.blogs)
    .aggregate<{ _id: ObjectId; n: number }>([{ $group: { _id: "$authorId", n: { $sum: 1 } } }])
    .toArray();
  const byAuthor = new Map(counts.map((c) => [String(c._id), c.n]));

  return users.map((u) => ({
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    postCount: byAuthor.get(String(u._id)) ?? 0,
  }));
}

export async function getUserById(id: string): Promise<UserDoc | null> {
  if (!isDbConfigured() || !ObjectId.isValid(id)) return null;
  const db = await getDb();
  return db.collection<UserDoc>(COLLECTIONS.users).findOne({ _id: new ObjectId(id) });
}

/** How many admins exist — used to refuse removing the last one. */
export async function countAdmins(): Promise<number> {
  if (!isDbConfigured()) return 0;
  const db = await getDb();
  return db.collection(COLLECTIONS.users).countDocuments({ role: "admin" });
}

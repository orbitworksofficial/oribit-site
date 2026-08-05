import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

import { getDb } from "./db";
import { COLLECTIONS, type Role, type SafeUser, type UserDoc } from "./models";

/**
 * Session auth for the admin panel.
 *
 * A signed JWT in an httpOnly cookie: no session collection to garbage-collect,
 * and proxy.ts can check the cookie's presence without a database round trip on
 * every request (the real verification happens in the server components and
 * actions that actually read the session).
 *
 * SESSION_SECRET must be set and at least 32 characters. There is deliberately
 * no development fallback — a default secret that ships to production is how
 * admin panels get taken over.
 */

const COOKIE = "orbit_session";
const MAX_AGE_S = 60 * 60 * 8; // 8 hours

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or shorter than 32 characters. Generate one " +
        'with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"',
    );
  }
  return new TextEncoder().encode(s);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/** Issue a session cookie for a user. */
export async function createSession(user: SafeUser): Promise<void> {
  const token = await new SignJWT({ role: user.role, name: user.name, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_S}s`)
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** The signed-in user, or null. Safe to call from any server component. */
export async function getSession(): Promise<SafeUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      role: (payload.role === "admin" ? "admin" : "author") as Role,
    };
  } catch {
    // Expired or tampered with — treat as signed out.
    return null;
  }
}

/** Session or throw. Use at the top of every admin action and page. */
export async function requireUser(): Promise<SafeUser> {
  const user = await getSession();
  if (!user) throw new Error("Unauthorized");
  return user;
}

/**
 * Session with the admin role.
 *
 * Pages redirect an author to a readable "not available" screen; actions throw,
 * because there is no UI to redirect to and a thrown error is the correct
 * outcome for a forged request.
 */
export async function requireAdminPage(): Promise<SafeUser> {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  if (user.role !== "admin") redirect("/admin/forbidden");
  return user;
}

export async function requireAdmin(): Promise<SafeUser> {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}

/** Look a user up by email, for the login form. */
export async function findUserByEmail(email: string): Promise<UserDoc | null> {
  const db = await getDb();
  return db
    .collection<UserDoc>(COLLECTIONS.users)
    .findOne({ email: email.toLowerCase().trim() });
}

export function toSafeUser(doc: UserDoc): SafeUser {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
  };
}

export { ObjectId };

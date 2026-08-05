import { MongoClient, type Db } from "mongodb";

/**
 * MongoDB Atlas connection.
 *
 * The client is cached on globalThis rather than module scope: Next reloads
 * modules on every edit in development, and a fresh MongoClient per reload
 * exhausts the Atlas connection limit within a few minutes of work. The global
 * survives HMR, so one pool is reused.
 *
 * Set MONGODB_URI in .env.local (and in the host's environment for
 * production). MONGODB_DB is optional — the database named in the URI is used
 * when it is absent.
 */

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB ?? "orbitworks";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function connect(): Promise<MongoClient> {
  if (!URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example) — the " +
        "admin panel and every database-backed page need it.",
    );
  }

  const client = new MongoClient(URI, {
    // Atlas' default pool is 100; the admin panel is single-tenant and Hostinger
    // is not generous with connections. Ten is plenty and leaves headroom.
    maxPoolSize: 10,
    retryWrites: true,
  });

  return client.connect();
}

/**
 * Connect on first query, not at import.
 *
 * Next evaluates every route module while collecting page data at build time.
 * Connecting eagerly meant a build with no MONGODB_URI — a CI machine, or a
 * first deploy before the variable is set — died on `import` before any page
 * had a chance to check isDbConfigured() and degrade gracefully.
 */
function clientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect();
  }
  return global._mongoClientPromise;
}

/** The application database. Every query goes through this. */
export async function getDb(): Promise<Db> {
  const client = await clientPromise();
  return client.db(DB_NAME);
}

/** Whether a connection string is configured at all — lets pages degrade to
 *  their static content instead of throwing during a build with no database. */
export function isDbConfigured(): boolean {
  return Boolean(URI);
}

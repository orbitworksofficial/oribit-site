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

  /**
   * Tuned for serverless, where the maths is not per-process but per-container.
   *
   * Vercel runs each invocation in its own short-lived container, so a pool of
   * ten across twenty warm containers is two hundred connections to a free-tier
   * cluster that allows five hundred. Atlas responds by closing sockets, which
   * surfaced as intermittent MongoServerSelectionError / ReplicaSetNoPrimary
   * with a SystemOverloadedError label — pages 500ing at random while the
   * cluster itself was perfectly healthy.
   *
   * A small pool per container is the standard fix: each one only ever handles
   * a handful of concurrent requests, so five is ample and the total stays far
   * below the cap.
   */
  const client = new MongoClient(URI, {
    maxPoolSize: 5,
    minPoolSize: 0,
    // Return a socket to the pool quickly rather than holding it for a
    // container that may never serve another request.
    maxIdleTimeMS: 15_000,
    /**
     * Fail fast instead of hanging the request. The default is 30s, which on a
     * serverless function means the invocation times out before Mongo gives up
     * — the user waits half a minute for a blank error rather than seeing the
     * page's own fallback.
     */
    serverSelectionTimeoutMS: 8_000,
    connectTimeoutMS: 8_000,
    socketTimeoutMS: 20_000,
    retryWrites: true,
    retryReads: true,
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
    /**
     * Clear the cached promise if the connection fails, so the next request
     * retries instead of awaiting the same rejected promise forever.
     *
     * Without this, a single transient network blip — an Atlas failover, a
     * cold container losing a race — poisoned that container for its whole
     * lifetime: every subsequent request re-awaited the stored rejection and
     * 500ed, even after the cluster recovered.
     */
    global._mongoClientPromise = connect().catch((err) => {
      global._mongoClientPromise = undefined;
      throw err;
    });
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

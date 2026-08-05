/**
 * Seed MongoDB Atlas from the content that currently lives in lib/content.ts.
 *
 * Idempotent: every write is an upsert keyed on slug/email, so running it twice
 * updates rather than duplicates. Safe to re-run after adding content to the
 * TypeScript files, and safe to run against a database that already has posts
 * edited in the admin — matching slugs are updated, everything else is left
 * alone.
 *
 *   node scripts/seed-db.mjs                     # content + indexes
 *   node scripts/seed-db.mjs --admin "a@b.com" --password "..." --name "Kashif"
 *
 * Requires MONGODB_URI in .env.local.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// --- .env.local ------------------------------------------------------------
for (const file of [".env.local", ".env"]) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB ?? "orbitworks";
if (!URI) {
  console.error("MONGODB_URI is not set. Add it to .env.local first.");
  process.exit(1);
}

// --- args ------------------------------------------------------------------
const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : undefined;
};

/**
 * Pull BLOGS out of lib/content.ts without a TypeScript toolchain: the file is
 * plain data, so the array literal is extracted and evaluated. Fragile if the
 * file gains logic — at which point this seeder has done its job and can be
 * replaced by editing in the admin.
 */
function readBlogsFromContent() {
  const src = fs.readFileSync(path.join(ROOT, "lib/content.ts"), "utf8");
  const start = src.indexOf("export const BLOGS");
  if (start === -1) return [];
  // Start at the `=`, not at `BLOGS`: the declaration is annotated
  // `BLOGS: Post[] = [...]`, and searching for the first "[" from the name
  // finds the empty pair in `Post[]` rather than the array literal.
  const eq = src.indexOf("=", start);
  const open = src.indexOf("[", eq);
  let depth = 0;
  let end = open;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const literal = src.slice(open, end + 1);
  // eslint-disable-next-line no-new-func
  return new Function(`return ${literal}`)();
}

/** Markdown-ish body array from content.ts → the HTML the editor stores. */
function bodyToHtml(body) {
  return body
    .map((block) => {
      if (block.startsWith("## ")) return `<h2>${block.slice(3).trim()}</h2>`;
      if (block.startsWith("# ")) return `<h2>${block.slice(2).trim()}</h2>`;
      return `<p>${block}</p>`;
    })
    .join("\n");
}

function readingMinutes(html) {
  const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const client = new MongoClient(URI);

try {
  await client.connect();
  const db = client.db(DB_NAME);
  console.log(`Connected to ${DB_NAME}`);

  // --- indexes -------------------------------------------------------------
  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("blogs").createIndex({ slug: 1 }, { unique: true }),
    db.collection("blogs").createIndex({ status: 1, publishedAt: -1 }),
    db.collection("categories").createIndex({ slug: 1 }, { unique: true }),
    db.collection("tags").createIndex({ slug: 1 }, { unique: true }),
    db.collection("page_seo").createIndex({ pageKey: 1 }, { unique: true }),
  ]);
  console.log("Indexes ensured");

  // --- admin user ----------------------------------------------------------
  const email = (arg("admin") ?? "").toLowerCase().trim();
  let adminId;

  if (email) {
    const password = arg("password");
    if (!password || password.length < 10) {
      console.error("--password is required with --admin, and must be 10+ characters.");
      process.exit(1);
    }
    const now = new Date();
    const res = await db.collection("users").findOneAndUpdate(
      { email },
      {
        $set: {
          name: arg("name") ?? "Admin",
          email,
          passwordHash: await bcrypt.hash(password, 12),
          role: "admin",
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: "after" },
    );
    adminId = res._id ?? res.value?._id;
    console.log(`Admin user ready: ${email}`);
  } else {
    const existing = await db.collection("users").findOne({ role: "admin" });
    adminId = existing?._id;
    if (!adminId) {
      console.log(
        "\nNo admin user yet. Re-run with:\n" +
          '  node scripts/seed-db.mjs --admin "you@example.com" --password "a-long-password" --name "Your Name"\n',
      );
    }
  }

  // --- categories and tags -------------------------------------------------
  const blogs = readBlogsFromContent();
  const catNames = [...new Set(blogs.map((b) => b.kind).filter(Boolean))];
  const catIds = new Map();

  for (const name of catNames) {
    const now = new Date();
    const res = await db.collection("categories").findOneAndUpdate(
      { slug: slugify(name) },
      { $set: { name, slug: slugify(name), updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true, returnDocument: "after" },
    );
    catIds.set(name, res._id ?? res.value?._id);
  }
  console.log(`Categories: ${catNames.length}`);

  // --- blog posts ----------------------------------------------------------
  if (!adminId) {
    console.log("Skipping posts — they need an author. Create the admin user first.");
  } else {
    let n = 0;
    for (const post of blogs) {
      const html = bodyToHtml(post.body ?? []);
      const now = new Date();
      await db.collection("blogs").updateOne(
        { slug: post.slug },
        {
          $set: {
            title: post.title,
            excerpt: post.excerpt,
            content: html,
            featuredImage: post.image,
            featuredImageAlt: post.title,
            status: "published",
            publishedAt: new Date(post.date),
            authorId: adminId,
            categoryId: catIds.get(post.kind) ?? null,
            tagIds: [],
            isFeatured: false,
            allowComments: true,
            readingMinutes: post.readingMinutes ?? readingMinutes(html),
            ogType: "article",
            twitterCard: "summary_large_image",
            robots: "index, follow",
            updatedAt: now,
          },
          $setOnInsert: { slug: post.slug, viewsCount: 0, createdAt: now },
        },
        { upsert: true },
      );
      n++;
    }
    console.log(`Posts seeded: ${n}`);
  }

  // --- per-page SEO rows ---------------------------------------------------
  /**
   * Seeded with the REAL copy from lib/routes.ts, not empty shells.
   *
   * These rows are what the dashboard edits and what generateMetadata reads.
   * Seeding them blank meant the first save from the dashboard would have been
   * against an empty form, silently discarding the hand-written titles and
   * descriptions that were already ranking. Importing the current values makes
   * the DB an accurate copy of what is live, so editing is a real edit.
   *
   * lib/routes.ts stays the fallback (see lib/seo.ts) — it is not deleted.
   */
  const pages = [
    ["/", "Home"],
    ["/about", "About"],
    ["/services", "Services"],
    ["/industries", "Industries"],
    ["/case-studies", "Case studies"],
    ["/blogs", "Blog"],
    ["/products", "Products"],
    ["/resources", "Resources"],
    ["/contact", "Contact"],
    // Noindex, but still edit-worthy: they carry title/description in-page.
    ["/legal", "Legal"],
    ["/privacy", "Privacy policy"],
    ["/terms", "Terms & conditions"],
    ["/refund-policy", "Refund policy"],
  ];

  const NOINDEX = new Set(["/legal", "/privacy", "/terms", "/refund-policy"]);

  /**
   * Pull the current title/description out of lib/routes.ts.
   *
   * Parsed rather than imported because routes.ts is TypeScript and this is a
   * plain .mjs script run by node without a loader.
   */
  const routesSrc = fs.readFileSync(path.join(ROOT, "lib/routes.ts"), "utf8");
  function chromeFromSource(pageKey) {
    // Locate the `"<pageKey>": {` entry, then read to its closing brace.
    const at = routesSrc.indexOf(`"${pageKey}": {`);
    if (at === -1) return {};
    const block = routesSrc.slice(at, routesSrc.indexOf("\n  },", at));
    const grab = (field) => {
      const m = block.match(new RegExp(`${field}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`));
      return m ? m[1].replace(/\\"/g, '"').replace(/\\n/g, " ") : undefined;
    };
    return { seoTitle: grab("title"), seoDescription: grab("description") };
  }

  let seoImported = 0;
  for (const [pageKey, pageName] of pages) {
    const now = new Date();
    const { seoTitle, seoDescription } = chromeFromSource(pageKey);
    if (seoTitle) seoImported++;

    await db.collection("page_seo").updateOne(
      { pageKey },
      {
        // pageName is corrected on every run; the SEO copy is only ever written
        // when absent, so a dashboard edit is never clobbered by a re-seed.
        $set: { pageName, updatedAt: now },
        $setOnInsert: {
          pageKey,
          ...(seoTitle ? { seoTitle } : {}),
          ...(seoDescription ? { seoDescription } : {}),
          robots: NOINDEX.has(pageKey) ? "noindex, follow" : "index, follow",
          ogType: "website",
          twitterCard: "summary",
          createdAt: now,
        },
      },
      { upsert: true },
    );

    /**
     * Backfill. An earlier version of this script created these rows with no
     * copy at all, so $setOnInsert above would skip them forever. Fill in only
     * the fields that are still blank — an edit made in the dashboard is never
     * overwritten, because a non-empty value fails the filter.
     */
    const fill = {};
    if (seoTitle) fill.seoTitle = seoTitle;
    if (seoDescription) fill.seoDescription = seoDescription;
    if (Object.keys(fill).length) {
      for (const [field, value] of Object.entries(fill)) {
        await db.collection("page_seo").updateOne(
          { pageKey, $or: [{ [field]: { $exists: false } }, { [field]: "" }, { [field]: null }] },
          { $set: { [field]: value, updatedAt: now } },
        );
      }
    }
  }
  console.log(`SEO pages: ${pages.length} (${seoImported} with copy from lib/routes.ts)`);

  console.log("\nDone.");
} catch (err) {
  console.error("\nSeed failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.close();
}

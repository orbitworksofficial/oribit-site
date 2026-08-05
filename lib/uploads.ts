import "server-only";

import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import type { Sharp, Metadata } from "sharp";

import { getDb } from "./db";
import { COLLECTIONS, type MediaDoc } from "./models";
import { ObjectId } from "mongodb";

/**
 * Image uploads for the dashboard.
 *
 * Files are written to public/uploads and served as ordinary static assets.
 *
 * IMPORTANT DEPLOYMENT NOTE: this only works on a host with a persistent,
 * writable filesystem — a VPS or a container with a mounted volume. On
 * serverless platforms (Vercel, Netlify, Hostinger's shared PHP tiers) the
 * filesystem is read-only or wiped between invocations, and uploads would
 * either fail outright or disappear at the next deploy. Everything below goes
 * through `store()` for exactly that reason: swapping to S3, R2 or Cloudinary
 * means reimplementing one function, not rewriting the callers.
 */

/**
 * sharp is loaded on first use, not at module scope.
 *
 * Importing it at the top level initialises libvips as soon as anything pulls
 * this file in, and during `next build` that collides with the WASM renderer
 * behind next/og — prerendering /opengraph-image died with "colourspace:
 * parameter space not set". Deferring the require keeps libvips out of the
 * build entirely, since no upload happens there.
 */
async function loadSharp() {
  return (await import("sharp")).default;
}

/** Where files land, relative to the project root. */
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/** Public URL prefix matching UPLOAD_DIR. */
const UPLOAD_URL = "/uploads";

/** Hard ceiling on the accepted upload, before processing. */
export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

/**
 * Accepted input types.
 *
 * Deliberately an allow-list of raster formats sharp can decode and re-encode.
 * SVG is excluded: it is a document format that can carry <script>, and serving
 * a user-supplied one from our own origin would be stored XSS. Anyone needing a
 * vector can still reference a path checked into the repo.
 */
const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

/** Longest edge, in pixels. Phone cameras produce 4000px+ images. */
const MAX_EDGE = 2000;

export type UploadResult = { ok: true; url: string; id: string } | { ok: false; error: string };

/** Filesystem-safe, collision-resistant name derived from the original. */
function safeName(original: string, ext: string): string {
  const base = path
    .basename(original, path.extname(original))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${base || "image"}-${stamp}${rand}.${ext}`;
}

/**
 * Persist bytes and return the public URL. The single seam to replace when
 * moving off the local filesystem.
 */
async function store(filename: string, data: Buffer): Promise<string> {
  // Partitioned by month so a directory listing stays manageable over years.
  const now = new Date();
  const sub = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const dir = path.join(UPLOAD_DIR, sub);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), data);
  return `${UPLOAD_URL}/${sub}/${filename}`;
}

/**
 * Validate, normalise and store an uploaded image.
 *
 * Every accepted file is re-encoded through sharp rather than written through
 * untouched. That is a security measure as much as a size one: re-encoding
 * discards anything that is not pixel data, so a file with a valid image header
 * and a malicious payload appended cannot survive. It also strips EXIF, which
 * routinely carries GPS coordinates from phone photos.
 */
export async function saveUpload(file: File, userId: string): Promise<UploadResult> {
  if (!file || file.size === 0) return { ok: false, error: "No file received." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: `That file is over ${MAX_UPLOAD_BYTES / 1024 / 1024}MB.` };
  }
  if (!ACCEPTED.has(file.type)) {
    return { ok: false, error: "Use a JPEG, PNG, WebP, GIF or AVIF image." };
  }

  const input = Buffer.from(await file.arrayBuffer());

  const sharp = await loadSharp();

  let pipeline: Sharp;
  let meta: Metadata;
  try {
    // animated: true so an animated GIF is not flattened to its first frame.
    pipeline = sharp(input, { animated: true });
    meta = await pipeline.metadata();
  } catch {
    // The browser's declared MIME type is not evidence — this is the real check.
    return { ok: false, error: "That file is not a readable image." };
  }
  if (!meta.width || !meta.height) return { ok: false, error: "That file is not a readable image." };

  const animated = (meta.pages ?? 1) > 1;

  // withoutEnlargement so a small logo is not upscaled and blurred.
  pipeline = pipeline.rotate().resize({
    width: Math.min(meta.width, MAX_EDGE),
    height: Math.min(meta.height, MAX_EDGE),
    fit: "inside",
    withoutEnlargement: true,
  });

  /**
   * Animated images stay GIF — WebP would be smaller, but re-encoding animation
   * is slow and lossy in a way a static frame is not. Everything else becomes
   * WebP, which is materially smaller than JPEG at the same quality and is
   * supported by every browser this site targets.
   */
  const ext = animated ? "gif" : "webp";
  const output = animated
    ? await pipeline.gif().toBuffer()
    : await pipeline.webp({ quality: 82 }).toBuffer();

  const filename = safeName(file.name, ext);
  const url = await store(filename, output);

  const doc: MediaDoc = {
    url,
    filename,
    mimeType: animated ? "image/gif" : "image/webp",
    bytes: output.byteLength,
    uploadedBy: new ObjectId(userId),
    createdAt: new Date(),
  };
  const res = await (await getDb()).collection<MediaDoc>(COLLECTIONS.media).insertOne(doc);

  return { ok: true, url, id: String(res.insertedId) };
}

/** Recent uploads, newest first, for the picker. */
export async function listMedia(limit = 60): Promise<
  { id: string; url: string; filename: string; bytes: number }[]
> {
  const db = await getDb();
  const docs = await db
    .collection<MediaDoc>(COLLECTIONS.media)
    .find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map((d) => ({
    id: String(d._id),
    url: d.url,
    filename: d.filename,
    bytes: d.bytes,
  }));
}

/**
 * Delete a media record and its file.
 *
 * The file is removed on a best-effort basis: if it is already gone the record
 * should still go, otherwise a failed disk write would leave an undeletable row
 * in the library forever.
 */
export async function deleteMedia(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  const doc = await db.collection<MediaDoc>(COLLECTIONS.media).findOne({ _id: new ObjectId(id) });
  if (!doc) return;

  await db.collection(COLLECTIONS.media).deleteOne({ _id: new ObjectId(id) });

  if (doc.url.startsWith(`${UPLOAD_URL}/`)) {
    const rel = doc.url.slice(UPLOAD_URL.length + 1);
    // Guard against a stored path escaping the upload directory.
    const target = path.join(UPLOAD_DIR, rel);
    if (target.startsWith(UPLOAD_DIR)) {
      await unlink(target).catch(() => {});
    }
  }
}

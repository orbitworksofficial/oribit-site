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
 * Two backends, chosen at runtime:
 *
 *   Cloudinary  — used whenever CLOUDINARY_URL (or the three CLOUDINARY_*
 *                 variables) is set. Required on serverless hosts: Vercel's
 *                 filesystem is read-only, and anything written to public/
 *                 would vanish at the next deploy anyway.
 *   Local disk  — the fallback, writing to public/uploads. Keeps `npm run dev`
 *                 working with no account or credentials, and remains correct
 *                 on a VPS with a persistent volume.
 *
 * Both go through `store()`, so the validation, resizing and database record
 * below are identical either way and nothing else in the app knows or cares
 * which one ran.
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

/**
 * Cloudinary is likewise loaded on first use.
 *
 * Same reasoning as sharp above: keeping it out of the module's top level means
 * `next build` never pulls the SDK into a bundle that has no use for it.
 */
async function loadCloudinary() {
  const { v2 } = await import("cloudinary");
  // CLOUDINARY_URL is read automatically by the SDK. The explicit form is
  // supported too, because some hosts' variable editors mangle the URL's
  // credentials — Hostinger's panel wrapped one across two lines earlier.
  if (!process.env.CLOUDINARY_URL) {
    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  } else {
    v2.config({ secure: true });
  }
  return v2;
}

/** True when Cloudinary credentials are present in the environment. */
export function usingCloudinary(): boolean {
  return Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET),
  );
}

/** Folder that uploads are filed under inside the Cloudinary account. */
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER ?? "orbitworks/blog";

/** Where files land locally, relative to the project root. */
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
 * Persist bytes and return the public URL, plus the provider's own handle for
 * the asset so it can be deleted later.
 *
 * The only place that knows which backend is in use.
 */
async function store(
  filename: string,
  data: Buffer,
): Promise<{ url: string; storageId?: string }> {
  // Partitioned by month so neither a directory listing nor a Cloudinary
  // folder becomes unmanageable over years.
  const now = new Date();
  const sub = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  if (usingCloudinary()) {
    const cloudinary = await loadCloudinary();
    // Strip the extension: Cloudinary appends its own based on the format, and
    // a public_id ending in ".webp" produces "name.webp.webp" in the URL.
    const publicId = filename.replace(/\.[^.]+$/, "");

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `${CLOUDINARY_FOLDER}/${sub}`,
            public_id: publicId,
            resource_type: "image",
            // The bytes are already validated, resized and re-encoded by sharp
            // above, so Cloudinary should store them as-is rather than apply a
            // second lossy pass.
            overwrite: false,
          },
          (error, res) => {
            if (error || !res) {
              reject(error ?? new Error("Cloudinary returned no result."));
              return;
            }
            resolve({ secure_url: res.secure_url, public_id: res.public_id });
          },
        );
        stream.end(data);
      },
    );

    return { url: result.secure_url, storageId: result.public_id };
  }

  /**
   * Local disk. Correct for `npm run dev` and for a VPS with a real volume, but
   * silently wrong on a serverless host: the write succeeds, the URL works
   * until the next deploy, and then every image 404s with nothing in the logs
   * to explain it.
   *
   * VERCEL is set on Vercel builds and at runtime, so refuse there rather than
   * accept an upload we know will be lost.
   */
  if (process.env.VERCEL) {
    throw new Error(
      "Image storage is not configured. Set CLOUDINARY_URL in the project's " +
        "environment variables — this host has no persistent filesystem, so " +
        "uploads written to disk are discarded on the next deploy.",
    );
  }

  const dir = path.join(UPLOAD_DIR, sub);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), data);
  return { url: `${UPLOAD_URL}/${sub}/${filename}` };
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
  const { url, storageId } = await store(filename, output);

  const doc: MediaDoc = {
    url,
    filename,
    ...(storageId ? { storageId } : {}),
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

  // Cloudinary asset: keyed by the public_id recorded at upload. Without this
  // the row would vanish from the library while the file kept billing storage.
  if (doc.storageId) {
    const cloudinary = await loadCloudinary();
    await cloudinary.uploader.destroy(doc.storageId, { resource_type: "image" }).catch(() => {});
    return;
  }

  if (doc.url.startsWith(`${UPLOAD_URL}/`)) {
    const rel = doc.url.slice(UPLOAD_URL.length + 1);
    // Guard against a stored path escaping the upload directory.
    const target = path.join(UPLOAD_DIR, rel);
    if (target.startsWith(UPLOAD_DIR)) {
      await unlink(target).catch(() => {});
    }
  }
}

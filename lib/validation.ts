import { z } from "zod";

/**
 * Input schemas for the admin forms.
 *
 * Lengths follow SEO convention rather than storage limits: 60 characters for a
 * title is what Google renders before truncating, 160 for a description. They
 * are advisory ceilings — the editor shows a counter — not hard technical caps.
 */

const trimmed = z.string().trim();
const optionalText = trimmed.optional().or(z.literal("")).transform((v) => v || undefined);

/** A slug, or empty to derive one from the title. */
export const slugSchema = optionalText.pipe(
  z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only")
    .max(120)
    .optional(),
);

export const seoSchema = z.object({
  seoTitle: optionalText.pipe(z.string().max(70).optional()),
  seoDescription: optionalText.pipe(z.string().max(200).optional()),
  seoKeywords: optionalText,
  canonicalUrl: optionalText.pipe(z.url("Must be a full URL including https://").optional()),
  robots: optionalText.pipe(z.string().max(60).optional()),
  ogTitle: optionalText.pipe(z.string().max(70).optional()),
  ogDescription: optionalText.pipe(z.string().max(200).optional()),
  ogImage: optionalText,
  ogType: optionalText.pipe(z.string().max(30).optional()),
  twitterTitle: optionalText.pipe(z.string().max(70).optional()),
  twitterDescription: optionalText.pipe(z.string().max(200).optional()),
  twitterImage: optionalText,
  twitterCard: optionalText.pipe(z.string().max(30).optional()),
  /**
   * Parsed before saving. Vivacity stored this as free text and never rendered
   * it; here it goes straight into a <script type="application/ld+json">, so
   * invalid JSON would break the tag on every page that uses it.
   */
  schemaMarkup: optionalText.refine(
    (v) => {
      if (!v) return true;
      try {
        JSON.parse(v);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Must be valid JSON" },
  ),
});

export const blogSchema = seoSchema.extend({
  title: trimmed.min(1, "Title is required").max(255),
  slug: slugSchema,
  excerpt: trimmed.min(1, "Excerpt is required").max(500),
  content: trimmed.min(1, "Content is required"),
  featuredImage: optionalText,
  featuredImageAlt: optionalText.pipe(z.string().max(255).optional()),
  status: z.enum(["draft", "published", "archived"]),
  publishedAt: optionalText,
  categoryId: optionalText,
  tagIds: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  allowComments: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: trimmed.min(1, "Name is required").max(120),
  slug: slugSchema,
  description: optionalText.pipe(z.string().max(500).optional()),
});

export const tagSchema = z.object({
  name: trimmed.min(1, "Name is required").max(80),
  slug: slugSchema,
});

export const pageSeoSchema = seoSchema.extend({
  pageKey: trimmed
    .min(1, "Path is required")
    .regex(/^\//, "Must start with a slash, e.g. /services")
    .max(200),
  pageName: trimmed.min(1, "Name is required").max(120),
});

export const loginSchema = z.object({
  email: trimmed.pipe(z.email("Enter a valid email")),
  password: z.string().min(1, "Password is required"),
});

export const userSchema = z.object({
  name: trimmed.min(1, "Name is required").max(120),
  email: trimmed.pipe(z.email("Enter a valid email")),
  role: z.enum(["admin", "author"]),
  /** Optional on edit — blank means "leave the existing password alone". */
  password: z
    .string()
    .min(10, "Use at least 10 characters")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

/**
 * Editing your own account.
 *
 * No `role` field: an author must not be able to promote themselves by posting
 * one, and the action ignores it regardless. Changing the password requires the
 * current one, so a borrowed session cannot lock the real owner out.
 */
export const profileSchema = z
  .object({
    name: trimmed.min(1, "Name is required").max(120),
    email: trimmed.pipe(z.email("Enter a valid email")),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(10, "Use at least 10 characters")
      .optional()
      .or(z.literal(""))
      .transform((v) => v || undefined),
  })
  .refine((d) => !d.newPassword || Boolean(d.currentPassword), {
    message: "Enter your current password to set a new one",
    path: ["currentPassword"],
  });

export type BlogInput = z.infer<typeof blogSchema>;
export type PageSeoInput = z.infer<typeof pageSeoSchema>;
export type SeoInput = z.infer<typeof seoSchema>;

/** Turn a title into a URL slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

/** Reading time in minutes, at 200 words per minute — Vivacity's formula. */
export function readingMinutes(html: string): number {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Flatten a ZodError into { field: message } for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

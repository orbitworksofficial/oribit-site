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

/**
 * Make a pasted JSON-LD block parseable.
 *
 * Authors paste from Google's Structured Data helper, an AI, or another page's
 * source, and two things reliably break it — neither of which is a mistake
 * about *intent*, so rejecting the paste and asking them to hand-edit JSON is
 * the wrong trade:
 *
 *   1. The surrounding <script type="application/ld+json"> … </script> tag.
 *      The field wants the object; the tag is added at render time.
 *
 *   2. Real line breaks inside string values. JSON forbids them — a multi-
 *      paragraph FAQ answer fails with "Bad control character in string
 *      literal" — but they are exactly what you get from writing prose in any
 *      editor. They become \n, which is what the author meant.
 *
 * The scan below tracks whether it is inside a string so it never touches the
 * newlines that format the JSON itself, and honours backslash escaping so a
 * legitimate \" does not end the string early.
 */
export function normaliseSchema(input: string): string {
  // Strip a wrapping <script …> … </script>, keeping only its contents.
  const unwrapped = input
    .replace(/^\s*<script\b[^>]*>/i, "")
    .replace(/<\/script>\s*$/i, "")
    .trim();

  let out = "";
  let inString = false;
  let escaped = false;

  for (const ch of unwrapped) {
    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      out += ch;
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      out += ch;
      continue;
    }
    if (inString && (ch === "\n" || ch === "\r" || ch === "\t")) {
      // \r is dropped rather than encoded: CRLF would otherwise become \r\n
      // and render as a double break.
      if (ch === "\n") out += "\\n";
      else if (ch === "\t") out += "\\t";
      continue;
    }
    out += ch;
  }

  return out;
}

/**
 * A pasted JSON-LD block: normalised, then rejected unless it parses.
 *
 * Shared by the free-form Schema markup field and the FAQ schema override, so
 * both accept the same conveniences (a wrapping <script> tag, real line breaks
 * inside strings) and fail the same way on genuinely broken JSON.
 */
const jsonLdField = optionalText
  // Normalise before validating — see normaliseSchema for what and why.
  .transform((v) => (v ? normaliseSchema(v) : v))
  .refine(
    (v) => {
      if (!v) return true;
      try {
        JSON.parse(v);
        return true;
      } catch {
        return false;
      }
    },
    {
      message:
        "Must be valid JSON. Check for unescaped quotes — paragraph breaks " +
        "and <script> tags are handled automatically.",
    },
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
   *
   * Normalised first, because the two things that break a paste from a schema
   * generator are both mechanical and both fixable without guessing at intent:
   * the surrounding <script> tag, and real line breaks inside string values.
   */
  schemaMarkup: jsonLdField,
});

export const blogSchema = seoSchema.extend({
  title: trimmed.min(1, "Title is required").max(255),
  slug: slugSchema,
  /**
   * No upper bound.
   *
   * The 500-character cap rejected the save outright with no hint in the UI —
   * there is no maxLength on the field, so an author only discovered it after
   * writing. Length here is an editorial judgement, not a correctness one: a
   * long excerpt reads badly on the index and gets truncated by Google when it
   * stands in as the meta description, but neither is a reason for the server
   * to refuse the post.
   */
  excerpt: trimmed.min(1, "Excerpt is required"),
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

/**
 * FAQs for a page, as edited in the repeatable rows on the Page SEO screen.
 *
 * Rows arrive positionally from the form, so a blank pair is a row the editor
 * added and did not fill in, or one they cleared to delete — both mean "drop
 * it", not "reject the save". A row with only one half filled is a genuine
 * mistake, because a question with no answer produces invalid FAQPage markup,
 * so that one is reported rather than silently discarded.
 */
const faqsSchema = z
  .array(z.object({ question: trimmed.max(300), answer: trimmed.max(2000) }))
  .max(50)
  .default([])
  // Validated before filtering, so an issue's path index still refers to the
  // row the editor is looking at rather than to its position after the blanks
  // have been dropped.
  .superRefine((rows, ctx) => {
    rows.forEach((r, i) => {
      if (Boolean(r.question) !== Boolean(r.answer)) {
        ctx.addIssue({
          code: "custom",
          path: [i],
          message: "A FAQ needs both a question and an answer.",
        });
      }
    });
  })
  .transform((rows) => rows.filter((r) => r.question && r.answer));

export const pageSeoSchema = seoSchema.extend({
  pageKey: trimmed
    .min(1, "Path is required")
    .regex(/^\//, "Must start with a slash, e.g. /services")
    .max(200),
  pageName: trimmed.min(1, "Name is required").max(120),
  faqs: faqsSchema,
  /**
   * Optional hand-written FAQ graph. Overrides the block generated from `faqs`
   * rather than adding to it — see the note in lib/models.ts.
   */
  faqSchema: jsonLdField,
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

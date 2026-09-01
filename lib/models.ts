import type { ObjectId } from "mongodb";

/**
 * Collection shapes.
 *
 * Modelled on the Vivacity Laravel schema, with the gaps closed: every advanced
 * SEO field here is reachable from a form AND rendered in <head>. In Vivacity
 * canonical_url, robots, og_*, twitter_* and schema_markup existed as columns
 * but were absent from $fillable, the controller's validate() call and the
 * Blade form, so they could never be set — and the layout ignored most of them
 * even if they had been.
 */

export const COLLECTIONS = {
  users: "users",
  blogs: "blogs",
  categories: "categories",
  tags: "tags",
  pageSeo: "page_seo",
  media: "media",
  contacts: "contacts",
} as const;

export type Role = "admin" | "author";

export type UserDoc = {
  _id?: ObjectId;
  name: string;
  email: string;
  /** bcrypt hash — never the plaintext. */
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

/** Public shape — never leaks passwordHash to the client. */
export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type BlogStatus = "draft" | "published" | "archived";

/**
 * SEO block shared by blogs and standalone pages, so one form component and one
 * <head> renderer serve both.
 */
export type SeoFields = {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  /** e.g. "index, follow" / "noindex, nofollow" */
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  /** Raw JSON-LD, validated as parseable before it is saved. */
  schemaMarkup?: string;
};

export type BlogDoc = SeoFields & {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  /** HTML from the editor. */
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  status: BlogStatus;
  publishedAt?: Date | null;
  authorId: ObjectId;
  categoryId?: ObjectId | null;
  tagIds: ObjectId[];
  isFeatured: boolean;
  allowComments: boolean;
  /** Derived on save from the word count — not user-editable. */
  readingMinutes: number;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryDoc = {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TagDoc = {
  _id?: ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

/** One question/answer pair, editable in the dashboard. */
export type FaqItem = { question: string; answer: string };

/** Per-page SEO overrides, keyed by route path (e.g. "/services"). */
export type PageSeoDoc = SeoFields & {
  _id?: ObjectId;
  /** Route path this applies to, with a leading slash. */
  pageKey: string;
  pageName: string;
  /**
   * FAQs for this route. Rendered on the page *and* serialised into FAQPage
   * JSON-LD, which is why they are stored structured rather than as pasted
   * markup: Google only credits FAQ schema whose answers are visible on the
   * page, so one editor writing both keeps them from drifting apart.
   */
  faqs?: FaqItem[];
  /**
   * Hand-written FAQ JSON-LD, overriding the block generated from `faqs` above.
   * Kept separate from `schemaMarkup` so the FAQ graph can be replaced without
   * touching whatever else the page publishes (Service, Product, and so on).
   *
   * When set, this is emitted verbatim INSTEAD of the generated FAQPage — the
   * two must never both ship, or the page declares its FAQs twice.
   */
  faqSchema?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MediaDoc = {
  _id?: ObjectId;
  /** Public URL — a local /uploads/… path, or an absolute Cloudinary URL. */
  url: string;
  filename: string;
  /**
   * The storage provider's own handle (Cloudinary's public_id), when the file
   * does not live on our filesystem. Absent for local uploads, which are
   * deleted by path instead.
   */
  storageId?: string;
  mimeType: string;
  bytes: number;
  uploadedBy: ObjectId;
  createdAt: Date;
};

/** Blog joined with its author, category and tags, serialised for the client. */
export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: BlogStatus;
  publishedAt: string | null;
  updatedAt: string;
  featuredImage?: string;
  isFeatured: boolean;
  readingMinutes: number;
  viewsCount: number;
  authorName: string;
  categoryName?: string;
  tagNames: string[];
};

/**
 * A contact-form enquiry.
 *
 * Stored before the notification email is attempted, so an SMTP failure can
 * never lose a lead: the row is the record of truth and the email is only a
 * convenience. `emailed` records whether the notification actually went out,
 * which is what makes a failed send visible in the dashboard rather than
 * silent.
 *
 * `service` is optional because the form's select offers "Not sure yet", and
 * `company` because the field is explicitly optional.
 */
export type ContactDoc = {
  _id?: ObjectId;
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  /** Whether the notification email was sent successfully. */
  emailed: boolean;
  /** Set when the notification failed, for diagnosing delivery problems. */
  emailError?: string;
  /** Marked from the dashboard once someone has dealt with the enquiry. */
  handled: boolean;
  /** Request metadata, for spam triage. Never shown as identity. */
  userAgent?: string;
  createdAt: Date;
};

"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import { getDb } from "@/lib/db";
import { SEO_TAG } from "@/lib/page-seo";
import { BLOG_TAG } from "@/lib/public-blogs";
import { COLLECTIONS, type BlogDoc, type PageSeoDoc, type UserDoc } from "@/lib/models";
import {
  createSession,
  destroySession,
  findUserByEmail,
  hashPassword,
  requireAdmin,
  requireUser,
  toSafeUser,
  verifyPassword,
} from "@/lib/auth";
import { countAdmins, getUserById } from "@/lib/users";
import {
  blogSchema,
  categorySchema,
  fieldErrors,
  loginSchema,
  pageSeoSchema,
  profileSchema,
  readingMinutes,
  slugify,
  tagSchema,
  userSchema,
} from "@/lib/validation";

/**
 * Admin mutations.
 *
 * Every action re-checks the session server-side. A Server Action is a public
 * HTTP endpoint — hiding the UI behind a login does not protect the action, so
 * authorisation lives here rather than only in the page that renders the form.
 */

export type ActionState = {
  ok?: boolean;
  error?: string;
  errors?: Record<string, string>;
};

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";

/** Pull the shared SEO block out of a form. */
function seoFrom(fd: FormData) {
  return {
    seoTitle: str(fd, "seoTitle"),
    seoDescription: str(fd, "seoDescription"),
    seoKeywords: str(fd, "seoKeywords"),
    canonicalUrl: str(fd, "canonicalUrl"),
    robots: str(fd, "robots"),
    ogTitle: str(fd, "ogTitle"),
    ogDescription: str(fd, "ogDescription"),
    ogImage: str(fd, "ogImage"),
    ogType: str(fd, "ogType"),
    twitterTitle: str(fd, "twitterTitle"),
    twitterDescription: str(fd, "twitterDescription"),
    twitterImage: str(fd, "twitterImage"),
    twitterCard: str(fd, "twitterCard"),
    schemaMarkup: str(fd, "schemaMarkup"),
  };
}

/**
 * Revalidate everything a post appears on, so a publish is visible at once.
 *
 * updateTag is the load-bearing call: the public blog reads through
 * unstable_cache in lib/public-blogs.ts, so revalidatePath alone would leave a
 * newly published post invisible until the cache window lapsed.
 */
function revalidateBlog(slug?: string) {
  updateTag(BLOG_TAG);
  revalidatePath("/blogs");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blogs/${slug}`);
}

// ---------------------------------------------------------------- auth --

export async function loginAction(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: str(fd, "email"),
    password: str(fd, "password"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const user = await findUserByEmail(parsed.data.email);
  // Same message either way: distinguishing them tells an attacker which
  // addresses exist.
  const invalid: ActionState = { error: "Email or password is incorrect." };
  if (!user) return invalid;

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return invalid;

  await createSession(toSafeUser(user));
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

// --------------------------------------------------------------- blogs --

async function upsertBlog(
  id: string | null,
  fd: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = blogSchema.safeParse({
    ...seoFrom(fd),
    title: str(fd, "title"),
    slug: str(fd, "slug"),
    excerpt: str(fd, "excerpt"),
    content: str(fd, "content"),
    featuredImage: str(fd, "featuredImage"),
    featuredImageAlt: str(fd, "featuredImageAlt"),
    status: str(fd, "status") || "draft",
    publishedAt: str(fd, "publishedAt"),
    categoryId: str(fd, "categoryId"),
    tagIds: fd.getAll("tagIds").map(String).filter(Boolean),
    isFeatured: bool(fd, "isFeatured"),
    allowComments: bool(fd, "allowComments"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const d = parsed.data;
  const db = await getDb();
  const blogs = db.collection<BlogDoc>(COLLECTIONS.blogs);

  const slug = d.slug || slugify(d.title);
  const clash = await blogs.findOne({
    slug,
    ...(id ? { _id: { $ne: new ObjectId(id) } } : {}),
  });
  if (clash) return { errors: { slug: "That slug is already in use." } };

  // A published post always has a date: if the author left it blank, stamp now
  // so it is not withheld by the publishedAt filter on the public queries.
  let publishedAt: Date | null = d.publishedAt ? new Date(d.publishedAt) : null;
  if (d.status === "published" && !publishedAt) publishedAt = new Date();

  const now = new Date();
  const doc = {
    title: d.title,
    slug,
    excerpt: d.excerpt,
    content: d.content,
    featuredImage: d.featuredImage,
    featuredImageAlt: d.featuredImageAlt,
    status: d.status,
    publishedAt,
    categoryId: d.categoryId && ObjectId.isValid(d.categoryId) ? new ObjectId(d.categoryId) : null,
    tagIds: d.tagIds.filter((t) => ObjectId.isValid(t)).map((t) => new ObjectId(t)),
    isFeatured: d.isFeatured,
    allowComments: d.allowComments,
    readingMinutes: readingMinutes(d.content),
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
    seoKeywords: d.seoKeywords,
    canonicalUrl: d.canonicalUrl,
    robots: d.robots,
    ogTitle: d.ogTitle,
    ogDescription: d.ogDescription,
    ogImage: d.ogImage,
    ogType: d.ogType,
    twitterTitle: d.twitterTitle,
    twitterDescription: d.twitterDescription,
    twitterImage: d.twitterImage,
    twitterCard: d.twitterCard,
    schemaMarkup: d.schemaMarkup,
    updatedAt: now,
  };

  let oldSlug: string | undefined;
  if (id) {
    const existing = await blogs.findOne({ _id: new ObjectId(id) });
    oldSlug = existing?.slug;
    await blogs.updateOne({ _id: new ObjectId(id) }, { $set: doc });
  } else {
    await blogs.insertOne({
      ...doc,
      authorId: new ObjectId(user.id),
      viewsCount: 0,
      createdAt: now,
    } as BlogDoc);
  }

  revalidateBlog(slug);
  if (oldSlug && oldSlug !== slug) revalidatePath(`/blogs/${oldSlug}`);
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}

export async function createBlogAction(_prev: ActionState, fd: FormData) {
  return upsertBlog(null, fd);
}

export async function updateBlogAction(_prev: ActionState, fd: FormData) {
  return upsertBlog(str(fd, "id"), fd);
}

export async function deleteBlogAction(fd: FormData): Promise<void> {
  await requireUser();
  const id = str(fd, "id");
  if (!ObjectId.isValid(id)) return;

  const db = await getDb();
  const blogs = db.collection<BlogDoc>(COLLECTIONS.blogs);
  const doc = await blogs.findOne({ _id: new ObjectId(id) });
  await blogs.deleteOne({ _id: new ObjectId(id) });

  revalidateBlog(doc?.slug);
  revalidatePath("/admin/blogs");
}

// -------------------------------------------------- categories and tags --

export async function saveCategoryAction(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  await requireUser();
  const parsed = categorySchema.safeParse({
    name: str(fd, "name"),
    slug: str(fd, "slug"),
    description: str(fd, "description"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const db = await getDb();
  const id = str(fd, "id");
  const now = new Date();
  const slug = parsed.data.slug || slugify(parsed.data.name);

  await db.collection(COLLECTIONS.categories).updateOne(
    id && ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug },
    {
      $set: { name: parsed.data.name, slug, description: parsed.data.description, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  // The category name is the eyebrow label on every public post card.
  updateTag(BLOG_TAG);
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function deleteCategoryAction(fd: FormData): Promise<void> {
  await requireUser();
  const id = str(fd, "id");
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection(COLLECTIONS.categories).deleteOne({ _id: new ObjectId(id) });
  // Posts keep working — the category simply reads as uncategorised.
  await db
    .collection(COLLECTIONS.blogs)
    .updateMany({ categoryId: new ObjectId(id) }, { $set: { categoryId: null } });
  updateTag(BLOG_TAG);
  revalidatePath("/admin/categories");
}

export async function saveTagAction(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  await requireUser();
  const parsed = tagSchema.safeParse({ name: str(fd, "name"), slug: str(fd, "slug") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const db = await getDb();
  const id = str(fd, "id");
  const now = new Date();
  const slug = parsed.data.slug || slugify(parsed.data.name);

  await db.collection(COLLECTIONS.tags).updateOne(
    id && ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { slug },
    { $set: { name: parsed.data.name, slug, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true },
  );

  revalidatePath("/admin/tags");
  return { ok: true };
}

export async function deleteTagAction(fd: FormData): Promise<void> {
  await requireUser();
  const id = str(fd, "id");
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection(COLLECTIONS.tags).deleteOne({ _id: new ObjectId(id) });
  await db
    .collection<BlogDoc>(COLLECTIONS.blogs)
    .updateMany({ tagIds: new ObjectId(id) }, { $pull: { tagIds: new ObjectId(id) } });
  revalidatePath("/admin/tags");
}

// ----------------------------------------------------------- page SEO --

export async function savePageSeoAction(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  await requireUser();
  const parsed = pageSeoSchema.safeParse({
    ...seoFrom(fd),
    pageKey: str(fd, "pageKey"),
    pageName: str(fd, "pageName"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const db = await getDb();
  const now = new Date();
  const { pageKey, ...rest } = parsed.data;

  await db.collection<PageSeoDoc>(COLLECTIONS.pageSeo).updateOne(
    { pageKey },
    { $set: { ...rest, updatedAt: now }, $setOnInsert: { pageKey, createdAt: now } },
    { upsert: true },
  );

  /**
   * The page's own metadata is generated from this row. revalidatePath alone is
   * not enough: the row is read through unstable_cache in lib/page-seo.ts,
   * which is keyed by tag, so without revalidateTag the edit would not appear
   * until the hour-long window lapsed.
   */
  updateTag(SEO_TAG);
  revalidatePath(pageKey);
  revalidatePath("/admin/seo");
  return { ok: true };
}

export async function deletePageSeoAction(fd: FormData): Promise<void> {
  await requireUser();
  const id = str(fd, "id");
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  const doc = await db
    .collection<PageSeoDoc>(COLLECTIONS.pageSeo)
    .findOne({ _id: new ObjectId(id) });
  await db.collection(COLLECTIONS.pageSeo).deleteOne({ _id: new ObjectId(id) });
  // Deleting drops the override, so the page falls back to lib/routes.ts.
  updateTag(SEO_TAG);
  if (doc?.pageKey) revalidatePath(doc.pageKey);
  revalidatePath("/admin/seo");
}

// --------------------------------------------------------------- users --

/**
 * Create or update a user. Admin only — requireAdmin() throws for authors, and
 * it is the only gate that matters: hiding the nav link protects nothing,
 * because a Server Action is a public endpoint.
 */
export async function saveUserAction(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const me = await requireAdmin();
  const id = str(fd, "id");
  const isEdit = Boolean(id) && ObjectId.isValid(id);

  const parsed = userSchema.safeParse({
    name: str(fd, "name"),
    email: str(fd, "email"),
    role: str(fd, "role") || "author",
    password: str(fd, "password"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const d = parsed.data;
  const email = d.email.toLowerCase();

  // A password is mandatory when creating; on edit, blank means "unchanged".
  if (!isEdit && !d.password) {
    return { errors: { password: "Set a password of at least 10 characters" } };
  }

  const db = await getDb();
  const users = db.collection<UserDoc>(COLLECTIONS.users);

  const clash = await users.findOne({
    email,
    ...(isEdit ? { _id: { $ne: new ObjectId(id) } } : {}),
  });
  if (clash) return { errors: { email: "That email is already registered." } };

  // Never let the last admin demote themselves — that locks everyone out of
  // user management permanently.
  if (isEdit && d.role !== "admin") {
    const target = await getUserById(id);
    if (target?.role === "admin" && (await countAdmins()) <= 1) {
      return { error: "This is the only admin. Promote someone else first." };
    }
  }

  const now = new Date();
  if (isEdit) {
    await users.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: d.name,
          email,
          role: d.role,
          updatedAt: now,
          ...(d.password ? { passwordHash: await hashPassword(d.password) } : {}),
        },
      },
    );

    // Changing your own name or email invalidates what the session JWT carries.
    if (id === me.id) {
      await createSession({ id: me.id, name: d.name, email, role: d.role });
    }
  } else {
    await users.insertOne({
      name: d.name,
      email,
      role: d.role,
      passwordHash: await hashPassword(d.password!),
      createdAt: now,
      updatedAt: now,
    } as UserDoc);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUserAction(fd: FormData): Promise<void> {
  const me = await requireAdmin();
  const id = str(fd, "id");
  if (!ObjectId.isValid(id)) return;

  // Deleting yourself, or the last admin, would strand the panel.
  if (id === me.id) return;
  const target = await getUserById(id);
  if (target?.role === "admin" && (await countAdmins()) <= 1) return;

  const db = await getDb();
  await db.collection(COLLECTIONS.users).deleteOne({ _id: new ObjectId(id) });
  // Posts are kept: deleting an author must not delete published content.
  revalidatePath("/admin/users");
}

/**
 * Your own account. Any signed-in user may edit their name, email and password
 * — but not their role, which is why this does not go through userSchema.
 */
export async function updateProfileAction(
  _prev: ActionState,
  fd: FormData,
): Promise<ActionState> {
  const me = await requireUser();

  const parsed = profileSchema.safeParse({
    name: str(fd, "name"),
    email: str(fd, "email"),
    currentPassword: str(fd, "currentPassword"),
    newPassword: str(fd, "newPassword"),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const d = parsed.data;
  const email = d.email.toLowerCase();

  const db = await getDb();
  const users = db.collection<UserDoc>(COLLECTIONS.users);

  const self = await users.findOne({ _id: new ObjectId(me.id) });
  if (!self) return { error: "Account not found." };

  const clash = await users.findOne({ email, _id: { $ne: new ObjectId(me.id) } });
  if (clash) return { errors: { email: "That email is already registered." } };

  let passwordHash: string | undefined;
  if (d.newPassword) {
    const ok = await verifyPassword(d.currentPassword ?? "", self.passwordHash);
    if (!ok) return { errors: { currentPassword: "That password is not correct." } };
    passwordHash = await hashPassword(d.newPassword);
  }

  await users.updateOne(
    { _id: new ObjectId(me.id) },
    {
      $set: {
        name: d.name,
        email,
        updatedAt: new Date(),
        ...(passwordHash ? { passwordHash } : {}),
      },
    },
  );

  // Re-issue the session so the sidebar reflects the new name immediately.
  await createSession({ id: me.id, name: d.name, email, role: self.role });

  revalidatePath("/admin/profile");
  return { ok: true };
}

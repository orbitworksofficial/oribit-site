import { notFound } from "next/navigation";

import { getBlogById, listCategories, listTags } from "@/lib/blogs";
import { requireUserPage } from "@/lib/auth";
import { updateBlogAction } from "../../actions";
import BlogForm, { type BlogFormValues } from "../BlogForm";

export const dynamic = "force-dynamic";

/** Date → the value a datetime-local input expects, in local time. */
function toLocalInput(d?: Date | null): string {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

export default async function EditBlog({ params }: { params: Promise<{ id: string }> }) {
  await requireUserPage();
  const { id } = await params;

  const [blog, categories, tags] = await Promise.all([
    getBlogById(id),
    listCategories(),
    listTags(),
  ]);
  if (!blog) notFound();

  const values: BlogFormValues = {
    id: String(blog._id),
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    featuredImage: blog.featuredImage ?? "",
    featuredImageAlt: blog.featuredImageAlt ?? "",
    status: blog.status,
    publishedAt: toLocalInput(blog.publishedAt),
    categoryId: blog.categoryId ? String(blog.categoryId) : "",
    tagIds: (blog.tagIds ?? []).map(String),
    isFeatured: blog.isFeatured,
    allowComments: blog.allowComments,
    seoTitle: blog.seoTitle ?? "",
    seoDescription: blog.seoDescription ?? "",
    seoKeywords: blog.seoKeywords ?? "",
    canonicalUrl: blog.canonicalUrl ?? "",
    robots: blog.robots ?? "index, follow",
    ogTitle: blog.ogTitle ?? "",
    ogDescription: blog.ogDescription ?? "",
    ogImage: blog.ogImage ?? "",
    ogType: blog.ogType ?? "article",
    twitterTitle: blog.twitterTitle ?? "",
    twitterDescription: blog.twitterDescription ?? "",
    twitterImage: blog.twitterImage ?? "",
    twitterCard: blog.twitterCard ?? "summary_large_image",
    schemaMarkup: blog.schemaMarkup ?? "",
  };

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Edit post</h1>
          <p>
            /blogs/{blog.slug} · {blog.readingMinutes} min read · {blog.viewsCount} views
          </p>
        </div>
      </div>

      <BlogForm
        action={updateBlogAction}
        values={values}
        categories={categories.map((c) => ({ id: String(c._id), name: c.name }))}
        tags={tags.map((t) => ({ id: String(t._id), name: t.name }))}
        submitLabel="Save changes"
      />
    </>
  );
}

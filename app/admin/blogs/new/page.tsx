import { listCategories, listTags } from "@/lib/blogs";
import { requireUserPage } from "@/lib/auth";
import { createBlogAction } from "../../actions";
import BlogForm, { type BlogFormValues } from "../BlogForm";

export const dynamic = "force-dynamic";

const EMPTY: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  featuredImageAlt: "",
  status: "draft",
  publishedAt: "",
  categoryId: "",
  tagIds: [],
  isFeatured: false,
  allowComments: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  canonicalUrl: "",
  robots: "index, follow",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogType: "article",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterCard: "summary_large_image",
  schemaMarkup: "",
};

export default async function NewBlog() {
  await requireUserPage();
  const [categories, tags] = await Promise.all([listCategories(), listTags()]);

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>New post</h1>
        </div>
      </div>

      <BlogForm
        action={createBlogAction}
        values={EMPTY}
        categories={categories.map((c) => ({ id: String(c._id), name: c.name }))}
        tags={tags.map((t) => ({ id: String(t._id), name: t.name }))}
        submitLabel="Create post"
      />
    </>
  );
}

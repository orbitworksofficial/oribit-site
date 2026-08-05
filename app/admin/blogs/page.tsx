import Link from "next/link";

import { listBlogs, listCategories } from "@/lib/blogs";
import { requireUser } from "@/lib/auth";
import { deleteBlogAction } from "../actions";
import type { BlogStatus } from "@/lib/models";

export const dynamic = "force-dynamic";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function BlogsIndex({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; category?: string; page?: string }>;
}) {
  await requireUser();
  const sp = await searchParams;

  const [{ items, total, page, perPage }, categories] = await Promise.all([
    listBlogs({
      search: sp.search,
      status: (sp.status as BlogStatus) || "",
      categoryId: sp.category,
      page: Number(sp.page ?? 1),
    }),
    listCategories(),
  ]);

  const pages = Math.max(1, Math.ceil(total / perPage));
  const qs = (p: number) => {
    const params = new URLSearchParams();
    if (sp.search) params.set("search", sp.search);
    if (sp.status) params.set("status", sp.status);
    if (sp.category) params.set("category", sp.category);
    params.set("page", String(p));
    return `?${params}`;
  };

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Blog posts</h1>
          <p>
            {total} post{total === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/admin/blogs/new" className="adm-btn">
          New post
        </Link>
      </div>

      {/* GET form: filters live in the URL, so they survive a refresh and can
        * be shared or bookmarked. */}
      <form className="adm-filters" method="get">
        <input
          className="adm-input"
          type="search"
          name="search"
          placeholder="Search titles…"
          defaultValue={sp.search ?? ""}
        />
        <select className="adm-select" name="status" defaultValue={sp.status ?? ""}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <select className="adm-select" name="category" defaultValue={sp.category ?? ""}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={String(c._id)} value={String(c._id)}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="adm-btn adm-btn--ghost">
          Filter
        </button>
        {(sp.search || sp.status || sp.category) && (
          <Link href="/admin/blogs" className="adm-btn adm-btn--ghost">
            Clear
          </Link>
        )}
      </form>

      <div className="adm-card">
        {items.length === 0 ? (
          <div className="adm-empty">No posts match those filters.</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Author</th>
                <th>Published</th>
                <th>Views</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link href={`/admin/blogs/${b.id}`}>{b.title}</Link>
                    <div style={{ color: "var(--adm-muted)", fontSize: "1.25rem" }}>
                      /{b.slug} · {b.readingMinutes} min
                    </div>
                  </td>
                  <td>
                    <span className={`adm-pill adm-pill--${b.status}`}>{b.status}</span>
                  </td>
                  <td>{b.categoryName ?? "—"}</td>
                  <td>{b.authorName}</td>
                  <td>{fmtDate(b.publishedAt)}</td>
                  <td>{b.viewsCount}</td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    {b.status === "published" && (
                      <Link
                        href={`/blogs/${b.slug}`}
                        target="_blank"
                        className="adm-btn adm-btn--danger"
                        style={{ color: "var(--adm-muted)" }}
                      >
                        View
                      </Link>
                    )}
                    <form action={deleteBlogAction} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={b.id} />
                      <button type="submit" className="adm-btn adm-btn--danger">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="adm-pager">
          <span>
            Page {page} of {pages}
          </span>
          <span style={{ display: "flex", gap: "0.8rem" }}>
            {page > 1 && (
              <Link href={qs(page - 1)} className="adm-btn adm-btn--ghost">
                Previous
              </Link>
            )}
            {page < pages && (
              <Link href={qs(page + 1)} className="adm-btn adm-btn--ghost">
                Next
              </Link>
            )}
          </span>
        </div>
      )}
    </>
  );
}

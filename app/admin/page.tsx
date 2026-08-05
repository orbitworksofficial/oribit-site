import Link from "next/link";

import { getDashboardStats, listBlogs } from "@/lib/blogs";
import { isDbConfigured } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboard() {
  const user = await requireUser();

  if (!isDbConfigured()) {
    return (
      <>
        <div className="adm__head">
          <div>
            <h1>Dashboard</h1>
          </div>
        </div>
        <div className="adm-banner adm-banner--error">
          <strong>No database configured.</strong> Set <code>MONGODB_URI</code> in{" "}
          <code>.env.local</code> and restart the dev server.
        </div>
      </>
    );
  }

  const [stats, recent] = await Promise.all([
    getDashboardStats(),
    listBlogs({ perPage: 5 }),
  ]);

  const tiles = [
    { n: stats.total, l: "Total posts" },
    { n: stats.published, l: "Published" },
    { n: stats.draft, l: "Drafts" },
    { n: stats.archived, l: "Archived" },
    { n: stats.views, l: "Total views" },
    { n: stats.categories, l: "Categories" },
    { n: stats.tags, l: "Tags" },
    { n: stats.users, l: "Users" },
  ];

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Dashboard</h1>
          <p>Signed in as {user.name}</p>
        </div>
        <Link href="/admin/blogs/new" className="adm-btn">
          New post
        </Link>
      </div>

      <div className="adm-stats">
        {tiles.map((t) => (
          <div className="adm-stat" key={t.l}>
            <div className="adm-stat__n">{t.n}</div>
            <div className="adm-stat__l">{t.l}</div>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <h2 className="adm-card__title">Recent posts</h2>
        <p className="adm-card__hint">The five most recently created.</p>

        {recent.items.length === 0 ? (
          <div className="adm-empty">
            No posts yet. <Link href="/admin/blogs/new">Write the first one</Link>.
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Published</th>
              </tr>
            </thead>
            <tbody>
              {recent.items.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link href={`/admin/blogs/${b.id}`}>{b.title}</Link>
                  </td>
                  <td>
                    <span className={`adm-pill adm-pill--${b.status}`}>{b.status}</span>
                  </td>
                  <td>{b.categoryName ?? "—"}</td>
                  <td>{fmtDate(b.publishedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

import Link from "next/link";

import { requireAdminPage } from "@/lib/auth";
import { listPageSeo } from "@/lib/seo-settings";
import { deletePageSeoAction } from "../actions";

export const dynamic = "force-dynamic";

/** A quick read on whether a row is actually filled in. */
function completeness(d: {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}) {
  const done = [d.seoTitle, d.seoDescription, d.ogImage].filter(Boolean).length;
  return { done, of: 3 };
}

export default async function SeoIndex() {
  await requireAdminPage();
  const pages = await listPageSeo();

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Page SEO</h1>
          <p>
            Titles, descriptions and social tags per page. Blank fields fall back to the values
            built into the site.
          </p>
        </div>
        {/* <Link href="/admin/seo/new" className="adm-btn">
          Add page
        </Link> */}
      </div>

      <div className="adm-card">
        {pages.length === 0 ? (
          <div className="adm-empty">
            No pages yet. Run <code>node scripts/seed-db.mjs</code> to add the site&rsquo;s
            routes, or add one manually.
          </div>
        ) : (
          <div className="adm-tablewrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Path</th>
                  <th>Title</th>
                  <th>Robots</th>
                  <th>Filled</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => {
                  const c = completeness(p);
                  return (
                    <tr key={String(p._id)}>
                      <td>
                        <Link href={`/admin/seo/${String(p._id)}`}>{p.pageName}</Link>
                      </td>
                      <td style={{ color: "var(--muted)" }}>{p.pageKey}</td>
                      <td style={{ maxWidth: 320 }}>
                        {p.seoTitle ? (
                          <span>{p.seoTitle}</span>
                        ) : (
                          <span style={{ color: "var(--faint)" }}>Using the site default</span>
                        )}
                      </td>
                      <td style={{ color: "var(--muted)" }}>{p.robots ?? "index, follow"}</td>
                      <td>
                        <span
                          className={`adm-pill adm-pill--${
                            c.done === c.of ? "published" : c.done === 0 ? "archived" : "draft"
                          }`}
                        >
                          {c.done}/{c.of}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <Link
                          href={`/admin/seo/${String(p._id)}`}
                          className="adm-btn adm-btn--link"
                        >
                          Edit
                        </Link>
                        {/* <form action={deletePageSeoAction} style={{ display: "inline" }}>
                          <input type="hidden" name="id" value={String(p._id)} />
                          <button type="submit" className="adm-btn adm-btn--link">
                            Delete
                          </button>
                        </form> */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

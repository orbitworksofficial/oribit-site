import Link from "next/link";

import { requireAdminPage } from "@/lib/auth";
import { listUsers } from "@/lib/users";
import { deleteUserAction } from "../actions";

export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default async function UsersPage() {
  // Admin only. Authors never see the nav link, but this is the gate that
  // actually enforces it.
  const me = await requireAdminPage();
  const users = await listUsers();
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Users</h1>
          <p>
            {users.length} account{users.length === 1 ? "" : "s"} · admins have full access,
            authors can manage content but not users
          </p>
        </div>
        <Link href="/admin/users/new" className="adm-btn">
          Add user
        </Link>
      </div>

      <div className="adm-card">
        {users.length === 0 ? (
          <div className="adm-empty">No users yet.</div>
        ) : (
          <div className="adm-tablewrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Posts</th>
                  <th>Added</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isMe = u.id === me.id;
                  const lastAdmin = u.role === "admin" && adminCount <= 1;
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span className="adm__avatar" aria-hidden="true">
                            {initials(u.name)}
                          </span>
                          <span>
                            <Link href={`/admin/users/${u.id}`}>{u.name}</Link>
                            {isMe && (
                              <span
                                className="adm-pill adm-pill--archived"
                                style={{ marginLeft: 8 }}
                              >
                                You
                              </span>
                            )}
                            <div className="adm-sub">{u.email}</div>
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`adm-pill adm-pill--${u.role}`}>{u.role}</span>
                      </td>
                      <td>{u.postCount}</td>
                      <td>
                        {new Date(u.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <Link href={`/admin/users/${u.id}`} className="adm-btn adm-btn--link">
                          Edit
                        </Link>
                        {/* Deleting yourself or the last admin would strand the
                          * panel, so the control is not offered. */}
                        {!isMe && !lastAdmin && (
                          <form action={deleteUserAction} style={{ display: "inline" }}>
                            <input type="hidden" name="id" value={u.id} />
                            <button type="submit" className="adm-btn adm-btn--link">
                              Delete
                            </button>
                          </form>
                        )}
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

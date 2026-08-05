import Link from "next/link";

import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Shown when an author reaches an admin-only screen.
 *
 * The access check itself lives in the page and the action; this only makes the
 * refusal readable instead of a raw 500.
 */
export default async function ForbiddenPage() {
  const user = await getSession();

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Not available on your account</h1>
          <p>
            {user ? `You are signed in as ${user.role}.` : "You are not signed in."} This section
            is limited to administrators.
          </p>
        </div>
      </div>

      <div className="adm-card">
        <p style={{ margin: 0 }}>
          Ask an administrator if you need access, or head back to{" "}
          <Link href="/admin" style={{ color: "var(--accent)" }}>
            the dashboard
          </Link>
          .
        </p>
      </div>
    </>
  );
}

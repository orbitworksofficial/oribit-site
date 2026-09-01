import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import "./admin.css";
import { getSession } from "@/lib/auth";
import { logoutAction } from "./actions";

/**
 * Admin shell.
 *
 * Guarded here rather than only in proxy.ts: the proxy can see whether a cookie
 * exists, but not whether its signature is valid. This layout verifies the JWT
 * for every admin route, and each action re-checks independently — a Server
 * Action is a public endpoint, so hiding a nav link protects nothing.
 *
 * `noindex` matters: an indexed admin login is free reconnaissance.
 */
export const metadata: Metadata = {
  title: "Admin | Orbit Works",
  robots: { index: false, follow: false },
};

/** Never cache an admin screen. */
export const dynamic = "force-dynamic";

type NavItem = {
  href: string;
  text: string;
  icon: React.ReactNode;
  exact?: boolean;
  adminOnly?: boolean;
};

const I = (d: string) => (
  <svg
    className="adm__ico"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Content",
    items: [
      {
        href: "/admin",
        text: "Dashboard",
        exact: true,
        icon: I("M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"),
      },
      {
        href: "/admin/blogs",
        text: "Blog posts",
        icon: I("M4 4h11l5 5v11H4zM15 4v5h5M8 13h8M8 17h6"),
      },
      {
        href: "/admin/categories",
        text: "Categories",
        icon: I("M3 6h18M3 12h18M3 18h12"),
      },
      { href: "/admin/tags", text: "Tags", icon: I("M3 3h8l10 10-8 8L3 11zM7.5 7.5h.01") },
      {
        href: "/admin/contacts",
        text: "Enquiries",
        icon: I("M4 4h16v16H4zM4 7l8 6 8-6"),
      },
    ],
  },
  {
    label: "SEO",
    items: [
      {
        href: "/admin/seo",
        text: "Page SEO",
        icon: I("M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3"),
      },
      {
        href: "/admin/seo/technical",
        text: "Technical SEO",
        icon: I("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.9 19.4a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.6 15a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7 2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4.6V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1 2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"),
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        href: "/admin/users",
        text: "Users",
        adminOnly: true,
        icon: I("M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"),
      },
      {
        href: "/admin/profile",
        text: "My account",
        icon: I("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"),
      },
    ],
  },
];

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?"
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";

  // The login page renders inside this layout but must not require a session.
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const user = await getSession();
  if (!user) redirect("/admin/login");

  return (
    <div className="adm">
      <aside className="adm__side">
        <Link href="/admin" className="adm__brand" aria-label="Orbit Works admin">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/orbitworks-full-light.png"
            alt="Orbit Works"
            width={1259}
            height={248}
          />
        </Link>

        <nav>
          {NAV.map((group) => {
            const items = group.items.filter((i) => !i.adminOnly || user.role === "admin");
            if (items.length === 0) return null;
            return (
              <div key={group.label}>
                <div className="adm__navlabel">{group.label}</div>
                {items.map((item) => {
                  /**
                   * Longest match wins. A plain startsWith lit up both "Page
                   * SEO" (/admin/seo) and "Technical SEO"
                   * (/admin/seo/technical) on the child route, because the
                   * parent path is a prefix of the child's.
                   */
                  const matches = (href: string, exact?: boolean) =>
                    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

                  const best = NAV.flatMap((g) => g.items)
                    .filter((i) => matches(i.href, i.exact))
                    .sort((a, b) => b.href.length - a.href.length)[0];

                  const active = best?.href === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`adm__link${active ? " is-active" : ""}`}
                    >
                      {item.icon}
                      {item.text}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="adm__side-foot">
          <Link href="/admin/profile" className="adm__who" style={{ textDecoration: "none" }}>
            <span className="adm__avatar" aria-hidden="true">
              {initials(user.name)}
            </span>
            <span className="adm__who-text">
              <span className="adm__who-name">{user.name}</span>
              <span className="adm__who-role">{user.role}</span>
            </span>
          </Link>

          <Link href="/" className="adm__link" target="_blank" rel="noreferrer">
            {I("M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3")}
            View site
          </Link>

          <form action={logoutAction}>
            <button type="submit" className="adm__link adm__signout">
              {I("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9")}
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="adm__main">{children}</main>
    </div>
  );
}

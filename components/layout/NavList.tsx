"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * The nav <ul>, shared by the real fixed header and the hero's .fake-nav clone.
 *
 * The active item is derived from the live pathname (usePathname) rather than a
 * prop: the root layout renders once and does not re-run on soft navigation, so
 * a server-passed `selected` goes stale the moment you navigate client-side.
 * `selected` is still accepted as an SSR hint / fallback.
 */
export default function NavList({ selected }: { selected?: string | null }) {
  const pathname = usePathname() || "/";
  const active =
    NAV_ITEMS.find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))?.label ??
    selected ??
    null;

  return (
    <ul>
      {NAV_ITEMS.map(({ label, href }, i) => (
        <li key={href} className={`cl${i + 2} ${active === label ? " selected" : ""}`}>
          <Link href={href}>{label}</Link>
        </li>
      ))}
    </ul>
  );
}

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
 *
 * Items may carry `children`, rendered as a hover/focus dropdown (see
 * .orbit-nav-sub in orbit.css). The submenu is a real nested <ul> rather than a
 * JS-driven panel so it needs no state, works before hydration, and opens on
 * keyboard focus for free via :focus-within.
 */
export default function NavList({ selected }: { selected?: string | null }) {
  const pathname = usePathname() || "/";
  const matches = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const active =
    NAV_ITEMS.find((i) => matches(i.href) || i.children?.some((c) => matches(c.href)))?.label ??
    selected ??
    null;

  return (
    <ul>
      {NAV_ITEMS.map(({ label, href, children }, i) => (
        <li
          key={href}
          className={`cl${i + 2}${active === label ? " selected" : ""}${
            children ? " orbit-nav-has-sub" : ""
          }`}
        >
          {/*
            An item with children is a menu trigger, not a destination: it opens
            the submenu on hover/focus and goes nowhere itself.

            An <a> with no href rather than a <button>: every one of the theme's
            nav rules is written against `nav ul li a`, so a button inherits the
            <li>'s type (24px/300) instead of the nav's (16px/400) and renders
            visibly different from its siblings. A hrefless anchor keeps all of
            that styling while being, per the HTML spec, "a placeholder for where
            a link might otherwise have been placed" — not a link to nowhere.
            tabIndex + role make it reachable so :focus-within still opens the
            submenu for keyboard users.
          */}
          {children ? (
            <a className="orbit-nav-trigger" role="button" tabIndex={0} aria-expanded={false}>
              {label}
            </a>
          ) : (
            <Link href={href}>{label}</Link>
          )}

          {children && (
            <>
              {/*
                Hand-drawn arrow curving from the parent label down to the child
                link. Deliberately imperfect — the control points wobble and the
                two head strokes are slightly uneven — so it reads as sketched
                rather than as a generated glyph. Decorative only.
              */}
              <svg
                className="orbit-nav-arrow"
                viewBox="0 0 52 46"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="orbit-nav-arrow__line"
                  d="M7 2.5C4.9 8.6 4.6 14.6 6.7 20.1c2.3 6 7.2 10 13.7 12.2 5.6 1.9 12 2.6 18.6 2.4"
                />
                <path className="orbit-nav-arrow__head" d="M32.4 29.6c2.9 2 5.1 3.7 6.9 5.2" />
                <path className="orbit-nav-arrow__head" d="M33.1 40.1c2.3-2.5 4.2-4.3 6.2-5.4" />
              </svg>

              <ul className="orbit-nav-sub">
                {children.map((child) => (
                  // The class is what lets the reset in orbit.css match the
                  // theme's own `nav:not(.social) ul li` specificity — see the
                  // note there. Without it the pill carries ~110px of invisible
                  // padding inherited from the header rows.
                  <li key={child.href} className="orbit-nav-sub__item">
                    <Link
                      href={child.href}
                      // A new tab needs rel=noopener; Next does not add it for us.
                      {...(child.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

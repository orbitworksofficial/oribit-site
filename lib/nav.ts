/**
 * Primary nav items. Kept in a plain (non-"use client") module so both the
 * client NavList and the server SiteFooter can import the array itself — a value
 * imported from a "use client" file into a Server Component becomes a client
 * reference, not the data.
 *
 * The cl* index is a theme hook (theme.css indexes nav items by it), so the
 * order is load-bearing.
 */

export type NavChild = {
  label: string;
  href: string;
  /**
   * Opens in a new tab. Used for the AEO/GEO landing page, which is a
   * standalone campaign page rather than a section of the marketing site.
   */
  external?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  children?: readonly NavChild[];
};

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "AEO + GEO", href: "/products/aeo-geo", external: true },
    ],
  },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

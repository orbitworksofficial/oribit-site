/**
 * Primary nav items. Kept in a plain (non-"use client") module so both the
 * client NavList and the server SiteFooter can import the array itself — a value
 * imported from a "use client" file into a Server Component becomes a client
 * reference, not the data.
 *
 * The cl* index is a theme hook (theme.css indexes nav items by it), so the
 * order is load-bearing.
 */
export const NAV_ITEMS = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Resources", href: "/resources" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
] as const;

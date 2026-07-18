import Link from "next/link";

/**
 * The nav <ul>, shared by the real fixed header and the hero's .fake-nav clone.
 *
 * The cl* classes are theme hooks (theme.css indexes nav items by them), so they
 * stay sequential regardless of label.
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

export default function NavList({ selected }: { selected: string | null }) {
  return (
    <ul>
      {NAV_ITEMS.map(({ label, href }, i) => (
        <li key={href} className={`cl${i + 2} ${selected === label ? " selected" : ""}`}>
          <Link href={href}>{label}</Link>
        </li>
      ))}
    </ul>
  );
}

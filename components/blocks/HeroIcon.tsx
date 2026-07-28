/** Small icons for the page-hero chip, one per page. */
const P = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<string, React.ReactNode> = {
  // About — people
  about: (
    <>
      <circle cx="9" cy="8.5" r="2.8" {...P} />
      <path d="M3.6 19c0-2.8 2.4-4.6 5.4-4.6s5.4 1.8 5.4 4.6" {...P} />
      <path d="M16.5 6.5a2.6 2.6 0 010 5M17.5 14.6c2 .5 3.3 2 3 4.4" {...P} />
    </>
  ),
  // Contact — message
  contact: (
    <>
      <path d="M4 5h16v11H8l-4 3.5V5z" {...P} />
      <path d="M8.5 9.5h7M8.5 12.5h4.5" {...P} />
    </>
  ),
  // Blog — article
  blog: (
    <>
      <path d="M5 4h11l3 3v13H5z" {...P} />
      <path d="M15.5 4v3.5H19M8.5 12h7M8.5 15.5h7M8.5 8.5h3" {...P} />
    </>
  ),
  // Industries — buildings
  industries: (
    <>
      <path d="M3 20h18M5 20V9l6-4v15M15 20V11l4-2v11" {...P} />
      <path d="M8 11h.01M8 14h.01M8 17h.01" {...P} />
    </>
  ),
  // Services — grid
  services: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" {...P} />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" {...P} />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" {...P} />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" {...P} />
    </>
  ),
};

export default function HeroIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      {ICONS[name] ?? <circle cx="12" cy="12" r="8" {...P} />}
    </svg>
  );
}

/** Category icons for the services sidebar, keyed by bucket slug. */
const P = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<string, React.ReactNode> = {
  // AI Automation — chip
  "ai-automation": (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" {...P} />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.5 1.5M18 6l-1.5 1.5M6 18l1.5-1.5M18 18l-1.5-1.5"
        {...P}
      />
    </>
  ),
  // Digital Marketing — growth arrow
  "digital-marketing": (
    <>
      <path d="M4 19V5M4 19h16" {...P} />
      <path d="M8 15l3.2-4.2L14 13l5-6" {...P} />
      <path d="M15.6 7H19v3.4" {...P} />
    </>
  ),
  // IT & Cloud — cloud
  "it-cloud": <path d="M7 18a4 4 0 010-8 5 5 0 019.6-1.3A3.5 3.5 0 0117 18H7z" {...P} />,
  // Staff Augmentation — people
  "staff-augmentation": (
    <>
      <circle cx="9" cy="8.5" r="2.8" {...P} />
      <path d="M3.6 19c0-2.8 2.4-4.6 5.4-4.6s5.4 1.8 5.4 4.6" {...P} />
      <path d="M16.5 6.5a2.6 2.6 0 010 5M17.5 14.6c2 .5 3.3 2 3 4.4" {...P} />
    </>
  ),
};

export default function BucketIcon({ slug }: { slug: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      {ICONS[slug] ?? <circle cx="12" cy="12" r="8" {...P} />}
    </svg>
  );
}

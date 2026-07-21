"use client";

import { useEffect, useState } from "react";

/**
 * Sticky category nav for the services hub (brief: 4 anchor links that scroll to
 * each bucket). Anchors handle the scroll natively; a scrollspy adds the active
 * state as you move through the page. Purely additive — with JS off the links
 * still jump to their sections.
 */
export default function ServiceNav({ items }: { items: { slug: string; navLabel: string }[] }) {
  const [active, setActive] = useState(items[0]?.slug ?? "");

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.slug))
      .filter((el): el is HTMLElement => el != null);
    if (!sections.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive((visible[0].target as HTMLElement).id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2, 0.5, 1] },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [items]);

  // A <div>, not a <nav>: the theme has a global `nav:not(.social)` rule that
  // makes every <nav> a fixed, full-screen, pointer-events:none drawer — it was
  // hijacking this bar and bleeding its text under the header. role + aria-label
  // keep the semantics without matching that selector.
  return (
    <div className="orbit-svcnav" role="navigation" aria-label="Service categories">
      <ul>
        {items.map((i) => (
          <li key={i.slug} className={active === i.slug ? "is-active" : ""}>
            <a href={`#${i.slug}`}>{i.navLabel}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

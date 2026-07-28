"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { SERVICE_BUCKETS } from "@/lib/services-data";
import { SERVICE_IMAGES } from "@/lib/service-images";
import BucketIcon from "./BucketIcon";
import ServiceCardImage from "./ServiceCardImage";

/**
 * Services hub — a category sidebar beside the selected category's service
 * cards.
 *
 * The sidebar lists the four buckets (icon + name + count); clicking one swaps
 * the panel with a short out→in transition. Cards are laid out for PORTRAIT
 * artwork in an alternating zig-zag — odd cards put the image left, even cards
 * put it right (see .orbit-svc* in services-hub.css).
 *
 * Deep links still work — /services#it-cloud opens that category, because each
 * sidebar item is a real anchor and the hash is read on mount.
 */
/** Length of the fade-out before the new category renders (matches CSS). */
const EXIT_MS = 190;

export default function ServiceExplorer() {
  const [active, setActive] = useState(0);
  /** True while the outgoing panel plays its exit animation. */
  const [leaving, setLeaving] = useState(false);

  /** Fade the current panel out, swap, then let the new one animate in. */
  const select = (i: number) => {
    if (i === active) return;
    setLeaving(true);
    window.setTimeout(() => {
      setActive(i);
      setLeaving(false);
    }, EXIT_MS);
  };

  // Open the bucket named in the URL hash (e.g. /services#staff-augmentation),
  // including when the hash changes while the page is open.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace("#", "");
      const idx = SERVICE_BUCKETS.findIndex((b) => b.slug === hash);
      if (idx > -1) setActive(idx);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const bucket = SERVICE_BUCKETS[active];

  return (
    <div className="orbit-svcx">
      <aside className="orbit-svcx__side" aria-label="Service categories">
        <span className="orbit-eyebrow">Categories</span>
        <ul>
          {SERVICE_BUCKETS.map((b, i) => (
            <li key={b.slug}>
              <button
                type="button"
                className={`orbit-svcx__tab${i === active ? " is-active" : ""}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => select(i)}
              >
                <span className="orbit-svcx__tabicon" aria-hidden="true">
                  <BucketIcon slug={b.slug} />
                </span>
                <span className="orbit-svcx__tabtext">
                  <span className="orbit-svcx__tabname">{b.name}</span>
                  <span className="orbit-svcx__tabcount">
                    {b.services.length} {b.services.length === 1 ? "service" : "services"}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div
        key={bucket.slug}
        className={`orbit-svcx__panel${leaving ? " is-leaving" : ""}`}
        id={bucket.slug}
        style={{ "--bucket-accent": bucket.accent } as CSSProperties}
      >
        <header className="orbit-svcx__head">
          <h2>{bucket.name}</h2>
          <p>{bucket.taglineHub}</p>
        </header>

        <div className="orbit-svcx__cards">
          {bucket.services.map((s) => (
            <article key={s.slug} id={s.slug} className="orbit-svcard">
              <div className="orbit-svcard__media">
                <ServiceCardImage slug={s.slug} fallback={SERVICE_IMAGES[s.slug]} alt={s.title} />
              </div>

              <div className="orbit-svcard__body">
                <h3 className="orbit-svcard__title">{s.title}</h3>
                <p className="orbit-svcard__tagline">{s.tagline}</p>
                <p className="orbit-svcard__desc">{s.description}</p>

                <span className="orbit-svcard__label">Sub-services</span>
                <ul className="orbit-svcard__subs">
                  {s.subServices.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>

                <div className="orbit-svcard__meta">
                  <div>
                    <span className="orbit-svcard__label">Who it is for</span>
                    <p>{s.who}</p>
                  </div>
                  <div className="orbit-svcard__outcome">
                    <span className="orbit-svcard__label">Key outcome</span>
                    <p>{s.outcome}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}


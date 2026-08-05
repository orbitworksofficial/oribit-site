"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { SERVICE_BUCKETS } from "@/lib/services-data";
import { SERVICE_IMAGES } from "@/lib/service-images";
import BucketIcon from "./BucketIcon";
import ServiceCardImage from "./ServiceCardImage";

/**
 * Services hub — a category sidebar beside every category's service cards.
 *
 * All four buckets render continuously, so the whole catalogue is reachable by
 * scrolling. The sidebar is a table of contents over that scroll:
 *
 *   - scrolling updates the active tab automatically (scroll spy);
 *   - clicking a tab still scrolls to that bucket.
 *
 * It previously mounted ONE bucket at a time and swapped panels on click, which
 * meant three quarters of the services were invisible unless you found the
 * sidebar, and nothing below the fold could be discovered by scrolling.
 *
 * The spy is suppressed while a click-scroll is in flight — otherwise the
 * buckets passing under the viewport during a smooth scroll would fight the
 * destination for the active state.
 */

/** Where in the viewport a bucket counts as "current". */
const SPY_LINE = 0.32;

export default function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** Set while a click-initiated scroll is animating; pauses the spy. */
  const seeking = useRef(false);
  const seekTimer = useRef(0);

  const scrollToBucket = useCallback((i: number) => {
    const el = panelRefs.current[i];
    if (!el) return;

    setActive(i);
    seeking.current = true;
    window.clearTimeout(seekTimer.current);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

    // No cross-browser "scroll finished" event; release the spy after the
    // smooth scroll has had time to settle.
    seekTimer.current = window.setTimeout(() => {
      seeking.current = false;
    }, reduced ? 60 : 800);
  }, []);

  // Scroll spy: whichever bucket owns the spy line is the active one.
  useEffect(() => {
    let raf = 0;

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (seeking.current) return;

        const line = window.innerHeight * SPY_LINE;
        let next = 0;
        panelRefs.current.forEach((el, i) => {
          if (el && el.getBoundingClientRect().top <= line) next = i;
        });
        setActive((cur) => (cur === next ? cur : next));
      });
    };

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();

    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      cancelAnimationFrame(raf);
      window.clearTimeout(seekTimer.current);
    };
  }, []);

  // Deep links (/services#it-cloud) scroll to their bucket, on load and on
  // subsequent hash changes.
  useEffect(() => {
    const jump = () => {
      const hash = window.location.hash.replace("#", "");
      const idx = SERVICE_BUCKETS.findIndex((b) => b.slug === hash);
      if (idx > -1) scrollToBucket(idx);
    };
    jump();
    window.addEventListener("hashchange", jump);
    return () => window.removeEventListener("hashchange", jump);
  }, [scrollToBucket]);

  return (
    <div className="orbit-svcx">
      <aside className="orbit-svcx__side" aria-label="Service categories">
        <span className="orbit-eyebrow">Categories</span>
        <ul>
          {SERVICE_BUCKETS.map((b, i) => (
            <li key={b.slug}>
              <a
                href={`#${b.slug}`}
                className={`orbit-svcx__tab${i === active ? " is-active" : ""}`}
                aria-current={i === active ? "true" : undefined}
                onClick={(e) => {
                  // Let modified clicks (new tab, etc.) behave normally.
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  scrollToBucket(i);
                  history.replaceState(null, "", `#${b.slug}`);
                }}
              >
                <span className="orbit-svcx__tabicon" aria-hidden="true">
                  <BucketIcon slug={b.slug} />
                </span>
                <span className="orbit-svcx__tabtext">
                  <span className="orbit-svcx__tabname">{b.name}</span>
                 
                </span>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className="orbit-svcx__panels">
        {SERVICE_BUCKETS.map((bucket, i) => (
          <div
            key={bucket.slug}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="orbit-svcx__panel"
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
                    <ServiceCardImage
                      slug={s.slug}
                      fallback={SERVICE_IMAGES[s.slug]}
                      alt={s.title}
                    />
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
        ))}
      </div>
    </div>
  );
}

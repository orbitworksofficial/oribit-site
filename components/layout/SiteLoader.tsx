"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/content";

/**
 * First-paint loader.
 *
 * Rendered inside the root layout, so it is present in the initial SSR HTML and
 * covers the page before hydration — no flash of unstyled content. The layout
 * never remounts on client navigation, so the loader shows once per full page
 * load and does not reappear when moving between routes.
 *
 * Timing: hold until the window `load` event (real assets in), but keep a short
 * minimum so the brand beat is deliberate rather than a flicker. Then fade via
 * `.is-done` and drop from the DOM once the CSS transition has run.
 */
const MIN_MS = 1100;
const MAX_MS = 4000;
const FADE_MS = 650;

export default function SiteLoader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = Date.now();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      const wait = Math.max(0, MIN_MS - (Date.now() - start));
      window.setTimeout(() => setDone(true), wait);
    };
    // Dismiss on window load, but never hang: a hard cap guarantees the loader
    // clears even if a slow/looping asset delays the load event.
    const cap = window.setTimeout(finish, MAX_MS);
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => {
      window.clearTimeout(cap);
      window.removeEventListener("load", finish);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setGone(true), FADE_MS);
    return () => window.clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div className={`orbit-loader${done ? " is-done" : ""}`} role="status" aria-live="polite">
      <div className="orbit-loader__inner">
        <span className="orbit-loader__orbit" aria-hidden="true">
          <i className="orbit-loader__dot" />
        </span>
        <img
          className="orbit-loader__logo"
          src="/brand/orbitworks-full-light.png"
          alt="OrbitWorks"
          width={220}
          height={40}
        />
        <p className="orbit-loader__tag">{BRAND.tagline}</p>
        <span className="orbit-loader__sr">Loading</span>
      </div>
    </div>
  );
}

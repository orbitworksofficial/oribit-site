"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/content";
import { PRELOAD_IMAGES, heroVideoSrc } from "@/lib/preload";

/**
 * First-paint loader with real asset preloading.
 *
 * Rendered inside the root layout, so it is present in the initial SSR HTML and
 * covers the page before hydration — no flash of unstyled content. The layout
 * never remounts on client navigation, so the loader shows once per full page
 * load and does not reappear when moving between routes.
 *
 * On the homepage it warms the hero loop and the first-screen stills and drives
 * a progress bar, so the page is revealed only once those are ready — that is
 * what stops the hero video stuttering/buffering on first view. Elsewhere it is
 * just the brand beat.
 *
 * Two guarantees: a MIN so the brand beat is deliberate rather than a flicker,
 * and a MAX so a slow or dead asset can never trap the visitor behind it.
 */
const MIN_MS = 700;
const MAX_MS = 12000;
const FADE_MS = 650;

export default function SiteLoader() {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const [pct, setPct] = useState(0);
  /** Real completion (0-100); the bar eases toward it so it never looks stuck. */
  const target = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let settled = false;
    const start = Date.now();

    // Trickle: assets complete in big jumps, so ease the bar toward the real
    // figure and always creep a little while waiting. Capped below 100 until
    // everything is actually ready.
    const tick = window.setInterval(() => {
      if (cancelled || settled) return;
      setPct((cur) => Math.min(95, cur + Math.max(0.6, (target.current + 14 - cur) * 0.09)));
    }, 160);

    const finish = () => {
      if (settled || cancelled) return;
      settled = true;
      window.clearInterval(tick);
      setPct(100);
      const wait = Math.max(0, MIN_MS - (Date.now() - start));
      window.setTimeout(() => {
        if (!cancelled) setDone(true);
      }, wait);
    };

    // Only the homepage needs the heavy hero warm-up.
    const isHome = window.location.pathname === "/";
    if (!isHome) {
      const onLoad = () => finish();
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad, { once: true });
      const cap = window.setTimeout(finish, MAX_MS);
      return () => {
        cancelled = true;
        window.clearInterval(tick);
        window.clearTimeout(cap);
        window.removeEventListener("load", onLoad);
      };
    }

    const video = heroVideoSrc();
    const total = PRELOAD_IMAGES.length + (video ? 1 : 0);
    let completed = 0;
    const bump = () => {
      completed += 1;
      // total can be 0 if there is nothing to warm — never divide by it.
      target.current = total ? (completed / total) * 100 : 100;
    };

    const jobs: Promise<void>[] = PRELOAD_IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          const settleOne = () => {
            bump();
            resolve();
          };
          img.onload = settleOne;
          img.onerror = settleOne; // a missing still must not block the site
          img.src = src;
        }),
    );

    /**
     * Warm the hero by driving the REAL <video> in the page, not a detached
     * copy of it.
     *
     * This used to build its own `document.createElement("video")` and point it
     * at the same file. Both loaded concurrently, so neither could serve the
     * other from cache and the homepage downloaded the hero loop twice —
     * 1.75MB on mobile for nothing. Attaching to the element that is going to
     * play anyway warms exactly the bytes the page needs.
     *
     * PreviewVideo ships `preload="none"` so off-screen loops stay lazy; the
     * hero is above the fold and is the thing we are gating on, so it gets
     * promoted to `auto` here.
     */
    let heroObserver: MutationObserver | null = null;
    let heroWait = 0;

    if (video) {
      jobs.push(
        new Promise<void>((resolve) => {
          const settleOne = () => {
            bump();
            resolve();
          };

          const attach = (v: HTMLVideoElement) => {
            // HAVE_FUTURE_DATA or better: already warm enough.
            if (v.readyState >= 3) return settleOne();
            // canplaythrough = enough buffered to play without stalling; we do
            // not wait for the whole file.
            v.addEventListener("canplaythrough", settleOne, { once: true });
            v.addEventListener("error", settleOne, { once: true });
            v.preload = "auto";
            v.load();
          };

          const find = () =>
            document.querySelector<HTMLVideoElement>(
              ".wp-block-kenza-video-loop-header video",
            );

          const present = find();
          if (present) return attach(present);

          // The loader mounts inside the same tree as the hero, so ordering is
          // not guaranteed — watch for it, and never block on it forever.
          heroObserver = new MutationObserver(() => {
            const v = find();
            if (!v) return;
            heroObserver?.disconnect();
            attach(v);
          });
          heroObserver.observe(document.body, { childList: true, subtree: true });
          heroWait = window.setTimeout(() => {
            heroObserver?.disconnect();
            settleOne();
          }, 4000);
        }),
      );
    }

    void Promise.all(jobs).then(finish);
    const cap = window.setTimeout(finish, MAX_MS);

    return () => {
      cancelled = true;
      window.clearInterval(tick);
      window.clearTimeout(cap);
      window.clearTimeout(heroWait);
      heroObserver?.disconnect();
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

        <span className="orbit-loader__bar" aria-hidden="true">
          <i style={{ width: `${pct}%` }} />
        </span>
        <span className="orbit-loader__pct" aria-hidden="true">
          {Math.round(pct)}%
        </span>

        <span className="orbit-loader__sr">Loading {Math.round(pct)}%</span>
      </div>
    </div>
  );
}

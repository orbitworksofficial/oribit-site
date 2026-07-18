"use client";

import { useEffect, type RefObject } from "react";

/**
 * Port of modules/poster-parallax.
 *
 * Publishes scroll distance as --scroll (px) on the element; theme.css divides
 * it down per layer (the hero poster video uses calc(var(--scroll)/2.5)).
 *
 * The rAF loop only runs while the element is in range and parks itself after
 * 20 frames with no scroll change, so an idle page costs nothing.
 */
export function useParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const top = Math.trunc(
      el.getBoundingClientRect().top + document.documentElement.scrollTop,
    );

    let raf = 0;
    let scrollY = 0;
    let lastY = -1;
    let idleFrames = 0;
    let running = false;
    let height: number | undefined;
    let offset = 0;
    let sizeTimer = 0;

    const stop = () => cancelAnimationFrame(raf);

    const tick = () => {
      if (scrollY !== lastY) {
        el.style.setProperty("--scroll", `${(scrollY - top + offset).toFixed(0)}px`);
        lastY = scrollY;
        idleFrames = 0;
        raf = requestAnimationFrame(tick);
      } else if (idleFrames > 20) {
        running = false;
        idleFrames = 0;
        stop();
      } else {
        idleFrames++;
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      scrollY = document.documentElement.scrollTop;
      const inRange =
        scrollY + window.innerHeight > top && scrollY < (height ?? 0) + top;

      if (inRange) {
        if (!running) {
          running = true;
          window.addEventListener("resize", measure);
          tick();
        }
      } else if (running) {
        window.removeEventListener("resize", measure);
        running = false;
        stop();
      }
    };

    // Height settles asynchronously (video metadata / lazy images), so re-poll
    // until it stops changing before trusting it.
    const measure = () => {
      const y = document.documentElement.scrollTop;
      const h = Math.trunc(el.getBoundingClientRect().height);
      if (h !== height) {
        sizeTimer = window.setTimeout(measure, 200);
      } else {
        onScroll();
      }
      height = h;
      offset = y < h ? 0 : h / 2;
    };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      clearTimeout(sizeTimer);
      stop();
    };
  }, [ref]);
}

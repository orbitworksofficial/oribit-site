"use client";

import { useEffect } from "react";

/**
 * Port of modules/header-scroll.
 *
 * Adds html.scrolling while the user is scrolling DOWN past 200px, and removes
 * it the moment they scroll up. theme.css uses that to slide the logo and burger
 * out of the way (translate3d(0,-14rem,0), 2s cubic-bezier(.86,0,.07,1)).
 *
 * The theme scoped this to body.service/.services/.portrait, because its logo
 * used mix-blend-mode:difference and stayed legible over anything, so it only
 * needed hiding on those templates. The OrbitWorks logo is a flat colour PNG —
 * it cannot blend — so it collides with the big deco-l titles on every page.
 * Running this everywhere is the theme's own fix, applied where we now need it.
 */
export default function HeaderScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let last = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        root.classList.toggle("scrolling", y > 200 && y > last);
        last = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      root.classList.remove("scrolling");
    };
  }, []);

  return null;
}

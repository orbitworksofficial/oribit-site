"use client";

import { useEffect } from "react";

/**
 * Port of modules/nav-position (the .top-link half).
 *
 * The fixed header is hidden at the top of a hero page and slides in once you
 * scroll past it. The theme detects that by observing the .top-link anchor at
 * the very top of <body>:
 *
 *   top-link visible   -> remove html.mob-nav   (at the top; hero owns the nav)
 *   top-link off-screen-> add html.mob-nav      (scrolled; show the fixed nav)
 *
 * .mob-nav-animating suppresses the transition for 1.5s while it settles.
 *
 * The module's other half — cloning the nav into the hero — is rendered
 * declaratively by VideoLoopHeader instead of copied at runtime.
 */
export default function NavPosition() {
  useEffect(() => {
    const target = document.querySelector(".top-link");
    if (!target) return;

    const root = document.documentElement;
    let timer = 0;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            root.classList.remove("mob-nav");
          } else {
            root.classList.add("mob-nav-animating");
            root.classList.add("mob-nav");
            clearTimeout(timer);
            timer = window.setTimeout(
              () => root.classList.remove("mob-nav-animating"),
              1500,
            );
          }
        }
      },
      { rootMargin: "0px", threshold: [0, 1] },
    );

    obs.observe(target);

    return () => {
      obs.disconnect();
      clearTimeout(timer);
      root.classList.remove("mob-nav", "mob-nav-animating");
    };
  }, []);

  return null;
}

"use client";

import { useEffect, type RefObject } from "react";

/**
 * Port of modules/marquee.
 *
 * The track is cloned 4x so the loop never runs dry, then the offset to the
 * first clone is measured and published as --marquee/--speed for theme.css to
 * animate. Speed is distance/100 seconds, i.e. a constant 100px/s regardless of
 * how wide the logo set is.
 */
export function useMarquee(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const slider = el.querySelector<HTMLElement>(".slider");
    if (!slider) return;

    const originals = Array.from(slider.querySelectorAll("figure"));
    if (!originals.length) return;

    // 4 extra passes, mirroring the original.
    const clones: HTMLElement[] = [];
    for (let pass = 0; pass < 4; pass++) {
      originals.forEach((fig) => {
        const clone = fig.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        slider.appendChild(clone);
        clones.push(clone);
      });
    }

    // The first element of the first clone pass is the wrap point.
    originals[0]?.classList.add("first-source");
    clones[0]?.classList.add("first");

    const obs = new IntersectionObserver(
      (entries, self) => {
        entries.forEach((entry) => {
          window.setTimeout(() => {
            if (!entry.isIntersecting) return;
            self.unobserve(entry.target);

            const figure = slider.querySelector("figure");
            const first = slider.querySelector(".first");
            if (!figure || !first) return;

            const origin = figure.getBoundingClientRect().left;
            const distance = first.getBoundingClientRect().left - origin;
            if (distance <= 0) return;

            el.setAttribute(
              "style",
              `--marquee: ${distance}px; --speed: ${distance / 100}s`,
            );
            slider.classList.add("animate");
          }, 1000);
        });
      },
      { rootMargin: "0px", threshold: 1 },
    );

    obs.observe(el);

    return () => {
      obs.disconnect();
      clones.forEach((c) => c.remove());
      slider.classList.remove("animate");
    };
  }, [ref]);
}

"use client";

import { useEffect } from "react";
import {
  SELECTED_ITEMS,
  SELECTED_SUB_ITEMS,
  POSTER_SELECTION,
  OBSERVER_INIT,
  REVEAL_DELAY,
  CLEANUP_DELAY,
} from "@/lib/consts";
import { trigger, deregister } from "@/lib/delegation";

/**
 * Port of modules/transitions from the 4.3.4 bundle.
 *
 * Class contract (theme.css owns the visuals):
 *   .ahide  opacity:0; translate3d(0,10rem,0)
 *   .aitem  transition: opacity/transform 3s cubic-bezier(.23,1,.32,1)
 *
 * Elements are tagged .ahide+.aitem up front, then .ahide is stripped 100ms
 * after they intersect, which is what actually plays the slide-up. .aitem is
 * removed at 4s so a finished element stops carrying a live transition.
 *
 * A container marked data-transition-include="through" does not animate itself;
 * its matching children animate individually and theme.css staggers them by
 * nth-child. Anything else animates as a single unit.
 */
export default function TransitionEngine() {
  useEffect(() => {
    const root = document.documentElement;
    const main = document.querySelector("main");
    if (!main) return;

    const timers: number[] = [];
    const observers: IntersectionObserver[] = [];

    // Hand over from the static pre-hydration paint.
    timers.push(
      window.setTimeout(() => root.classList.remove("apending"), 10),
    );

    const candidates: (Element | null)[] = [
      ...Array.from(main.querySelectorAll(SELECTED_ITEMS)),
      ...Array.from(main.querySelectorAll('[data-transition-include="through"]')),
      document.querySelector('.contact-footer[data-transition="slideup"]'),
      document.querySelector('footer[data-transition="slideup"]'),
    ];

    const items: Element[] = [];

    for (const el of candidates) {
      if (!el) continue;
      const subs = el.querySelectorAll(SELECTED_SUB_ITEMS);
      const include = el.getAttribute("data-transition-include");

      if (subs.length && include === "through") {
        subs.forEach((sub) => {
          sub.classList.add("ahide");
          timers.push(
            window.setTimeout(() => sub.classList.add("aitem"), REVEAL_DELAY),
          );
          items.push(sub);
        });
        items.push(el);
      } else {
        el.classList.add("ahide");
        el.classList.add("aitem");
        items.push(el);
      }
    }

    const poster = document.querySelector(POSTER_SELECTION);
    if (poster) items.unshift(poster);

    const reveal = (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
      for (const entry of entries) {
        if (entry.intersectionRatio <= 0) continue;
        const el = entry.target as HTMLElement;
        obs.unobserve(el);
        el.classList.remove("sitem");
        timers.push(
          window.setTimeout(() => el.classList.remove("ahide"), REVEAL_DELAY),
        );
        timers.push(
          window.setTimeout(() => el.classList.remove("aitem"), CLEANUP_DELAY),
        );

        const name =
          el.getAttribute("data-scrolltrigger") || el.getAttribute("data-transition");
        if (name) {
          trigger(name, el);
          deregister(name, el);
        }
      }
    };

    // One observer per item, matching the original.
    for (const el of items) {
      const obs = new IntersectionObserver(reveal, OBSERVER_INIT);
      obs.observe(el);
      observers.push(obs);
    }

    return () => {
      timers.forEach(clearTimeout);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return null;
}

"use client";

import { useEffect, type RefObject } from "react";

/**
 * Port of modules/video (videoTransitions).
 *
 * The -25% rootMargin is deliberate: a loop only plays once it is meaningfully
 * on screen, not the moment its first pixel appears.
 */
export function useVideoPlay(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            // play() rejects on autoplay policy / interrupted load; neither is fatal.
            void el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { rootMargin: "-25%", threshold: [0, 0.1] },
    );

    obs.observe(video);
    return () => obs.disconnect();
  }, [ref]);
}

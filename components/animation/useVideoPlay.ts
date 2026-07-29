"use client";

import { useEffect, type RefObject } from "react";

/**
 * Port of modules/video (videoTransitions).
 *
 * The -25% rootMargin is deliberate: a loop only plays once it is meaningfully
 * on screen, not the moment its first pixel appears.
 *
 * `skipOnMobile` opts a single loop out of playback below 743px. It exists for
 * the hero: its "_mob" encode is a byte-identical copy of the 12MB desktop file,
 * so a phone on cellular spends the visit downloading a loop it barely sees —
 * which is why the hero looked broken on mobile. Since the elements use
 * preload="none", never calling play() means the file is never fetched and the
 * poster shows instead: a sharp still, instantly.
 *
 * It is opt-in rather than blanket because the other loops DO have real mobile
 * encodes (top_circles_mob 0.3MB, mirror_portrait_mob 0.9MB) and play fine.
 * Drop the flag at the call site once a real ~1-2MB hero encode exists.
 */
const MOBILE_MAX = 743;

export function useVideoPlay(
  ref: RefObject<HTMLVideoElement | null>,
  { skipOnMobile = false }: { skipOnMobile?: boolean } = {},
) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (skipOnMobile && window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches) {
      // Make sure nothing else kicks off a download, and keep the poster visible.
      video.pause();
      video.removeAttribute("autoplay");
      return;
    }

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
  }, [ref, skipOnMobile]);
}

"use client";

import { useRef } from "react";
import { useVideoPlay } from "@/components/animation/useVideoPlay";

/**
 * Card art that may be a still or a loop.
 *
 * Video cards use preload="none" + useVideoPlay so nothing is fetched until the
 * card is actually on screen — ai.mp4 is 23MB, and eager-loading it would cost
 * more than the rest of the page combined. Worth compressing regardless: a
 * card-sized loop wants to be ~1-2MB, like the theme's own preview loops.
 */
export default function ServiceMedia({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const isVideo = /\.(mp4|webm)$/i.test(src);
  useVideoPlay(ref);

  if (!isVideo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" loading="lazy" decoding="async" />;
  }

  return (
    <video
      ref={ref}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
      disablePictureInPicture
    >
      <source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
    </video>
  );
}

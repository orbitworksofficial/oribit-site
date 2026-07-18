"use client";

import { useRef } from "react";
import { useMarquee } from "@/components/animation/useMarquee";

export type MarqueeLogo = { src: string; width: number; height: number; id: string };

/**
 * Infinite logo marquee. useMarquee clones the track and publishes
 * --marquee/--speed; theme.css runs the `a` keyframe off `.slider.animate`.
 * The .slider wrapper and <figure> children are required by both.
 */
export default function ImageMarquee({
  logos,
  size = "full",
  className = "alignwide",
}: {
  logos: MarqueeLogo[];
  size?: "full" | "large";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useMarquee(ref);

  return (
    <div
      ref={ref}
      className={`wp-block-kenza-image-marquee ${className}`}
      data-transition="slideup"
      data-type="marquee"
    >
      <div className="slider">
        {logos.map((logo) => (
          <figure key={logo.id} className={`wp-block-image size-${size}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              decoding="async"
              width={logo.width}
              height={logo.height}
              loading="lazy"
              src={logo.src}
              alt=""
              className={`wp-image-${logo.id}`}
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

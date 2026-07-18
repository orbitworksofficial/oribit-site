"use client";

import { useRef } from "react";
import { useMarquee } from "@/components/animation/useMarquee";

/**
 * Client marquee, set as type rather than logos.
 *
 * The theme's marquee expects <figure> children and measures the offset to the
 * first clone — useMarquee is unchanged; only the figure contents differ. We
 * have no rights-cleared logo files for these clients, and inventing them would
 * be a false endorsement, so their names run as wordmarks instead. Drop real
 * SVGs in and swap to <ImageMarquee> if that changes.
 */
export default function TextMarquee({ items }: { items: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useMarquee(ref);

  return (
    <div
      ref={ref}
      className="wp-block-kenza-image-marquee alignwide orbit-text-marquee"
      data-transition="slideup"
      data-type="marquee"
    >
      <div className="slider">
        {items.map((name) => (
          <figure key={name} className="wp-block-image size-full">
            <span>{name}</span>
          </figure>
        ))}
      </div>
    </div>
  );
}

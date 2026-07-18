"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PILLARS } from "@/lib/content";

/**
 * The capabilities section — a hover-driven split panel rather than a grid.
 *
 * Left: a sticky preview that crossfades to whichever capability the pointer is
 * on, with a large running index. Right: an editorial list of rows; the active
 * row turns crimson and expands to show its summary and points.
 *
 * The images are stacked and crossfaded on opacity, so switching is instant and
 * nothing reloads. The ai pillar's art is a 23MB video — the showcase uses its
 * poster still instead, deliberately, so the hover panel stays light.
 *
 * next/image is doing real work here, not decoration: the supplied source
 * photos are 5000-8000px raw JPEGs (several MB each). Plain <img> loaded them at
 * full size into a ~530px panel — slow, and blank on first hover. `fill` +
 * `sizes` makes Next resize and serve a panel-sized webp/avif instead.
 *
 * Interaction contract:
 *  - pointer drives `active` via onMouseEnter; keyboard drives it via onFocus,
 *    so tabbing through the rows walks the preview too.
 *  - each row is a link to /services#slug.
 *  - on touch (no hover) the layout collapses to stacked cards — see CSS.
 */

function still(pillar: (typeof PILLARS)[number]): string {
  const isVideo = /\.(mp4|webm)$/i.test(pillar.image);
  return isVideo ? (pillar.poster ?? pillar.image) : pillar.image;
}

export default function PillarShowcase() {
  const [active, setActive] = useState(0);
  const total = PILLARS.length;

  return (
    <div className="orbit-showcase">
      <div className="orbit-showcase__preview" aria-hidden="true">
        {PILLARS.map((p, i) => (
          <figure
            key={p.slug}
            className={`orbit-showcase__media${i === active ? " is-active" : ""}`}
          >
            <Image
              src={still(p)}
              alt=""
              fill
              sizes="(max-width: 743px) 100vw, 45vw"
              // First panel is eager so it never flashes blank on arrival; the
              // rest load as they're revealed.
              priority={i === 0}
              style={{ objectFit: "cover" }}
            />
          </figure>
        ))}

        <span className="orbit-showcase__index">
          {String(active + 1).padStart(2, "0")}
          <i>/ {String(total).padStart(2, "0")}</i>
        </span>
      </div>

      <ul className="orbit-showcase__list">
        {PILLARS.map((p, i) => (
          <li
            key={p.slug}
            className={`orbit-showcase__row${i === active ? " is-active" : ""}`}
            onMouseEnter={() => setActive(i)}
          >
            <Link href={`/services#${p.slug}`} onFocus={() => setActive(i)}>
              <span className="orbit-showcase__no">{String(i + 1).padStart(2, "0")}</span>
              <span className="orbit-showcase__title">{p.title}</span>

              {/* Mobile-only thumb; the sticky preview handles desktop. */}
              <Image
                className="orbit-showcase__thumb"
                src={still(p)}
                alt=""
                width={800}
                height={500}
                sizes="100vw"
                style={{ height: "auto" }}
              />

              <span className="orbit-showcase__detail">
                <span className="orbit-showcase__detail-inner">
                  <span className="orbit-showcase__summary">{p.summary}</span>
                  <span className="orbit-showcase__points">
                    {p.points.map((pt) => (
                      <span key={pt} className="orbit-showcase__point">
                        {pt}
                      </span>
                    ))}
                  </span>
                  <span className="orbit-showcase__cue">Explore</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

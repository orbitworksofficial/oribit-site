"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SERVICE_BUCKETS } from "@/lib/services-data";

/**
 * Homepage services section — the theme's hover-driven split panel (sticky image
 * preview that crossfades to the hovered row; the active row turns to the bucket
 * accent and expands to show its included services), populated with the four
 * category buckets instead of the old pillars.
 *
 * Per-bucket accent rides in as --bucket-accent so the active row, index and
 * cue pick up each bucket's colour. Rows deep-link to /services#slug.
 *
 * Reuses the .orbit-showcase styles/animations in orbit.css; the accent hooks
 * are added in services-hub.css.
 */
export default function BucketShowcase() {
  const [active, setActive] = useState(0);
  const total = SERVICE_BUCKETS.length;
  const accent = SERVICE_BUCKETS[active].accent;

  return (
    <div className="orbit-showcase orbit-showcase--bucket" style={{ ["--bucket-accent" as string]: accent }}>
      <div className="orbit-showcase__preview" aria-hidden="true">
        {SERVICE_BUCKETS.map((b, i) => (
          <figure
            key={b.slug}
            className={`orbit-showcase__media${i === active ? " is-active" : ""}`}
          >
            <Image
              src={b.image}
              alt=""
              fill
              sizes="(max-width: 743px) 100vw, 45vw"
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
        {SERVICE_BUCKETS.map((b, i) => (
          <li
            key={b.slug}
            className={`orbit-showcase__row${i === active ? " is-active" : ""}`}
            style={{ ["--bucket-accent" as string]: b.accent }}
            onMouseEnter={() => setActive(i)}
          >
            <Link href={`/services#${b.slug}`} onFocus={() => setActive(i)}>
              <span className="orbit-showcase__no">{String(i + 1).padStart(2, "0")}</span>
              <span className="orbit-showcase__title">{b.name}</span>

              <Image
                className="orbit-showcase__thumb"
                src={b.image}
                alt=""
                width={800}
                height={500}
                sizes="100vw"
                style={{ height: "auto" }}
              />

              <span className="orbit-showcase__detail">
                <span className="orbit-showcase__detail-inner">
                  <span className="orbit-showcase__summary">{b.taglineHub}</span>
                  <span className="orbit-showcase__points">
                    {b.included.map((pt) => (
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

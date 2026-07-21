import Link from "next/link";
import type { CSSProperties } from "react";
import { SERVICE_BUCKETS } from "@/lib/services-data";

/**
 * Homepage Section 07 — the four category buckets as a 2x2 card grid.
 *
 * Each card shows the bucket name, its homepage tagline, and the marketing
 * "services included" shortlist, and deep-links to that bucket on the hub
 * (/services#slug). Per-bucket accent from the brief rides in as --bucket-accent.
 */
export default function BucketGrid() {
  return (
    <ul className="orbit-buckets">
      {SERVICE_BUCKETS.map((b, i) => (
        <li
          key={b.slug}
          className="orbit-bucket"
          style={{ "--bucket-accent": b.accent } as CSSProperties}
        >
          <Link href={`/services#${b.slug}`} className="orbit-bucket__link">
            <span className="orbit-bucket__no">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="orbit-bucket__name">{b.name}</h3>
            <p className="orbit-bucket__tag">{b.taglineHome}</p>
            <span className="orbit-bucket__label">Services included</span>
            <ul className="orbit-bucket__list">
              {b.included.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <span className="orbit-bucket__cue">Explore</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

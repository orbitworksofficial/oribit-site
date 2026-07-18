import Link from "next/link";
import { PILLARS } from "@/lib/content";
import ServiceMedia from "./ServiceMedia";

/**
 * The six core capabilities.
 *
 * The points are deliberately NOT visible at rest — the card shows art, title
 * and summary, and the detail slides up over the media on hover/focus. Dumping
 * every bullet on screen is what made the old grid read as a spec sheet.
 *
 * The reveal is CSS-only (see .orbit-pillar in orbit.css) so it costs no JS and
 * works before hydration. It is keyboard reachable because the whole card is a
 * link and the panel also opens on :focus-within — a hover-only reveal would
 * hide the content from anyone tabbing through.
 */
export default function PillarGrid() {
  return (
    <ul className="orbit-pillars">
      {PILLARS.map((p) => (
        <li key={p.slug} className="orbit-pillar">
          <Link href={`/services#${p.slug}`} className="orbit-pillar__link">
            <figure className="orbit-pillar__media">
              <ServiceMedia src={p.image} poster={p.poster} />

              <div className="orbit-pillar__reveal">
                <ul>
                  {p.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <span className="orbit-pillar__cue" aria-hidden="true">
                  Explore
                </span>
              </div>
            </figure>

            <h3>{p.title}</h3>
            <p>{p.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

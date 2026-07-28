import Link from "next/link";
import type { CSSProperties } from "react";
import HeroIcon from "./HeroIcon";

/**
 * Editorial page hero: a labelled chip, an oversized headline on the left, and a
 * supporting paragraph + CTAs on the right, over a faded thematic photograph,
 * with a small proof strip beneath.
 *
 * Each page passes its own chip label, icon, background photo and proof points,
 * so the pages share a system without looking identical.
 *
 * `image` is a full URL (Unsplash) or a local path; it renders as a low-opacity
 * background wash so the type stays legible.
 */
export type HeroCta = { label: string; href: string; ghost?: boolean };

export default function PageHero({
  chip,
  icon,
  title,
  lead,
  ctas = [],
  proof = [],
  image,
}: {
  chip: string;
  /** Key into HeroIcon. */
  icon: string;
  /** Renders very large — keep it to a short sentence. */
  title: string;
  lead?: string;
  ctas?: HeroCta[];
  /** Small reassurance points under the hero. */
  proof?: string[];
  image?: string;
}) {
  return (
    <header
      className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-hero"
      data-transition="slideup"
      style={image ? ({ "--hero-photo": `url("${image}")` } as CSSProperties) : undefined}
    >
      <span className="orbit-hero__chip">
        <HeroIcon name={icon} />
        {chip}
      </span>

      <div className="orbit-hero__grid">
        <h1 className="orbit-hero__title">{title}</h1>

        <div className="orbit-hero__aside">
          {lead && <p className="orbit-hero__lead">{lead}</p>}
          {ctas.length > 0 && (
            <div className="orbit-hero__ctas">
              {ctas.map((c) => (
                <Link
                  key={c.href + c.label}
                  href={c.href}
                  className={`orbit-hero__cta${c.ghost ? " orbit-hero__cta--ghost" : ""}`}
                >
                  {c.label}
                  {!c.ghost && (
                    <span className="orbit-hero__arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {proof.length > 0 && (
        <ul className="orbit-hero__proof">
          {proof.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </header>
  );
}

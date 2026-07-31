import { TESTIMONIALS } from "@/lib/content";
import ClientLogo from "./ClientLogo";

/**
 * Continuously scrolling client logo strip (right → left).
 *
 * The list is rendered twice back-to-back and the track is translated by exactly
 * -50%, so the second copy lands where the first started and the loop is
 * seamless. Pure CSS — no JS, no measurement — so it can't desync.
 *
 * Every logo sits in a fixed-size box (see .orbit-marquee__item) so mixed logo
 * dimensions still read as one even row. Pauses on hover; honours
 * prefers-reduced-motion.
 */

/** Logo filename without extension — the key .orbit-marquee__item[data-logo]
 *  uses for the handful of per-mark optical size corrections. */
function logoKey(logo?: string): string | undefined {
  return logo?.split("/").pop()?.replace(/\.\w+$/, "");
}

export default function ClientMarquee() {
  const items = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="orbit-marquee" role="region" aria-label="Our clients">
      <div className="orbit-marquee__track">
        {items.map((t, i) => (
          <div
            className="orbit-marquee__item"
            key={`${t.client}-${i}`}
            data-logo={logoKey(t.logo)}
            /* The duplicated half is decorative — hide it from screen readers. */
            aria-hidden={i >= TESTIMONIALS.length ? "true" : undefined}
          >
            <ClientLogo name={t.client} logo={t.logo} className="orbit-marquee__logo" />
          </div>
        ))}
      </div>
    </div>
  );
}

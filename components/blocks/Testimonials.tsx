import { TESTIMONIALS } from "@/lib/content";

/**
 * Client quotes. Uses the theme's blockquote + .quote-no treatment, and rides
 * the existing transition engine via data-transition-include="through" so each
 * quote staggers in on the theme's own nth-child delays.
 */
export default function Testimonials({ limit }: { limit?: number }) {
  const items = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;

  return (
    <div
      className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-quotes"
      data-transition="slideup"
      data-transition-include="through"
    >
      <h2 className="wp-block-heading deco-l mobile">Clients</h2>
      <h3 className="wp-block-heading book mobilexl shorten">
        What the work looked like from the other side.
      </h3>

      {items.map((t, i) => (
        <blockquote key={t.client} className="orbit-quote">
          <span className="quote-no" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p>{t.quote}</p>
          <footer>
            <cite>{t.client}</cite>
            <span className="label small">{t.sector}</span>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}

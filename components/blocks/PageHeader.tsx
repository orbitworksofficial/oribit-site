/**
 * Heading block for the non-hero pages.
 *
 * Mirrors the theme's own section pattern (as used on the homepage):
 *   h*.deco-l      the big title — 15rem/6rem responsive, weight 600
 *   h3.book.shorten the statement under it
 *   p.large         optional supporting paragraph
 *
 * deco-l is a *title* class, not an eyebrow — it renders at 150px. Passing a
 * sentence to `title` will fill the screen; keep it to a word or two and put the
 * sentence in `lead`.
 *
 * body:not(:has(.wp-block-kenza-video-loop-header, …)) already gets
 * padding-top:20rem from theme.css, so these pages clear the fixed nav.
 */
export default function PageHeader({
  title,
  lead,
  intro,
}: {
  /** Short — one or two words. Renders huge. */
  title: string;
  lead?: string;
  intro?: string;
}) {
  return (
    <div
      className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-pagehero"
      data-transition="slideup"
      data-transition-include="through"
    >
      <span className="orbit-eyebrow orbit-pagehero__eyebrow">OrbitWorks</span>
      <h1 className="wp-block-heading deco-l mobile">{title}</h1>
      {lead && <h3 className="wp-block-heading book mobilexl shorten">{lead}</h3>}
      {intro && (
        <p className="has-text-align-left large large-intro mobilemedium shorten shorten-70 wp-block-paragraph">
          {intro}
        </p>
      )}
    </div>
  );
}

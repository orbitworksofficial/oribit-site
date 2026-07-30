/**
 * Inner-page header. Two distinct looks so pages don't feel templated:
 *
 *   variant="split"  — editorial split: text left, a thematic image in a framed
 *                      right column (pass `flip` to put the image on the left).
 *   variant="center" — centered title over a concentric-ring backdrop, no photo.
 *
 * Defaults to "split" when an image is given, "center" otherwise. All light, to
 * match the white theme, with crimson accents.
 */
export default function PageHeader({
  title,
  lead,
  intro,
  eyebrow = "OrbitWorks",
  image,
  variant,
  flip = false,
}: {
  /** Short — one or two words. Renders huge. */
  title: string;
  lead?: string;
  intro?: string;
  eyebrow?: string;
  image?: string;
  variant?: "split" | "center";
  /** Split only: put the image on the left. */
  flip?: boolean;
}) {
  const mode = variant ?? (image ? "split" : "center");
  const isSplit = mode === "split" && !!image;

  return (
    <div
      className={`wp-block-kenza-column-constraint column-constraint cols-12 orbit-pagehero orbit-pagehero--${
        isSplit ? "split" : "center"
      }${isSplit && flip ? " orbit-pagehero--flip" : ""}`}
      data-transition="slideup"
    >
      {!isSplit && <span className="orbit-pagehero__deco" aria-hidden="true" />}

      <div className="orbit-pagehero__text">
        <span className="orbit-eyebrow orbit-pagehero__eyebrow">{eyebrow}</span>
        <h1 className="wp-block-heading deco-l mobile">{title}</h1>
        {lead && <h3 className="wp-block-heading book mobilexl shorten">{lead}</h3>}
        {intro && (
          <p className="has-text-align-left large large-intro mobilemedium shorten shorten-70 wp-block-paragraph">
            {intro}
          </p>
        )}
      </div>

      {isSplit && (
        <div className="orbit-pagehero__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={`${title} — OrbitWorks`} loading="eager" />
        </div>
      )}
    </div>
  );
}

/**
 * Service card artwork (portrait).
 *
 * Renders whatever lib/service-images maps the slug to — nothing more. An
 * earlier version also probed `/services/<slug>.jpg` in the background so art
 * could be dropped in without a code change, but that fired a 404 for every
 * service without custom art and filled the console with errors. Since the map
 * is edited directly anyway, the probe was pure noise.
 *
 * To use your own art: drop the file in public/services/ and point the slug at
 * it in lib/service-images.ts.
 */
export default function ServiceCardImage({
  fallback,
  alt,
}: {
  slug: string;
  fallback?: string;
  alt: string;
}) {
  if (!fallback) return null;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={fallback} alt={alt} loading="lazy" />;
}

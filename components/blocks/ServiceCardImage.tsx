"use client";

import { useEffect, useState } from "react";

/**
 * Service card artwork, built for PORTRAIT images.
 *
 * Renders the known-good stock image immediately, then probes for your own art
 * at `/services/<slug>.jpg` in the background and swaps it in only once it has
 * actually loaded. Probing (rather than rendering the custom path first and
 * catching onError) means a missing file never flashes a broken image.
 *
 * So: drop a portrait JPG named after the service slug into `public/services/`
 * and it takes over automatically — no code change.
 */
export default function ServiceCardImage({
  slug,
  fallback,
  alt,
}: {
  slug: string;
  fallback?: string;
  alt: string;
}) {
  const [src, setSrc] = useState(fallback);

  useEffect(() => {
    const custom = `/services/${slug}.jpg`;
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => {
      if (!cancelled) setSrc(custom);
    };
    probe.src = custom;
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!src) return null;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" />;
}

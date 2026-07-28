"use client";

import { useState } from "react";

/**
 * Client logo with a monogram fallback.
 *
 * The logo files live in public/brand/clients/. Until a file is added (or if one
 * 404s) this renders the client's initials instead, so the card never shows a
 * broken image. Drop the real PNG/SVG at the path in TESTIMONIALS[].logo and it
 * swaps in automatically.
 */
function initials(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "")).toUpperCase();
}

export default function ClientLogo({
  name,
  logo,
  className = "",
}: {
  name: string;
  logo?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (logo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={`orbit-clientlogo ${className}`}
        src={logo}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={`orbit-clientlogo orbit-clientlogo--mono ${className}`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

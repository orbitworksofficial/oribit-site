import { TESTIMONIALS } from "@/lib/content";

/**
 * Homepage client section — a tidy grid of client tiles (monogram + name +
 * sector) rather than the plain running wordmark strip. Reads as a credible
 * "who we work with" panel. Drawn from the testimonial set so names and sectors
 * stay in sync with the quotes below.
 */
function initials(name: string): string {
  const parts = name.replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/);
  const letters = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "");
  return letters.toUpperCase();
}

export default function ClientGrid() {
  return (
    <ul className="orbit-clients">
      {TESTIMONIALS.map((t) => (
        <li key={t.client} className="orbit-client">
          <span className="orbit-client__mono" aria-hidden="true">
            {initials(t.client)}
          </span>
          <span className="orbit-client__body">
            <strong className="orbit-client__name">{t.client}</strong>
            <span className="orbit-client__sector">{t.sector}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

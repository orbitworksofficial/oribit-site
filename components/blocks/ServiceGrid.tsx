import { SERVICES } from "@/lib/content";
import ServiceMedia from "./ServiceMedia";

/**
 * Service cards.
 *
 * `limit` renders the homepage's short set (the six that carry art); /services
 * takes all thirteen. Cards without art fall back to a type-only card rather
 * than a broken frame — the grid stays even either way.
 *
 * `image` may be a still or an .mp4/.webm loop; ServiceMedia picks the element.
 */
export default function ServiceGrid({ limit }: { limit?: number }) {
  const items = limit ? SERVICES.slice(0, limit) : SERVICES;

  return (
    <ul className="orbit-services">
      {items.map((s) => (
        <li key={s.slug} className={`orbit-service${s.image ? "" : " is-plain"}`} id={s.slug}>
          {s.image && (
            <figure>
              <ServiceMedia src={s.image} poster={s.poster} />
            </figure>
          )}
          <h3>{s.title}</h3>
          <p>{s.summary}</p>
          <ul>
            {s.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

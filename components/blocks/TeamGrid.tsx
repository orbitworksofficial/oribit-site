import { TEAM } from "@/lib/content";

/**
 * Leadership cards.
 *
 * Deliberately monograms, not photos. These are real, named people — putting a
 * stock face or one of Kenza's models against "Taha Becker, Founder & CEO"
 * would be inventing a likeness for someone who exists. Initials are honest and
 * read as a design choice.
 *
 * Swap in real headshots by adding `photo` to TEAM in lib/content.ts and
 * rendering an <img> here instead of .orbit-monogram.
 */

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function TeamGrid() {
  return (
    <ul className="orbit-team">
      {TEAM.map((p) => (
        <li key={p.name}>
          <span className="orbit-monogram" aria-hidden="true">
            {initials(p.name)}
          </span>
          <strong>{p.name}</strong>
          <span className="orbit-role">{p.role}</span>
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useState } from "react";
import { TEAM, type TeamMember } from "@/lib/content";

/**
 * Leadership cards.
 *
 * Each member renders `photo` when TEAM supplies one, and falls back to an
 * initials monogram otherwise — or if the file 404s, so repointing a path never
 * leaves a broken image on the page.
 *
 * The photos shipped today are branded placeholder tiles, not likenesses: these
 * are real, named people, and putting a stock face against "Muhammad Haider,
 * COO" would be inventing one. Drop the real headshots in and update the paths
 * in lib/content.ts.
 */

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function TeamCard({ person }: { person: TeamMember }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(person.photo) && !failed;

  return (
    <li>
      {showPhoto ? (
        <span className="orbit-team__photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={person.photo}
            alt={`${person.name}, ${person.role} at OrbitWorks`}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        </span>
      ) : (
        <span className="orbit-monogram" aria-hidden="true">
          {initials(person.name)}
        </span>
      )}
      <strong>{person.name}</strong>
      <span className="orbit-role">{person.role}</span>
    </li>
  );
}

export default function TeamGrid() {
  return (
    <ul className="orbit-team">
      {TEAM.map((p) => (
        <TeamCard key={p.name} person={p} />
      ))}
    </ul>
  );
}

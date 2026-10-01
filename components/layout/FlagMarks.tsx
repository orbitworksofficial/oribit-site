/**
 * Country flags for the office list.
 *
 * Inline SVG rather than the flag emoji (🇺🇸 / 🇨🇦): Windows ships no glyphs
 * for regional-indicator pairs, so Chrome and Edge there fall back to drawing
 * the bare letters "US" and "CA" instead of a flag. That is most of the
 * desktop audience, so the emoji was wrong for the people most likely to see
 * it. SVG looks the same on every platform and needs no font.
 *
 * Simplified at this size — the US flag gets its 13 stripes and a blue canton
 * (individual stars are sub-pixel at 20px and would only muddy it), and Canada
 * gets its bars and a readable maple leaf. Drawn on a 3:2 grid, the proportion
 * both flags use.
 */
type FlagProps = { className?: string };

export function UsFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#fff" />
      {/* 7 red stripes on a white ground, each 20/13 high. */}
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
      ))}
      <rect width="12.6" height={(20 / 13) * 7} fill="#3C3B6E" />
      {/* Star field, suggested with a light grid rather than 50 shapes. */}
      {[1.4, 3.9, 6.4, 8.9, 11.4].map((cx) =>
        [1.3, 3.4, 5.5, 7.6, 9.7].map((cy) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.52" fill="#fff" />
        )),
      )}
    </svg>
  );
}

export function CaFlag({ className }: FlagProps) {
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#fff" />
      <rect width="7.5" height="20" fill="#D52B1E" />
      <rect x="22.5" width="7.5" height="20" fill="#D52B1E" />
      <path
        fill="#D52B1E"
        d="M15 4.2l.9 1.9c.1.2.3.2.5.1l.8-.4-.5 2.6c-.1.4.2.5.4.3l1.3-1.4.3.8c.1.2.2.2.4.2l1.4-.3-.5 1.7c-.1.3 0 .4.2.5l.5.2-2.1 1.7c-.2.2-.2.3-.1.6l.2.6-2.2-.4c-.3 0-.4.1-.4.3l.1 2.3h-.6l.1-2.3c0-.2-.1-.3-.4-.3l-2.2.4.2-.6c.1-.3 0-.4-.1-.6L10.7 11l.5-.2c.2-.1.3-.2.2-.5l-.5-1.7 1.4.3c.2 0 .3 0 .4-.2l.3-.8 1.3 1.4c.2.2.5.1.4-.3l-.5-2.6.8.4c.2.1.4.1.5-.1z"
      />
    </svg>
  );
}

/** Flag component for an office, keyed by its ISO country code. */
export function OfficeFlag({ code, className }: { code: string; className?: string }) {
  if (code === "CA") return <CaFlag className={className} />;
  return <UsFlag className={className} />;
}

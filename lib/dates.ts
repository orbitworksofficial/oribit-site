/**
 * Shared so the index and the post page can't drift.
 *
 * The locale and timeZone are pinned deliberately: left to the runtime, the
 * server formats in the host's zone and the client in the visitor's, which
 * yields a hydration mismatch on any date near midnight.
 */
const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatPostDate(iso: string): string {
  return fmt.format(new Date(`${iso}T00:00:00Z`));
}

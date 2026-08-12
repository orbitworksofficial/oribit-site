/**
 * Brand marks for the footer social row, keyed by the `cls` field of SOCIAL in
 * lib/content.ts.
 *
 * Filled paths rather than the 1.6-weight strokes the rest of the site's icons
 * use (see BucketIcon). That is a deliberate exception: these are trademarked
 * logos, recognised by their exact silhouette, and redrawing them as outlines
 * to match the house style makes them read as generic shapes at 18px. They
 * still sit inside the theme through `currentColor`, so the row inherits the
 * footer's grey and the brand crimson on hover like every other link.
 */

const ICONS: Record<string, React.ReactNode> = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 21h4V9H3v12zM9.5 9H13v1.7c.6-1 1.9-2 3.8-2 3 0 4.2 1.9 4.2 5.2V21h-4v-6.3c0-1.6-.6-2.6-2-2.6-1.1 0-1.7.7-2 1.5-.1.2-.1.6-.1 1V21h-4V9z" />
  ),
  /**
   * Three sub-paths: the rounded frame, the lens, and the corner dot. Drawing
   * only the frame — as a first pass here did — leaves a plain rounded square
   * that reads as a generic placeholder rather than Instagram.
   */
  instagram: (
    <>
      <path d="M16.5 2.5h-9A5 5 0 002.5 7.5v9a5 5 0 005 5h9a5 5 0 005-5v-9a5 5 0 00-5-5zm3.2 14a3.2 3.2 0 01-3.2 3.2h-9a3.2 3.2 0 01-3.2-3.2v-9A3.2 3.2 0 017.5 4.3h9a3.2 3.2 0 013.2 3.2v9z" />
      <path d="M12 7.4a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.4a2.8 2.8 0 110-5.6 2.8 2.8 0 010 5.6z" />
      <circle cx="16.8" cy="7.2" r="1.1" />
    </>
  ),
  facebook: (
    <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z" />
  ),
  youtube: (
    <path d="M21.6 7.2s-.2-1.4-.8-2c-.75-.8-1.6-.8-2-.85C16 4.2 12 4.2 12 4.2s-4 0-6.8.2c-.4.05-1.25.05-2 .85-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.4v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.75.8 1.75.77 2.2.86 1.6.15 6.8.2 6.8.2s4 0 6.8-.21c.4-.05 1.25-.05 2-.85.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5c0-1.6-.2-3.2-.2-3.2zM9.9 14.6V9l5.15 2.8-5.15 2.8z" />
  ),
  tiktok: (
    <path d="M16.6 5.82A4.28 4.28 0 0115.54 3h-3.09v12.4a2.59 2.59 0 01-2.59 2.5 2.59 2.59 0 01-2.59-2.59 2.59 2.59 0 012.59-2.59c.27 0 .53.04.77.12v-3.1a5.7 5.7 0 00-.77-.05A5.69 5.69 0 004.17 15.4a5.69 5.69 0 005.69 5.69 5.69 5.69 0 005.69-5.69V9.4a7.35 7.35 0 004.29 1.37V7.68a4.29 4.29 0 01-3.24-1.86z" />
  ),
  x: (
    <path d="M17.53 3h3.2l-7 8 8.23 10h-6.44l-5.05-6.6L4.7 21H1.5l7.49-8.56L1.1 3h6.6l4.57 6.04L17.53 3zm-1.12 16.1h1.77L6.7 4.8H4.8l11.6 14.3z" />
  ),
};

export default function SocialIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      {ICONS[name] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}

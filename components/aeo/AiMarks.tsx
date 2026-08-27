/**
 * Brand marks for the hero rotator.
 *
 * Inline SVG rather than image files: nothing to download or keep in sync,
 * they stay crisp at any size, and each one is a simplified single-colour
 * glyph rather than a copy of the official asset — enough to read as the
 * brand beside its own name, without shipping someone else's trademark file.
 *
 * All are drawn on a 24x24 grid and inherit `color`, so the rotator controls
 * their size and tint in one place.
 */
type MarkProps = { className?: string };

export function ChatGptMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M21.6 9.9a5.4 5.4 0 0 0-.5-4.5 5.5 5.5 0 0 0-5.9-2.6A5.4 5.4 0 0 0 11.1.9a5.5 5.5 0 0 0-5.2 3.8 5.4 5.4 0 0 0-3.6 2.6 5.5 5.5 0 0 0 .7 6.4 5.4 5.4 0 0 0 .5 4.5 5.5 5.5 0 0 0 5.9 2.6 5.4 5.4 0 0 0 4.1 1.8 5.5 5.5 0 0 0 5.2-3.8 5.4 5.4 0 0 0 3.6-2.6 5.5 5.5 0 0 0-.7-6.3Zm-8.2 11.4a4.1 4.1 0 0 1-2.6-.9l.1-.1 4.4-2.5a.7.7 0 0 0 .4-.6v-6.2l1.8 1.1v5.1a4.1 4.1 0 0 1-4.1 4.1ZM4.6 17.5a4.1 4.1 0 0 1-.5-2.7l.1.1 4.4 2.5a.7.7 0 0 0 .7 0l5.4-3.1v2.1l-4.5 2.6a4.1 4.1 0 0 1-5.6-1.5ZM3.5 8.3a4.1 4.1 0 0 1 2.1-1.8v5.2a.7.7 0 0 0 .4.6l5.4 3.1-1.8 1-4.5-2.6a4.1 4.1 0 0 1-1.6-5.5Zm15.3 3.6-5.4-3.2 1.8-1 4.5 2.6a4.1 4.1 0 0 1-.6 7.4v-5.2a.7.7 0 0 0-.3-.6Zm1.8-2.7-.1-.1-4.4-2.6a.7.7 0 0 0-.7 0L10 9.6V7.5l4.5-2.6a4.1 4.1 0 0 1 6.1 4.3ZM9 12.9l-1.8-1V6.7a4.1 4.1 0 0 1 6.7-3.2l-.1.1L9.4 6.1a.7.7 0 0 0-.4.6ZM10 10.8 12.4 9.4l2.4 1.4v2.8l-2.4 1.4-2.4-1.4Z" />
    </svg>
  );
}

export function GeminiMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0c.3 6.3 5.4 11.4 11.7 11.7v.6C17.4 12.6 12.3 17.7 12 24h-.6C11.1 17.7 6 12.6-.3 12.3v-.6C6 11.4 11.1 6.3 11.4 0Z" />
    </svg>
  );
}

export function PerplexityMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true"
         fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.2 4.6 8.4v7.2L12 20.8l7.4-5.2V8.4Z" />
      <path d="M12 3.2v17.6M4.6 8.4 12 12l7.4-3.6" />
    </svg>
  );
}

export function ClaudeMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6.1 16.4 10.5 4.3h2.6l4.4 12.1h-2.4l-.9-2.7H9.4l-.9 2.7Zm4-4.7h3.4L11.9 6.6h-.1Z" />
      <path d="M3.4 19.4h17.2v1.6H3.4z" opacity=".55" />
    </svg>
  );
}

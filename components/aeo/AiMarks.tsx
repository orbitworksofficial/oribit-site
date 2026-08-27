/**
 * Brand marks for the hero rotator.
 *
 * Inline SVG rather than image files: nothing to download or keep in sync,
 * they stay crisp at any size, and each one is a simplified single-colour
 * glyph rather than a copy of the official asset — enough to read as the
 * brand beside its own name, without shipping someone else's trademark file.
 *
 * All are drawn on a 24x24 grid. Each carries its OWN brand colour rather
 * than inheriting `currentColor` — the point of showing a mark beside the name
 * is that it is recognisable, and a monochrome tint loses that. Gemini needs a
 * gradient (its mark is four-colour), so it defines one with a unique id;
 * duplicate ids across inlined SVGs would make the first definition win for
 * every instance on the page.
 */
type MarkProps = { className?: string };

export function ChatGptMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#10A37F" aria-hidden="true">
      <path d="M21.6 9.9a5.4 5.4 0 0 0-.5-4.5 5.5 5.5 0 0 0-5.9-2.6A5.4 5.4 0 0 0 11.1.9a5.5 5.5 0 0 0-5.2 3.8 5.4 5.4 0 0 0-3.6 2.6 5.5 5.5 0 0 0 .7 6.4 5.4 5.4 0 0 0 .5 4.5 5.5 5.5 0 0 0 5.9 2.6 5.4 5.4 0 0 0 4.1 1.8 5.5 5.5 0 0 0 5.2-3.8 5.4 5.4 0 0 0 3.6-2.6 5.5 5.5 0 0 0-.7-6.3Zm-8.2 11.4a4.1 4.1 0 0 1-2.6-.9l.1-.1 4.4-2.5a.7.7 0 0 0 .4-.6v-6.2l1.8 1.1v5.1a4.1 4.1 0 0 1-4.1 4.1ZM4.6 17.5a4.1 4.1 0 0 1-.5-2.7l.1.1 4.4 2.5a.7.7 0 0 0 .7 0l5.4-3.1v2.1l-4.5 2.6a4.1 4.1 0 0 1-5.6-1.5ZM3.5 8.3a4.1 4.1 0 0 1 2.1-1.8v5.2a.7.7 0 0 0 .4.6l5.4 3.1-1.8 1-4.5-2.6a4.1 4.1 0 0 1-1.6-5.5Zm15.3 3.6-5.4-3.2 1.8-1 4.5 2.6a4.1 4.1 0 0 1-.6 7.4v-5.2a.7.7 0 0 0-.3-.6Zm1.8-2.7-.1-.1-4.4-2.6a.7.7 0 0 0-.7 0L10 9.6V7.5l4.5-2.6a4.1 4.1 0 0 1 6.1 4.3ZM9 12.9l-1.8-1V6.7a4.1 4.1 0 0 1 6.7-3.2l-.1.1L9.4 6.1a.7.7 0 0 0-.4.6ZM10 10.8 12.4 9.4l2.4 1.4v2.8l-2.4 1.4-2.4-1.4Z" />
    </svg>
  );
}

export function GeminiMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="aeoGeminiGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#1C7DFF" />
          <stop offset="38%" stopColor="#4C8DF6" />
          <stop offset="70%" stopColor="#9179F3" />
          <stop offset="100%" stopColor="#E85D8A" />
        </linearGradient>
      </defs>
      <path
        fill="url(#aeoGeminiGrad)"
        d="M12 0c.3 6.3 5.4 11.4 11.7 11.7v.6C17.4 12.6 12.3 17.7 12 24h-.6C11.1 17.7 6 12.6-.3 12.3v-.6C6 11.4 11.1 6.3 11.4 0Z"
      />
    </svg>
  );
}

export function PerplexityMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true"
         fill="none" stroke="#20B8CD" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.2 4.6 8.4v7.2L12 20.8l7.4-5.2V8.4Z" />
      <path d="M12 3.2v17.6M4.6 8.4 12 12l7.4-3.6" />
    </svg>
  );
}

export function ClaudeMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#D97757" aria-hidden="true">
      <path d="M6.1 16.4 10.5 4.3h2.6l4.4 12.1h-2.4l-.9-2.7H9.4l-.9 2.7Zm4-4.7h3.4L11.9 6.6h-.1Z" />
      <path d="M3.4 19.4h17.2v1.6H3.4z" opacity=".55" />
    </svg>
  );
}

/**
 * Wordmark colour per brand, for the name shown beside each mark.
 *
 * These are the brands' own colours, lightened only where the official value
 * would fail against the near-black hero. ChatGPT's wordmark is effectively
 * black/near-white rather than its green logo colour, so it takes a light
 * grey here; Gemini has no single colour (its mark is a gradient), so the name
 * uses the blue its gradient starts from.
 */
export const AI_TEXT_COLOR: Record<string, string> = {
  ChatGPT: "#E3E7EA",
  Gemini: "#7FA6FF",
  Perplexity: "#3FD0E3",
  Claude: "#E08A6B",
};

/**
 * WhatsApp glyph, in its own brand green.
 *
 * Sized in `em` by the button rule so it tracks the label rather than being
 * pinned to a pixel size.
 */
export function WhatsAppMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5v-.5c-.1-.1-.7-1.6-.9-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3Z" />
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 4.9L2 22l5.2-1.4c1.4.8 3 1.2 4.7 1.2h.1c5.5 0 10-4.5 10-10S17.5 2 12 2Zm0 18.3c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.2.8.9-3.1-.2-.3A8.3 8.3 0 0 1 3.7 12 8.3 8.3 0 0 1 12 3.7 8.3 8.3 0 0 1 20.3 12 8.3 8.3 0 0 1 12 20.3Z" />
    </svg>
  );
}

import Script from "next/script";

/**
 * Support chat widget, loaded from chat.orb-itworks.com.
 *
 * next/script rather than a literal <script> tag: React renders a raw script
 * element into the DOM but never EXECUTES it, so the tag would appear in the
 * page source and silently do nothing. That is the same reason the boot script
 * in app/layout.tsx goes through next/script — see the comment there.
 *
 * `afterInteractive` is the closest supported equivalent to a plain async tag
 * at the end of <body>: the tag keeps its own `async` attribute, stays in the
 * body rather than being hoisted into <head>, and gains no wrapper, no defer
 * and no type="module". The widget is not needed for first paint, so loading
 * it once the page is interactive keeps it off the critical path.
 *
 * The script is self-contained — no npm package, no build step — and mounts
 * into a Shadow DOM, so it cannot collide with the theme's styles.
 *
 * Rendered for every visitor-facing page. The admin panel is excluded at the
 * call site: a support chat has no place in the dashboard.
 */
export default function ChatWidget() {
  return (
    <Script
      src="https://chat.orb-itworks.com/widget.js"
      data-bot-id="66c7c0ec-4e99-4844-b001-296055eacbfd"
      async
      strategy="afterInteractive"
    />
  );
}

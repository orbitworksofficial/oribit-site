import { BRAND } from "@/lib/content";

/**
 * The engine looks this up by the exact selector
 * `.contact-footer[data-transition="slideup"]`, so both the class and the
 * attribute are load-bearing.
 */
export default function ContactFooter() {
  return (
    <article className="contact-footer" data-transition="slideup">
      <h3 className="book">
        Every orbit
        <br />
        begins with a conversation.
      </h3>
      <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
    </article>
  );
}

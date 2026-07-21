import { BRAND } from "@/lib/content";
import { TOP_CIRCLES } from "@/lib/video";
import PreviewVideo from "@/components/blocks/PreviewVideo";

/**
 * The "Every orbit begins with a conversation" band.
 *
 * The engine looks this up by the exact selector
 * `.contact-footer[data-transition="slideup"]`, so both the class and the
 * attribute are load-bearing.
 *
 * Now a dark video band: a looping orbit motif behind a navy scrim, with the
 * copy in the warm off-white on top (see .contact-footer in orbit.css). data-video
 * is the theme's styling hook that fades the loop in on `js-ready`.
 */
export default function ContactFooter() {
  return (
    <article className="contact-footer" data-transition="slideup">
      <div className="contact-footer__bg" data-video="" aria-hidden="true">
        <PreviewVideo sources={TOP_CIRCLES} />
      </div>
      <div className="contact-footer__inner">
        <h3 className="book">
          Every orbit
          <br />
          begins with a conversation.
        </h3>
        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
      </div>
    </article>
  );
}

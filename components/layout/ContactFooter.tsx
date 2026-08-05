import { BRAND } from "@/lib/content";
import { MIRROR_PORTRAIT } from "@/lib/video";
import PreviewVideo from "@/components/blocks/PreviewVideo";

/**
 * The "Every orbit begins with a conversation" band.
 *
 * The engine looks this up by the exact selector
 * `.contact-footer[data-transition="slideup"]`, so both the class and the
 * attribute are load-bearing.
 *
 * Now a dark video band: the same loop and the same crimson duotone as the
 * homepage's "Industries We Empower" section, so the two dark bands read as one
 * treatment (see .contact-footer in vivacity.css). data-video is the theme's
 * styling hook that fades the loop in on `js-ready`.
 */
export default function ContactFooter() {
  return (
    <article className="contact-footer" data-transition="slideup">
      <div className="contact-footer__bg" data-video="" aria-hidden="true">
        <PreviewVideo sources={MIRROR_PORTRAIT} />
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

"use client";

import { useRef } from "react";
import PreviewVideo from "./PreviewVideo";
import FadeText from "./FadeText";
import NavList from "@/components/layout/NavList";
import { useParallax } from "@/components/animation/useParallax";
import { HEADLOOP } from "@/lib/video";

/**
 * The homepage hero: fixed-position loop with the poster parallaxing over it.
 *
 * Two details the theme depends on:
 *  - .poster carries data-transition="parallax"; useParallax publishes --scroll
 *    and theme.css applies translate3d(0, calc(var(--scroll)/2.5), 0).
 *  - The heading is split per character by FadeText; theme.css staggers each
 *    span by 40ms off `.js-ready ... .wp-block-heading span:nth-child(n)`,
 *    offset by var(--delay) (1s on .home). Flattening the spans kills the reveal.
 *
 * The empty sibling after the heading is kept because theme.css targets
 * `.wp-block-heading + .wp-block-heading span:first-child` for the 2.55s beat —
 * the selector needs a sibling carrying .wp-block-heading to exist. It is a <p>,
 * not a second <h1>: the theme shipped two h1s, which gives the page two top
 * headings (one empty) and muddies both SEO and the a11y tree. The theme's rules
 * key off the CLASS, not the tag, so a <p> anchors them identically — and it is
 * display:none via `.wp-block-heading+.wp-block-heading:empty` regardless.
 */
export default function VideoLoopHeader({
  headline,
  selected = null,
  fakeNav = true,
}: {
  /** \n becomes <br/>; FadeText splits the rest per character. */
  headline: string;
  selected?: string | null;
  /** Only body.nav-white pages get the in-hero nav; matches modules/nav-position. */
  fakeNav?: boolean;
}) {
  const posterRef = useRef<HTMLDivElement>(null);
  useParallax(posterRef);

  return (
    // data-video is a STYLING HOOK, not just the old JSON carrier. theme.css keys
    // real layout off it: `[data-video] video{width:100%}` (without it the video
    // renders at intrinsic 1920px and scrolls the page sideways),
    // `.js-ready [data-video] video.preview{opacity:1}` (the fade-in), and the
    // <=979px `[data-video] .poster .preview{height:94.2vw}` mobile sizing.
    // The value is empty because the sources now live in lib/video.ts.
    <div className="wp-block-kenza-video-loop-header alignfull" data-video="">
      <div ref={posterRef} data-transition="parallax" className="poster main-title">
        <div className="vcenter">
          <h1 className="wp-block-heading alignfull">
            <FadeText text={headline} />
          </h1>
          <p className="wp-block-heading alignfull" aria-hidden="true" />
        </div>

        <PreviewVideo sources={HEADLOOP} />
      </div>

      {/*
       * modules/nav-position cloned `nav.header ul` into a <nav class="fake-nav">
       * appended inside the hero on body.nav-white pages. This IS the nav you see
       * over the hero — the real fixed nav stays hidden until you scroll past
       * .top-link. theme.css styles it via `.fake-nav:not(.social)`.
       * Rendered rather than DOM-cloned; same result, no duplication at runtime.
       */}
      {fakeNav && (
        <nav className="fake-nav">
          <NavList selected={selected} />
        </nav>
      )}
    </div>
  );
}

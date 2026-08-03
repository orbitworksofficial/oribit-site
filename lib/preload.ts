/**
 * Assets the loader warms before revealing the homepage.
 *
 * Kept deliberately short: the hero loop plus the stills that appear in the
 * first couple of screens. Preloading everything on the page would trade one
 * problem (a stuttering hero) for a worse one (a long blank loader).
 *
 * NOTE the hero loop is ~13MB, so the loader waits for `canplaythrough`
 * (enough buffered to play without stalling) rather than the whole file, and
 * SiteLoader caps the total wait. Compressing public/video would remove the
 * need for most of this.
 */
import { HEADLOOP } from "./video";
import { MOBILE_MEDIA } from "./video";

/**
 * Stills shown in the first screens of the homepage.
 *
 * Keep this list honest — every entry is a full-size raw download on first
 * paint, and stale entries cost real megabytes. It previously warmed:
 *
 *   front.png (1.66MB) — referenced nowhere on the site at all;
 *   11.jpg    (1.14MB) — art for PILLARS, whose PillarGrid/PillarShowcase
 *                        blocks are no longer rendered on any page;
 *   data/marketing/cloud.jpeg — these DO appear (BucketShowcase), but that
 *                        block renders them through next/image, so preloading
 *                        the raw .jpeg downloaded each one twice: once here and
 *                        once as the optimised .webp the <img> actually used.
 *
 * That was ~3.5MB of an 8.2MB mobile homepage spent on bytes nothing painted.
 * The hero loop is the one asset genuinely worth gating the reveal on.
 *
 * NOTE: these are .jpeg, not .jpg — the wrong extension made every homepage
 * load 404 three times and the loader counted the failures as "done".
 */
export const PRELOAD_IMAGES: string[] = [];

/** The hero loop the browser will actually pick for this viewport. */
export function heroVideoSrc(): string | null {
  const mobile =
    typeof window !== "undefined" && window.matchMedia(MOBILE_MEDIA).matches;
  return (mobile ? HEADLOOP.mobile.mp4 : HEADLOOP.desktop.mp4) ?? null;
}

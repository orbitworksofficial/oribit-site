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

/** Stills shown in the first screens of the homepage. */
export const PRELOAD_IMAGES: string[] = [
  "/media/2024/05/front.png",
  "/media/2024/05/data.jpg",
  "/media/2024/05/marketing.jpg",
  "/media/2024/05/cloud.jpg",
  "/media/2024/05/11.jpg",
];

/** The hero loop the browser will actually pick for this viewport. */
export function heroVideoSrc(): string | null {
  const mobile =
    typeof window !== "undefined" && window.matchMedia(MOBILE_MEDIA).matches;
  return (mobile ? HEADLOOP.mobile.mp4 : HEADLOOP.desktop.mp4) ?? null;
}

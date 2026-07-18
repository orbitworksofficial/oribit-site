/**
 * Video source contract, ported from modules/video.
 *
 * The theme stored sources as a data-video JSON blob and picked a set at runtime
 * from its own desktop/mobile view detection. Here the same choice is expressed
 * declaratively with <source media>, which the browser resolves itself — same
 * outcome, no layout-thrashing measurement on load.
 *
 * MIME strings and source order are copied exactly. Order matters: the browser
 * takes the first source it can play, and the theme deliberately lists plain
 * mp4 ahead of webm/hevc.
 */

export const MIME = {
  mp4: "video/mp4",
  webm: "video/webm; codecs=vp9,opus",
  hevc: 'video/mp4; codecs=hvc1',
} as const;

/** Matches the theme's 743px desktop/mobile split (tablet resolves to desktop). */
export const MOBILE_MEDIA = "(max-width: 743px)";

export type Variant = { mp4?: string; webm?: string; hevc?: string };
export type VideoSet = { desktop: Variant; mobile: Variant; poster?: string };

const V = "/video";

/** Hero loop behind "Design. Science. Intelligence." */
export const HEADLOOP: VideoSet = {
  desktop: {
    mp4: `${V}/headloop_CC_v02.mp4`,
    webm: `${V}/headloop_CC_v02.webm`,
    hevc: `${V}/headloop_CC_v02_hevc.mp4`,
  },
  mobile: {
    mp4: `${V}/headloop_CC_v02_mob.mp4`,
    webm: `${V}/headloop_CC_v02_mob.webm`,
    hevc: `${V}/headloop_CC_v02_mob_hevc.mp4`,
  },
  poster: "/media/2024/05/front.png",
};

/** Circles loop inside the front-page image cluster. */
export const TOP_CIRCLES: VideoSet = {
  desktop: {
    mp4: `${V}/top_circles_new-2.mp4`,
    webm: `${V}/top_circles_new-2.webm`,
    hevc: `${V}/top_circles_new-2_hevc.mp4`,
  },
  mobile: {
    mp4: `${V}/top_circles_new-2_mob.mp4`,
    webm: `${V}/top_circles_new-2_mob.webm`,
    hevc: `${V}/top_circles_new-2_mob_hevc.mp4`,
  },
};

/** Background loop behind the "Industry portraits" panel. */
export const MIRROR_PORTRAIT: VideoSet = {
  desktop: {
    mp4: `${V}/mirror_portrait_large_05h.mp4`,
    webm: `${V}/mirror_portrait_large_05h.webm`,
    hevc: `${V}/mirror_portrait_large_05h_hevc.mp4`,
  },
  mobile: {
    mp4: `${V}/mirror_portrait_large_05h_mob.mp4`,
    webm: `${V}/mirror_portrait_large_05h_mob.webm`,
    hevc: `${V}/mirror_portrait_large_05h_mob_hevc.mp4`,
  },
};

/**
 * The full ~30MB film (KENZA_FILM_20240429-2.*) was deliberately not fetched.
 * The theme removes a <video> that ends up with no <source>, so the hero simply
 * shows its loop and the "Play film" affordance stays out of the DOM until these
 * are downloaded into public/video and wired in here.
 */
export const FULL_FILM: VideoSet | null = null;

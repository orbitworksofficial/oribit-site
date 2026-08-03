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

/**
 * Hero loop behind "Design. Science. Intelligence."
 *
 * Re-encoded from the original 12.2MB 1920x1080 @10.3Mbps master. The first
 * pass (1280w crf30) was visibly soft on the planet texture and ring detail, so
 * quality was raised at the cost of some size:
 *   desktop 1920w crf26 -> 6.10MB  (full resolution retained)
 *   mobile  1080w crf28 -> 1.75MB
 * This is high-motion particle animation, which compresses badly — CRF 20 came
 * out LARGER than the source. crf26 is the point where artefacts stop being
 * visible on the dark gradients.
 * Audio stripped (it is muted anyway) and +faststart set so playback can begin
 * before the file finishes downloading.
 *
 * The .webm/.hevc variants are gone deliberately: all six files were byte-
 * identical copies of the same MP4, so `headloop_CC_v02.webm` was an MP4 served
 * as video/webm — a container mismatch some browsers refuse. One correctly
 * encoded MP4 plays everywhere.
 */
export const HEADLOOP: VideoSet = {
  desktop: {
    mp4: `${V}/headloop_CC_v02.mp4`,
  },
  mobile: {
    mp4: `${V}/headloop_CC_v02_mob.mp4`,
  },
  poster: "/media/2024/05/hero-poster.jpg",
};

/**
 * Orbit motif loop, behind the "Every orbit begins with a conversation" band.
 *
 * Was the ported theme's top_circles clip; now our own orbit_animation
 * (1080x426, re-encoded from a 1.8MB source into the six variants below).
 * The name is kept because the front-page cluster no longer uses this set —
 * it declares its own loop locally in FrontPageImageCluster.tsx.
 */
export const TOP_CIRCLES: VideoSet = {
  desktop: {
    mp4: `${V}/orbit_animation.mp4`,
    webm: `${V}/orbit_animation.webm`,
    hevc: `${V}/orbit_animation_hevc.mp4`,
  },
  mobile: {
    mp4: `${V}/orbit_animation_mob.mp4`,
    webm: `${V}/orbit_animation_mob.webm`,
    hevc: `${V}/orbit_animation_mob_hevc.mp4`,
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

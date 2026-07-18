/**
 * Selector contract lifted verbatim from the 4.3.4 theme bundle (modules/consts).
 * theme.css keys its stagger delays off these exact selectors, so they must not
 * be "tidied" — any change here silently desyncs the transition timing.
 */

export const SELECTED_ITEMS = ['[data-transition*="slideup"]', "[data-scrolltrigger]"].join(", ");

export const SELECTED_SUB_ITEMS = [
  ":scope > article:not(.contact-footer)",
  ":scope > .squarearrowonleft",
  ":scope > h1",
  ":scope > h2",
  ":scope > h3",
  ":scope > h4",
  ":scope > h5",
  ":scope > p",
  ":scope > a",
  ":scope > .cat",
  ":scope > blockquote",
  ":scope > li",
  ":scope > img",
  ":scope > figure",
  ':scope > [class^="wp-block-"]',
  ':scope > .wp-block-columns > .wp-block-column > [class^="wp-block-"]',
  ":scope > .wp-block-columns > .wp-block-column > h1",
  ":scope > .wp-block-columns > .wp-block-column > h2",
  ":scope > .wp-block-columns > .wp-block-column > h3",
  ":scope > .wp-block-columns > .wp-block-column > h4",
  ":scope > .wp-block-columns > .wp-block-column > h5",
  ":scope > .wp-block-columns > .wp-block-column > p",
  ":scope > .wp-block-group > div > .wp-block-image",
  ':scope > .wp-block-group > div > .wp-block-columns > .wp-block-column > [class^="wp-block-"]',
  ":scope > .wp-block-group > div > .wp-block-columns > .wp-block-column > h1",
  ":scope > .wp-block-group > div > .wp-block-columns > .wp-block-column > h2",
  ":scope > .wp-block-group > div > .wp-block-columns > .wp-block-column > h3",
  ":scope > .wp-block-group > div > .wp-block-columns > .wp-block-column > h4",
  ":scope > .wp-block-group > div > .wp-block-columns > .wp-block-column > h5",
  ":scope > .wp-block-group > div > .wp-block-columns > .wp-block-column > p",
].join(", ");

export const POSTER_SELECTION = [
  "main>[data-video]>.poster,main>section>[data-video]>.poster,",
  "main>.poster,main>.wp-block-kenza-case-reports-page-header>.poster",
].join("");

/** IntersectionObserver config used for every transition item. */
export const OBSERVER_INIT: IntersectionObserverInit = {
  rootMargin: "5%",
  threshold: [0, 0.2],
};

/** Reveal happens 100ms after intersect; .aitem is cleaned up once the 3s run ends. */
export const REVEAL_DELAY = 100;
export const CLEANUP_DELAY = 4000;

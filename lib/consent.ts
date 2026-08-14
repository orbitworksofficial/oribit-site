/**
 * Analytics consent, shared between CookieBanner (which obtains it) and
 * Analytics (which declares the Consent Mode defaults).
 *
 * Two pieces have to agree for GA4 to report accurately:
 *
 *   1. Analytics.tsx sets `analytics_storage: 'denied'` before the tag loads,
 *      so nothing is stored until the visitor agrees. Pageviews still reach
 *      Google in that state, but without a _ga cookie they are modelled rather
 *      than counted — sessions and returning-visitor numbers are estimates.
 *      This works identically whether the site is running GTM or the direct
 *      GA4 tag: both read the same `dataLayer` array, which is what the
 *      defaults and the update below are pushed to.
 *   2. Accepting the banner calls grantAnalyticsConsent(), which flips that to
 *      'granted'. GA sets its cookie and the numbers become exact.
 *
 * The consent flag is persisted by CookieBanner, so on later visits the banner
 * never shows — which means the grant has to be replayed on load, or every
 * return visit would silently fall back to denied.
 */

export const CONSENT_KEY = "cookie-check";

/** Whether the visitor has already accepted, on a previous visit or this one. */
export function hasAnalyticsConsent(): boolean {
  if (typeof document === "undefined") return false;
  if (/__hs_initial_opt_in/.test(document.cookie)) return true;
  try {
    return Boolean(localStorage.getItem(CONSENT_KEY));
  } catch {
    // Safari private mode throws on localStorage access.
    return false;
  }
}

/**
 * Tell Google Consent Mode that analytics storage is allowed.
 *
 * Safe to call when gtag is absent (NEXT_PUBLIC_GA_ID unset, or a blocker
 * removed the script) — the queue is a plain array until gtag.js defines the
 * real function, and pushing to it is what the official snippet does anyway.
 */
export function grantAnalyticsConsent(): void {
  if (typeof window === "undefined") return;

  const w = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  const granted = {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  } as const;

  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", granted);
  } else {
    // gtag.js has not defined window.gtag yet; queue it the way the snippet does.
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push(["consent", "update", granted]);
  }

  /**
   * A NAMED event, in addition to the Consent Mode update above.
   *
   * Consent Mode is understood by Google's own tags, which throttle themselves
   * on it automatically. Everything else in GTM — a Meta Pixel added as Custom
   * HTML, LinkedIn, any third-party tag — cannot read it, and would otherwise
   * fire the moment the page loads regardless of what the visitor chose.
   *
   * Triggering those tags on this event instead is what keeps them behind the
   * banner. Pushed on both paths above, and replayed by CookieBanner on repeat
   * visits, so a returning visitor who already accepted still fires it.
   */
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: "consent_granted" });
}

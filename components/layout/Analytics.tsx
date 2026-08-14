import Script from "next/script";

/**
 * Google Tag Manager, with a direct GA4 tag as the fallback.
 *
 * Which one runs is decided by the environment, and the two are mutually
 * exclusive on purpose:
 *
 *   NEXT_PUBLIC_GTM_ID set   → GTM container only. GA4 (and Meta Pixel, and
 *                              anything else) is configured inside GTM's
 *                              dashboard, so new tags need no redeploy.
 *   NEXT_PUBLIC_GTM_ID unset → the GA4 tag is loaded directly, exactly as
 *                              before. Nothing breaks if GTM is never adopted.
 *
 * Loading BOTH would be the classic double-count: GTM fires its own GA4 tag,
 * the direct gtag.js fires another, and every pageview is recorded twice. The
 * branch below makes that state unreachable rather than relying on whoever
 * edits the env vars to remember.
 *
 * CONSENT (unchanged in either mode): the page declares Consent Mode defaults
 * of "denied" BEFORE the tag loads, so nothing is stored until the visitor
 * accepts the cookie banner. Pageviews still reach Google in that state, but
 * without a _ga cookie they are modelled rather than counted. CookieBanner
 * calls grantAnalyticsConsent() on accept — and replays it on later visits,
 * when the banner no longer shows. See lib/consent.
 *
 * The defaults are pushed to `dataLayer` rather than through gtag(), because
 * that is the one channel both modes share: GTM reads dataLayer natively, and
 * gtag.js drains the same array on boot.
 *
 * `afterInteractive` keeps the tag off the critical path — it loads once the
 * page is usable, so it does not push out LCP or Time to Interactive.
 */

/**
 * Consent Mode defaults. Must execute before either tag loads, which is why it
 * ships as its own beforeInteractive script rather than being folded into the
 * loaders below.
 */
const CONSENT_DEFAULTS = `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});`;

export default function Analytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Nothing configured — render nothing, so dev and preview stay out of the
  // production property.
  if (!gtmId && !gaId) return null;

  return (
    <>
      <Script id="consent-defaults" strategy="beforeInteractive">
        {CONSENT_DEFAULTS}
      </Script>

      {gtmId ? (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>

          {/*
            GTM's no-JavaScript fallback. Google's own install instructions put
            this immediately after <body>; here it rides along with the loader
            so the two can never be added out of step. It tracks nothing on its
            own — it exists so tags still fire for the small share of visitors
            running with scripts disabled.
          */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`gtag('js',new Date());
gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  );
}

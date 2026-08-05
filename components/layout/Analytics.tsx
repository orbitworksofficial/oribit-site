import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * Renders nothing unless NEXT_PUBLIC_GA_ID is set, so local development and
 * preview deploys stay out of the production property. Set it in .env.local
 * (and in the host's environment settings) to switch analytics on:
 *
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 *
 * `afterInteractive` keeps the tag off the critical path — it loads once the
 * page is usable, so it does not push out LCP or Time to Interactive.
 *
 * CONSENT: the tag boots with Consent Mode denied, so nothing is stored until
 * the visitor accepts the cookie banner. Pageviews still reach Google in that
 * state, but without a _ga cookie they are modelled rather than counted.
 * CookieBanner calls grantAnalyticsConsent() on accept — and replays it on
 * later visits, when the banner no longer shows. See lib/consent.
 */
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());
gtag('config','${id}');`}
      </Script>
    </>
  );
}

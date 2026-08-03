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
 * NOTE ON CONSENT: the site shows a cookie banner, and GA sets cookies. This
 * loads the tag with Consent Mode defaulting to denied, then CookieBanner is
 * responsible for calling gtag('consent', 'update', ...) on accept. Wiring the
 * banner to that call is the remaining step if you operate under GDPR/ePrivacy.
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

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CONSENT_KEY, grantAnalyticsConsent, hasAnalyticsConsent } from "@/lib/consent";

/**
 * Port of modules/cookie-banner.
 *
 * The banner is driven entirely by classes on <html>: theme.css slides it in on
 * `.cookie` and runs the dismiss transition on `.cookie-animate`. The 1s/2s
 * timings below are what the CSS transition is cut to — shortening them clips
 * the animation.
 *
 * It is also the gate for Google Consent Mode: Analytics.tsx boots with
 * analytics_storage denied, and accepting here is what grants it. See
 * lib/consent.
 */

export default function CookieBanner() {
  useEffect(() => {
    // Already accepted on an earlier visit: the banner stays hidden, but the
    // grant still has to be replayed or GA reverts to the denied default and
    // every return visit is modelled instead of counted.
    if (hasAnalyticsConsent()) {
      grantAnalyticsConsent();
      return;
    }

    const t = window.setTimeout(
      () => document.documentElement.classList.add("cookie"),
      1000,
    );
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    const html = document.documentElement;

    window.setTimeout(() => {
      html.classList.add("cookie-animate");
      html.classList.remove("cookie");
    }, 1000);
    window.setTimeout(() => html.classList.remove("cookie-animate"), 2000);

    // Consent is now genuinely given — let GA store its cookie, which is what
    // turns modelled pageviews into exact user and session counts.
    grantAnalyticsConsent();

    // The theme defers to HubSpot's own opt-in button when its banner is present.
    const hs = document.querySelector<HTMLElement>("#hs-eu-confirmation-button");
    if (hs) {
      hs.click();
    } else {
      try {
        localStorage.setItem(CONSENT_KEY, "true");
      } catch {
        /* no-op: consent simply won't persist */
      }
    }
  };

  return (
    <div className="cookie-warning invert">
      <div className="inner">
        <p>
          <small>
            We use cookies to give you the best browsing experience.{" "}
            <Link href="/legal">Learn more here</Link>.
          </small>
        </p>
        <button data-action="hide-banner" className="cta" onClick={accept} type="button">
          Accept
        </button>
      </div>
    </div>
  );
}

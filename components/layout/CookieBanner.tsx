"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Port of modules/cookie-banner.
 *
 * The banner is driven entirely by classes on <html>: theme.css slides it in on
 * `.cookie` and runs the dismiss transition on `.cookie-animate`. The 1s/2s
 * timings below are what the CSS transition is cut to — shortening them clips
 * the animation.
 */

const CONSENT_KEY = "cookie-check";

function hasConsented(): boolean {
  if (/__hs_initial_opt_in/.test(document.cookie)) return true;
  try {
    return Boolean(localStorage.getItem(CONSENT_KEY));
  } catch {
    // Safari private mode throws on localStorage access.
    return false;
  }
}

export default function CookieBanner() {
  useEffect(() => {
    if (hasConsented()) return;
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

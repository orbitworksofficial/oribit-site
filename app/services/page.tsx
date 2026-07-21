import type { Metadata } from "next";
import Link from "next/link";

import ServiceBuckets from "@/components/blocks/ServiceBuckets";
import Testimonials from "@/components/blocks/Testimonials";
import { SERVICES_HUB } from "@/lib/services-data";
import { chromeFor } from "@/lib/routes";

const chrome = chromeFor("/services");
export const metadata: Metadata = { title: chrome.title, description: chrome.description };

export default function Services() {
  return (
    <main>
      {/* Hero — shares the inner-page navy hero treatment (.orbit-pagehero). */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-pagehero"
        data-transition="slideup"
        data-transition-include="through"
      >
        <span className="orbit-eyebrow orbit-pagehero__eyebrow">OrbitWorks · Services</span>
        <h1 className="wp-block-heading deco-l mobile orbit-hub-title">{SERVICES_HUB.heading}</h1>
        <p className="has-text-align-left large large-intro shorten shorten-70 wp-block-paragraph">
          {SERVICES_HUB.sub}
        </p>
      </div>

      {/* Sticky category nav + the 4 buckets with full service cards */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
      >
        <ServiceBuckets />
      </div>

      <Testimonials limit={3} />

      {/* Bottom CTA (brief) */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-cta-strip"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading book">{SERVICES_HUB.ctaHeading}</h2>
        <p className="has-text-align-center small wp-block-paragraph">{SERVICES_HUB.ctaSub}</p>
        <p className="orbit-cta-row orbit-cta-row--center">
          <Link href="/contact" className="orbit-btn">
            {SERVICES_HUB.ctaButton}
          </Link>
        </p>
        <p className="k-center">
          <a href="#ai-automation" className="squarearrowonleft">
            {SERVICES_HUB.ctaSecondary}
          </a>
        </p>
      </div>
    </main>
  );
}

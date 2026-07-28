import type { Metadata } from "next";
import Link from "next/link";

import PageHero from "@/components/blocks/PageHero";
import ServiceExplorer from "@/components/blocks/ServiceExplorer";
import Testimonials from "@/components/blocks/Testimonials";
import { SERVICES_HUB } from "@/lib/services-data";
import { chromeFor } from "@/lib/routes";

const chrome = chromeFor("/services");
export const metadata: Metadata = { title: chrome.title, description: chrome.description };

export default function Services() {
  return (
    <main>
      <PageHero
        chip="13 services · 4 categories"
        icon="services"
        title={SERVICES_HUB.heading}
        lead={SERVICES_HUB.sub}
        ctas={[
          { label: "Book a Discovery Call", href: "/contact" },
          { label: "Browse all services", href: "#ai-automation", ghost: true },
        ]}
        proof={["One delivery team", "Fixed scope, clear pricing", "Handover you can maintain"]}
        image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=70"
      />

      {/* Sticky category nav + the 4 buckets with full service cards */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
      >
        <ServiceExplorer />
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

import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/blocks/PageHeader";
import PillarShowcase from "@/components/blocks/PillarShowcase";
import ServiceGrid from "@/components/blocks/ServiceGrid";
import Testimonials from "@/components/blocks/Testimonials";
import { SERVICES, SECTIONS } from "@/lib/content";
import { chromeFor } from "@/lib/routes";

const chrome = chromeFor("/services");
export const metadata: Metadata = { title: chrome.title, description: chrome.description };

export default function Services() {
  return (
    <main>
      <PageHeader
        title="Services"
        lead="Thirteen services. One delivery team."
        intro="Most agencies sell you the strategy and subcontract the build. We do both, which is why the plan tends to survive contact with production."
      />

      {/* Core capabilities first — the homepage cards and footer both deep-link
       * here by pillar slug (/services#cloud-infrastructure), so these anchors
       * must exist. */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading deco-l mobile">{SECTIONS.pillarsHeading}</h2>
        <h3 className="wp-block-heading book mobilexl shorten">{SECTIONS.pillarsIntro}</h3>
        <PillarShowcase />
      </div>

      {/* Jump list — 13 services is long enough to need one. */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
      >
        <h2 className="wp-block-heading deco-l mobile">Everything</h2>
        <ul className="wp-block-list block-list" data-transition-include="through">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <a href={`#${s.slug}`}>{s.title}</a>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
      >
        <ServiceGrid />
      </div>

      <Testimonials limit={3} />

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h3 className="wp-block-heading book mobilexl shorten">
          Not sure which of these you need? That is usually the first conversation.
        </h3>
        <p className="k-center">
          <Link href="/contact" className="squarearrowonleft">
            Talk to us
          </Link>
        </p>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/blocks/PageHeader";
import Testimonials from "@/components/blocks/Testimonials";
import { CASE_STUDIES } from "@/lib/content";
import { chromeFor } from "@/lib/routes";

const chrome = chromeFor("/case-studies");
export const metadata: Metadata = { title: chrome.title, description: chrome.description };

export default function CaseStudies() {
  return (
    <main>
      <PageHeader
        title="Cases"
        lead="Selected work."
        intro="Five engagements, in the clients' own words. Each one shipped and handed over."
      />

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
      >
        <ul className="orbit-cards">
          {CASE_STUDIES.map((c) => (
            <li key={c.slug} id={c.slug}>
              {/* No per-case pages yet — the anchor is the destination. */}
              <article className="orbit-card">
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="" loading="lazy" decoding="async" />
                </figure>
                <span className="label">{c.sector}</span>
                <h3>{c.title}</h3>
                <p className="small">{c.client}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <Testimonials />

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h3 className="wp-block-heading book mobilexl shorten">
          Every one of these started as a conversation about a number that wasn't moving.
        </h3>
        <p className="k-center">
          <Link href="/contact" className="squarearrowonleft">
            Start yours
          </Link>
        </p>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/blocks/PageHeader";
import Testimonials from "@/components/blocks/Testimonials";
import { INDUSTRIES } from "@/lib/content";
import { chromeFor } from "@/lib/routes";

const chrome = chromeFor("/industries");
export const metadata: Metadata = { title: chrome.title, description: chrome.description };

export default function Industries() {
  return (
    <main>
      <PageHeader
        title="Industries"
        lead="Eight sectors we already know."
        intro="Domain knowledge saves you paying us to learn your business. These are the ones where we've already done that."
      />

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <ul className="orbit-list">
          {INDUSTRIES.map((i) => (
            <li key={i.name}>
              <strong>{i.name}</strong>
              <span>{i.note}</span>
            </li>
          ))}
        </ul>
      </div>

      <Testimonials limit={3} />

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h3 className="wp-block-heading book mobilexl shorten">
          Not on the list? Half our work starts that way.
        </h3>
        <p className="k-center">
          <Link href="/contact" className="squarearrowonleft">
            Tell us about your sector
          </Link>
        </p>
      </div>
    </main>
  );
}

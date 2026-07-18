import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/blocks/PageHeader";
import { RESOURCES } from "@/lib/content";
import { chromeFor } from "@/lib/routes";

const chrome = chromeFor("/resources");
export const metadata: Metadata = { title: chrome.title, description: chrome.description };

export default function Resources() {
  return (
    <main>
      <PageHeader
        title="Resources"
        lead="The checklists we actually run."
        intro="Nothing gated, nothing theoretical — these are the working documents our delivery teams use, published as-is."
      />

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <ul className="orbit-list">
          {RESOURCES.map((r) => (
            <li key={r.title}>
              <strong>
                {r.title}
                <br />
                <span className="label small orange">{r.kind}</span>
              </strong>
              <span>{r.summary}</span>
            </li>
          ))}
        </ul>

        {/*
         * Placeholder set — Vivacity's site has no resources library to carry
         * over, so these describe real internal documents but have nothing to
         * download yet. Wire each to a PDF or article before promoting the page.
         */}
        <h3 className="wp-block-heading book mobilexl shorten">
          Want one of these applied to your account rather than read in the abstract?
        </h3>
        <p className="k-center">
          <Link href="/contact" className="squarearrowonleft">
            Ask for an audit
          </Link>
        </p>
      </div>
    </main>
  );
}

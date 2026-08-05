import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/blocks/PageHeader";
import { RESOURCES } from "@/lib/content";
import { pageMetadataFromDb } from "@/lib/page-seo";

/**
 * Editable from the dashboard (Page SEO -> /resources), falling back to the
 * hardcoded copy in lib/routes.ts when no override is set.
 */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadataFromDb("/resources");
}

export default function Resources() {
  return (
    <main>
      <PageHeader
        title="Resources"
        lead="The checklists we actually run."
        intro="Nothing gated, nothing theoretical: these are the working documents our delivery teams use, published as-is."
        eyebrow="Free resources"
        variant="center"
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

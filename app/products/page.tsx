import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "@/components/blocks/PageHeader";
import { PRODUCTS } from "@/lib/content";
import { pageMetadataFromDb } from "@/lib/page-seo";

/**
 * Editable from the dashboard (Page SEO -> /products), falling back to the
 * hardcoded copy in lib/routes.ts when no override is set.
 */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadataFromDb("/products");
}

export default function Products() {
  return (
    <main>
      <PageHeader
        title="Products"
        lead="Two things we're building for ourselves."
        intro="Client work pays the bills; these are the products we're building on the side of it. Both are pre-launch."
        eyebrow="Our products"
        image="/media/2024/05/Services-Web3-Design-and-Development.jpg"
        flip
      />

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <ul className="orbit-list">
          {PRODUCTS.map((p) => (
            <li key={p.name}>
              <strong>
                {p.name} <span className="label small orange">{p.status}</span>
              </strong>
              <span>{p.summary}</span>
            </li>
          ))}
        </ul>

        {/*
         * Vivacity's site lists these as "coming soon" with no further detail,
         * so there is nothing more to carry over. Fill in positioning, pricing
         * and screenshots here when they are ready to announce.
         */}
        <h3 className="wp-block-heading book mobilexl shorten">
          Want to hear when they ship? The newsletter below is the only place we'll announce it.
        </h3>
        <p className="k-center">
          <Link href="/contact" className="squarearrowonleft">
            Register interest
          </Link>
        </p>
      </div>
    </main>
  );
}

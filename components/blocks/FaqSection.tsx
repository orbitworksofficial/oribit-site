import { faqSchema, faqSchemaOverride, pageFaqs } from "@/lib/page-seo";
import type { FaqItem } from "@/lib/models";

/**
 * A page's FAQ block, plus the FAQPage JSON-LD that describes it.
 *
 * The markup and the schema are emitted together, from one list, on purpose.
 * Google only credits FAQ structured data whose answers are visible on the page
 * and will issue a manual action for markup that is not — so the schema is
 * generated from whatever this component just rendered rather than authored
 * separately. That is also why the FAQ editor in the dashboard is a set of
 * question/answer rows and not a second JSON paste box.
 *
 * Database first, hardcoded second, matching lib/page-seo.ts: the dashboard's
 * rows for this route win, and `fallback` ships whenever there are none or
 * Atlas is unreachable. An async server component, so the read streams in
 * without blocking the rest of the page.
 *
 * Native <details> rather than a JS accordion: it is expandable without
 * hydration, keyboard-accessible for free, and crawlers read the answer text
 * whether or not the row is open.
 */
export default async function FaqSection({
  path,
  fallback,
  heading = "Questions we get asked",
  lead,
}: {
  /** Route to read dashboard FAQs for, e.g. "/services". */
  path: string;
  fallback: FaqItem[];
  heading?: string;
  lead?: string;
}) {
  const faqs = (await pageFaqs(path)) ?? fallback;
  if (!faqs.length) return null;

  /**
   * A hand-written graph from the dashboard REPLACES the generated one — the
   * page must never declare its FAQs twice, which is what emitting both would
   * do. Falls back to the block built from the questions rendered below.
   */
  const override = await faqSchemaOverride(path);
  const json = override ?? JSON.stringify(faqSchema(faqs));

  return (
    <div
      className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-faqs"
      data-transition="slideup"
      data-transition-include="through"
    >
      <h2 className="wp-block-heading deco-l mobile">FAQs</h2>
      <h3 className="wp-block-heading book mobilexl shorten">{heading}</h3>
      {lead && <p className="has-text-align-center small wp-block-paragraph">{lead}</p>}

      <div className="orbit-faq-list">
        {faqs.map((f) => (
          <details key={f.question} className="orbit-faq">
            <summary>
              <span>{f.question}</span>
            </summary>
            <div className="orbit-faq__body">
              <p>{f.answer}</p>
            </div>
          </details>
        ))}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
    </div>
  );
}

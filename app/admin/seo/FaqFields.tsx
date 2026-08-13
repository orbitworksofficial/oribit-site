"use client";

import { useState } from "react";

import type { FaqItem } from "@/lib/models";

/**
 * Repeatable question/answer rows for a page's FAQ block.
 *
 * Deliberately structured rather than a JSON-LD paste box. The same list is
 * rendered on the page and serialised into FAQPage markup, and Google only
 * credits FAQ schema whose answers are visible to the visitor — authoring them
 * once here is what keeps the two from drifting apart. The schemaMarkup field
 * further down the form is still there for any other type of graph.
 *
 * Rows are keyed by a counter rather than by array index so that removing the
 * middle row does not make React re-use the removed row's DOM node for its
 * neighbour, which would leave the deleted text on screen.
 */

type Row = FaqItem & { key: number };

const blank = (key: number): Row => ({ key, question: "", answer: "" });

export default function FaqFields({
  faqs,
  faqSchema,
  errors,
}: {
  faqs: FaqItem[];
  faqSchema: string;
  errors?: Record<string, string>;
}) {
  const [rows, setRows] = useState<Row[]>(
    faqs.length ? faqs.map((f, i) => ({ ...f, key: i })) : [blank(0)],
  );
  const [nextKey, setNextKey] = useState(rows.length);

  const add = () => {
    setRows((r) => [...r, blank(nextKey)]);
    setNextKey((k) => k + 1);
  };

  const remove = (key: number) =>
    setRows((r) => {
      const kept = r.filter((row) => row.key !== key);
      // Never leave the list empty — an editor with no rows has no obvious way
      // back to a usable form.
      return kept.length ? kept : [blank(nextKey)];
    });

  const update = (key: number, field: keyof FaqItem, value: string) =>
    setRows((r) => r.map((row) => (row.key === key ? { ...row, [field]: value } : row)));

  return (
    <details className="adm-details" open={faqs.length > 0}>
      <summary>FAQs and FAQ schema</summary>
      <div className="adm-details__body">
        <p className="adm-card__hint">
          Shown on the page as an expandable list, and published as FAQPage structured data so
          the answers can appear directly in search results. Leave empty to use the page&rsquo;s
          built-in FAQs. Blank rows are discarded on save.
        </p>

        {errors?.faqs && <div className="adm-error">{errors.faqs}</div>}

        {rows.map((row, i) => (
          <div key={row.key} className="adm-faq">
            <div className="adm-faq__head">
              <span className="adm-faq__no">FAQ {i + 1}</span>
              <button
                type="button"
                className="adm-btn adm-btn--ghost adm-btn--sm"
                onClick={() => remove(row.key)}
              >
                Remove
              </button>
            </div>

            <label className="adm-field">
              <span>Question</span>
              <input
                className="adm-input"
                name="faqQuestion"
                value={row.question}
                onChange={(e) => update(row.key, "question", e.target.value)}
                placeholder="How much does digital marketing cost?"
              />
            </label>

            <label className="adm-field">
              <span>Answer</span>
              <textarea
                className="adm-textarea"
                name="faqAnswer"
                value={row.answer}
                onChange={(e) => update(row.key, "answer", e.target.value)}
                placeholder="Two or three sentences. Plain text — no HTML."
              />
            </label>

            {errors?.[`faqs.${i}`] && <div className="adm-error">{errors[`faqs.${i}`]}</div>}
          </div>
        ))}

        <button type="button" className="adm-btn adm-btn--ghost" onClick={add}>
          Add FAQ
        </button>

        <label className="adm-field" style={{ marginTop: 22 }}>
          <span>FAQ schema (JSON-LD) — optional</span>
          <textarea
            className="adm-textarea adm-textarea--code"
            name="faqSchema"
            defaultValue={faqSchema}
            placeholder={'{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[…]}'}
            style={{ minHeight: 150 }}
          />
          <span className="adm-hint">
            Leave blank and the FAQPage markup is generated from the questions above — that is
            the safer default, because it can never disagree with what the page shows. Fill this
            in only to publish a hand-written graph instead; it <strong>replaces</strong> the
            generated one rather than adding to it, so the page never declares its FAQs twice.
            Separate from the Schema markup field below, which is for everything else.
          </span>
          {errors?.faqSchema && <div className="adm-error">{errors.faqSchema}</div>}
        </label>
      </div>
    </details>
  );
}

"use client";

import { useState } from "react";

export type SeoValues = {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterCard: string;
  schemaMarkup: string;
};

function Counter({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span
      className="adm-hint"
      style={{ color: over ? "var(--accent)" : undefined, float: "right" }}
    >
      {value.length}/{max}
    </span>
  );
}

/**
 * The full SEO block, shared by the page-SEO editor and available to any other
 * screen that needs it.
 *
 * Every field here is both stored AND rendered. In Vivacity these columns
 * existed but no form wrote them and the layout ignored most of them, so the
 * values were unreachable in both directions.
 */
export default function SeoFields({
  values,
  errors,
}: {
  values: SeoValues;
  errors?: Record<string, string>;
}) {
  const [title, setTitle] = useState(values.seoTitle);
  const [desc, setDesc] = useState(values.seoDescription);
  const err = (f: string) => errors?.[f];

  return (
    <>
      <div className="adm-card">
        <h2 className="adm-card__title">Search engine listing</h2>
        <p className="adm-card__hint">
          How this page appears in results. Counters mark the point Google starts truncating.
        </p>

        <label className="adm-field">
          <span>
            Title <Counter value={title} max={60} />
          </span>
          <input
            className="adm-input"
            name="seoTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {err("seoTitle") && <div className="adm-error">{err("seoTitle")}</div>}
        </label>

        <label className="adm-field">
          <span>
            Meta description <Counter value={desc} max={160} />
          </span>
          <textarea
            className="adm-textarea"
            name="seoDescription"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          {err("seoDescription") && <div className="adm-error">{err("seoDescription")}</div>}
        </label>

        <div className="adm-row">
          <label className="adm-field">
            <span>Keywords</span>
            <input className="adm-input" name="seoKeywords" defaultValue={values.seoKeywords} />
          </label>

          <label className="adm-field">
            <span>Canonical URL</span>
            <input
              className="adm-input"
              name="canonicalUrl"
              defaultValue={values.canonicalUrl}
              placeholder="Defaults to the page's own URL"
            />
            {err("canonicalUrl") && <div className="adm-error">{err("canonicalUrl")}</div>}
          </label>

          <label className="adm-field">
            <span>Robots</span>
            <select
              className="adm-select"
              name="robots"
              defaultValue={values.robots || "index, follow"}
            >
              <option value="index, follow">index, follow</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </label>
        </div>
      </div>

      <details className="adm-details">
        <summary>Social sharing</summary>
        <div className="adm-details__body">
          <p className="adm-card__hint">
            Blank fields fall back to the title and description above.
          </p>

          <div className="adm-row">
            <label className="adm-field">
              <span>OG title</span>
              <input className="adm-input" name="ogTitle" defaultValue={values.ogTitle} />
            </label>
            <label className="adm-field">
              <span>OG type</span>
              <input
                className="adm-input"
                name="ogType"
                defaultValue={values.ogType || "website"}
              />
            </label>
          </div>

          <label className="adm-field">
            <span>OG description</span>
            <textarea
              className="adm-textarea"
              name="ogDescription"
              defaultValue={values.ogDescription}
            />
          </label>

          <label className="adm-field">
            <span>OG image</span>
            <input
              className="adm-input"
              name="ogImage"
              defaultValue={values.ogImage}
              placeholder="/brand/example.png or a full URL"
            />
          </label>

          <div className="adm-row">
            <label className="adm-field">
              <span>Twitter title</span>
              <input
                className="adm-input"
                name="twitterTitle"
                defaultValue={values.twitterTitle}
              />
            </label>
            <label className="adm-field">
              <span>Twitter card</span>
              <select
                className="adm-select"
                name="twitterCard"
                defaultValue={values.twitterCard || "summary"}
              >
                <option value="summary">summary (square)</option>
                <option value="summary_large_image">summary_large_image (wide)</option>
              </select>
            </label>
          </div>

          <label className="adm-field">
            <span>Twitter description</span>
            <textarea
              className="adm-textarea"
              name="twitterDescription"
              defaultValue={values.twitterDescription}
            />
          </label>

          <label className="adm-field">
            <span>Twitter image</span>
            <input className="adm-input" name="twitterImage" defaultValue={values.twitterImage} />
          </label>
        </div>
      </details>

      <details className="adm-details">
        <summary>Structured data (JSON-LD)</summary>
        <div className="adm-details__body">
          <label className="adm-field">
            <span>Schema markup</span>
            <textarea
              className="adm-textarea adm-textarea--code"
              name="schemaMarkup"
              defaultValue={values.schemaMarkup}
              placeholder='{"@context":"https://schema.org","@type":"FAQPage", ...}'
              style={{ minHeight: 180 }}
            />
            <span className="adm-hint">
              Added to this page in addition to the site-wide Organization graph. Paste the
              block as-is — a wrapping &lt;script&gt; tag and paragraph breaks inside the text
              are handled for you.
            </span>
            {err("schemaMarkup") && <div className="adm-error">{err("schemaMarkup")}</div>}
          </label>
        </div>
      </details>
    </>
  );
}

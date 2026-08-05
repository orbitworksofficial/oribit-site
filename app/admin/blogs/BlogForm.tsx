"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { ActionState } from "../actions";
import RichText from "./RichText";
import ImageField from "./ImageField";

export type BlogFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  status: string;
  publishedAt: string;
  categoryId: string;
  tagIds: string[];
  isFeatured: boolean;
  allowComments: boolean;
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

type Option = { id: string; name: string };

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

/** Character counter against the length search engines actually render. */
function Counter({ value, max }: { value: string; max: number }) {
  const n = value.length;
  const over = n > max;
  return (
    <span
      className="adm-hint"
      style={{ color: over ? "var(--adm-accent)" : undefined, float: "right" }}
    >
      {n}/{max}
    </span>
  );
}

export default function BlogForm({
  action,
  values,
  categories,
  tags,
  submitLabel,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  values: BlogFormValues;
  categories: Option[];
  tags: Option[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});

  const [title, setTitle] = useState(values.title);
  const [slug, setSlug] = useState(values.slug);
  const [seoTitle, setSeoTitle] = useState(values.seoTitle);
  const [seoDescription, setSeoDescription] = useState(values.seoDescription);
  const [slugTouched, setSlugTouched] = useState(Boolean(values.slug));

  /** Mirror the title into the slug until the author edits it themselves. */
  const onTitle = (v: string) => {
    setTitle(v);
    if (!slugTouched) {
      setSlug(
        v
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      );
    }
  };

  const err = (f: string) => state.errors?.[f];

  return (
    <form action={formAction}>
      {values.id && <input type="hidden" name="id" value={values.id} />}

      {state.error && <div className="adm-banner adm-banner--error">{state.error}</div>}
      {state.errors && (
        <div className="adm-banner adm-banner--error">
          Some fields need attention — see the messages below.
        </div>
      )}

      <div className="adm-card">
        <label className="adm-field">
          <span>Title</span>
          <input
            className="adm-input"
            name="title"
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            required
          />
          {err("title") && <div className="adm-error">{err("title")}</div>}
        </label>

        <label className="adm-field">
          <span>Slug</span>
          <input
            className="adm-input"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="derived-from-the-title"
          />
          <span className="adm-hint">The URL: /blogs/{slug || "…"}</span>
          {err("slug") && <div className="adm-error">{err("slug")}</div>}
        </label>

        <label className="adm-field">
          <span>Excerpt</span>
          <textarea
            className="adm-textarea"
            name="excerpt"
            defaultValue={values.excerpt}
            required
          />
          <span className="adm-hint">
            Shown on the blog index and used as the meta description when the SEO one is blank.
          </span>
          {err("excerpt") && <div className="adm-error">{err("excerpt")}</div>}
        </label>

        {/*
          Not a <label>: the editor is a contenteditable region, and wrapping it
          in a label makes every click inside the body re-focus the first node
          and collapse the selection.
        */}
        <div className="adm-field">
          <span>Content</span>
          <RichText name="content" defaultValue={values.content} />
          <span className="adm-hint">
            Select text to format it. Headings start at H2 — the post title is already the
            page&rsquo;s H1.
          </span>
          {err("content") && <div className="adm-error">{err("content")}</div>}
        </div>
      </div>

      <div className="adm-card">
        <h2 className="adm-card__title">Publishing</h2>
        <p className="adm-card__hint">
          A published post with no date is stamped with the moment you save it.
        </p>

        <div className="adm-row">
          <label className="adm-field">
            <span>Status</span>
            <select className="adm-select" name="status" defaultValue={values.status}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="adm-field">
            <span>Publish date</span>
            <input
              className="adm-input"
              type="datetime-local"
              name="publishedAt"
              defaultValue={values.publishedAt}
            />
            <span className="adm-hint">A future date holds the post back until then.</span>
          </label>

          <label className="adm-field">
            <span>Category</span>
            <select className="adm-select" name="categoryId" defaultValue={values.categoryId}>
              <option value="">Uncategorised</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {tags.length > 0 && (
          <div className="adm-field">
            <span className="adm-label">Tags</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem" }}>
              {tags.map((t) => (
                <label key={t.id} className="adm-check" style={{ marginBottom: 0 }}>
                  <input
                    type="checkbox"
                    name="tagIds"
                    value={t.id}
                    defaultChecked={values.tagIds.includes(t.id)}
                  />
                  <span>{t.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <label className="adm-check">
          <input type="checkbox" name="isFeatured" defaultChecked={values.isFeatured} />
          <span>Featured post</span>
        </label>
        <label className="adm-check">
          <input type="checkbox" name="allowComments" defaultChecked={values.allowComments} />
          <span>Allow comments</span>
        </label>
      </div>

      <div className="adm-card">
        <h2 className="adm-card__title">Featured image</h2>
        <p className="adm-card__hint">
          Shown on the blog index and used as the share card when no social image is set.
        </p>
        <ImageField
          name="featuredImage"
          defaultValue={values.featuredImage}
          altName="featuredImageAlt"
          altDefault={values.featuredImageAlt}
        />
      </div>

      {/* Everything below exists in the database AND renders in <head> — this is
        * the part Vivacity stored but never exposed or output. */}
      <details className="adm-details" open>
        <summary>Search engine listing</summary>
        <div className="adm-details__body">
          <label className="adm-field">
            <span>
              SEO title <Counter value={seoTitle} max={60} />
            </span>
            <input
              className="adm-input"
              name="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={title || "Falls back to the post title"}
            />
            {err("seoTitle") && <div className="adm-error">{err("seoTitle")}</div>}
          </label>

          <label className="adm-field">
            <span>
              Meta description <Counter value={seoDescription} max={160} />
            </span>
            <textarea
              className="adm-textarea"
              name="seoDescription"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Falls back to the excerpt"
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
                placeholder="Defaults to this post's URL"
              />
              {err("canonicalUrl") && <div className="adm-error">{err("canonicalUrl")}</div>}
            </label>
            <label className="adm-field">
              <span>Robots</span>
              <select className="adm-select" name="robots" defaultValue={values.robots || "index, follow"}>
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </label>
          </div>
        </div>
      </details>

      <details className="adm-details">
        <summary>Social sharing</summary>
        <div className="adm-details__body">
          <p className="adm-card__hint">
            Blank fields fall back to the SEO title, the excerpt and the featured image.
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
                defaultValue={values.ogType || "article"}
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
            <input className="adm-input" name="ogImage" defaultValue={values.ogImage} />
          </label>

          <div className="adm-row">
            <label className="adm-field">
              <span>Twitter title</span>
              <input className="adm-input" name="twitterTitle" defaultValue={values.twitterTitle} />
            </label>
            <label className="adm-field">
              <span>Twitter card</span>
              <select
                className="adm-select"
                name="twitterCard"
                defaultValue={values.twitterCard || "summary_large_image"}
              >
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
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
              style={{ minHeight: "16rem" }}
            />
            <span className="adm-hint">
              Rendered as an extra ld+json block on the post, in addition to the Article schema
              generated automatically. Must be valid JSON.
            </span>
            {err("schemaMarkup") && <div className="adm-error">{err("schemaMarkup")}</div>}
          </label>
        </div>
      </details>

      <div className="adm-actions">
        <Submit label={submitLabel} />
        <Link href="/admin/blogs" className="adm-btn adm-btn--ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}

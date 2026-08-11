"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

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

/**
 * Pending state comes from the parent's useTransition rather than
 * useFormStatus, which only reports on a form driven by React's own action
 * handling — the mechanism this form no longer uses.
 */
function Submit({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button type="submit" className="adm-btn" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

/**
 * Required-field marker.
 *
 * aria-hidden with a visually-hidden word beside it: a screen reader announcing
 * "asterisk" tells the user nothing, and the `required` attribute alone is not
 * visible to a sighted user scanning the form for what they must fill in.
 */
function Req() {
  return (
    <>
      <span className="adm-req" aria-hidden="true">
        *
      </span>
      <span className="adm-sr">(required)</span>
    </>
  );
}

/** Human label for a field key, for the error dialog. */
const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  slug: "Slug",
  excerpt: "Excerpt",
  content: "Content",
  featuredImage: "Featured image",
  featuredImageAlt: "Featured image alt text",
  status: "Status",
  publishedAt: "Publish date",
  categoryId: "Category",
  seoTitle: "SEO title",
  seoDescription: "SEO description",
  seoKeywords: "Keywords",
  canonicalUrl: "Canonical URL",
  robots: "Robots",
  ogTitle: "Open Graph title",
  ogDescription: "Open Graph description",
  ogImage: "Open Graph image",
  ogType: "Open Graph type",
  twitterTitle: "Twitter title",
  twitterDescription: "Twitter description",
  twitterImage: "Twitter image",
  twitterCard: "Twitter card",
  schemaMarkup: "Schema markup",
};

/**
 * Error dialog.
 *
 * The inline messages remain the source of truth, but on a form this long the
 * failing field is often scrolled far out of view — the author saw a red banner
 * and no indication of which of thirty fields was wrong. This names each one and
 * jumps to it.
 *
 * A real <dialog> so Escape, the backdrop and focus trapping come from the
 * platform rather than being reimplemented.
 */
function ErrorDialog({
  errors,
  onClose,
}: {
  errors: Record<string, string>;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const entries = Object.entries(errors);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!el.open) el.showModal();
    // `close` fires for Escape and the form-method close alike.
    const done = () => onClose();
    el.addEventListener("close", done);
    return () => el.removeEventListener("close", done);
  }, [onClose]);

  /** Focus the offending field and bring it into view. */
  const goTo = (field: string) => {
    ref.current?.close();
    const el = document.querySelector<HTMLElement>(
      `[name="${field}"], [data-field="${field}"]`,
    );
    if (!el) return;
    // The rich text body is a contenteditable div, not a named input.
    const target =
      field === "content" ? document.querySelector<HTMLElement>(".adm-rt__area") : el;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    // Wait for the scroll before focusing, or the browser jumps twice.
    window.setTimeout(() => target?.focus(), 320);
  };

  return (
    <dialog ref={ref} className="adm-dialog" onClick={(e) => {
      // Clicking the backdrop (the dialog element itself, not its panel) closes.
      if (e.target === ref.current) ref.current?.close();
    }}>
      <div className="adm-dialog__panel">
        <div className="adm-dialog__head">
          <span className="adm-dialog__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            </svg>
          </span>
          <div>
            <h2>{entries.length === 1 ? "One field needs attention" : `${entries.length} fields need attention`}</h2>
            <p>The post was not saved. Fix the following, then save again.</p>
          </div>
        </div>

        <ul className="adm-dialog__list">
          {entries.map(([field, message]) => (
            <li key={field}>
              <button type="button" onClick={() => goTo(field)}>
                <strong>{FIELD_LABELS[field] ?? field}</strong>
                <span>{message}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="adm-dialog__foot">
          <button type="button" className="adm-btn" onClick={() => ref.current?.close()}>
            Got it
          </button>
        </div>
      </div>
    </dialog>
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
  /**
   * Submitted through useTransition rather than useActionState.
   *
   * With useActionState, a validation error left the form permanently unable to
   * submit again: the DOM stayed intact (all 33 inputs present, `content`
   * holding the right value, the button enabled) but React's action handler
   * stopped responding — even a direct form.requestSubmit() fired no request.
   * The only recovery was reloading, which is why the same post "worked in
   * another browser": a fresh tab is a fresh mount.
   *
   * Building the FormData in an explicit onSubmit gives us the same progressive
   * behaviour with a lifecycle we control, and the transition cannot get stuck
   * because each submit starts a new one.
   */
  const [state, setState] = useState<ActionState>({});
  const [pending, startTransition] = useTransition();
  /** Errors currently shown in the dialog; null when it is closed. */
  const [dialogErrors, setDialogErrors] = useState<Record<string, string> | null>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const fd = new FormData(event.currentTarget);
    startTransition(async () => {
      // A successful save redirects inside the action, so nothing returns here.
      const result = await action(state, fd);
      if (result) {
        setState(result);
        // Surface the failure immediately: on a form this long the offending
        // field is usually scrolled out of sight.
        if (result.errors && Object.keys(result.errors).length > 0) {
          setDialogErrors(result.errors);
        } else if (result.error) {
          setDialogErrors({ _: result.error });
        }
      }
    });
  };


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
    <form onSubmit={onSubmit}>
      {values.id && <input type="hidden" name="id" value={values.id} />}

      {/* The dialog is the loud signal; the banner below stays as the quiet
          record of it once the dialog is dismissed. */}
      {dialogErrors && (
        <ErrorDialog errors={dialogErrors} onClose={() => setDialogErrors(null)} />
      )}

      {state.error && <div className="adm-banner adm-banner--error">{state.error}</div>}
      {state.errors && (
        <div className="adm-banner adm-banner--error">
          Some fields need attention — see the messages below.
        </div>
      )}

      <div className="adm-card">
        <label className="adm-field">
          <span>Title <Req /></span>
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
          <span>Excerpt <Req /></span>
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
          <span>Content <Req /></span>
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
              generated automatically. Paste the block as-is — a wrapping &lt;script&gt; tag and
              paragraph breaks inside the text are handled for you.
            </span>
            {err("schemaMarkup") && <div className="adm-error">{err("schemaMarkup")}</div>}
          </label>
        </div>
      </details>

      <div className="adm-actions">
        <Submit label={submitLabel} pending={pending} />
        <Link href="/admin/blogs" className="adm-btn adm-btn--ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}

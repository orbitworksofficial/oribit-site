"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { FaqItem } from "@/lib/models";
import { savePageSeoAction, type ActionState } from "../actions";
import FaqFields from "./FaqFields";
import SeoFields, { type SeoValues } from "./SeoFields";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn" disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export default function PageSeoForm({
  values,
  faqs,
  faqSchema,
  pageKey,
  pageName,
  isNew,
}: {
  values: SeoValues;
  faqs: FaqItem[];
  faqSchema: string;
  pageKey: string;
  pageName: string;
  isNew: boolean;
}) {
  const [state, action] = useActionState<ActionState, FormData>(savePageSeoAction, {});
  const err = (f: string) => state.errors?.[f];

  return (
    <form action={action}>
      {state.error && <div className="adm-banner adm-banner--error">{state.error}</div>}
      {state.ok && <div className="adm-banner adm-banner--ok">Saved.</div>}

      <div className="adm-card">
        <h2 className="adm-card__title">Page</h2>
        <p className="adm-card__hint">
          The path must match a real route on the site, starting with a slash.
        </p>
        <div className="adm-row">
          <label className="adm-field">
            <span>Name</span>
            <input
              className="adm-input"
              name="pageName"
              defaultValue={pageName}
              placeholder="Services"
              required
            />
            {err("pageName") && <div className="adm-error">{err("pageName")}</div>}
          </label>

          <label className="adm-field">
            <span>Path</span>
            <input
              className="adm-input"
              name="pageKey"
              defaultValue={pageKey}
              placeholder="/services"
              readOnly={!isNew}
              required
            />
            <span className="adm-hint">
              {isNew ? "For example /services or /about." : "The path cannot be changed."}
            </span>
            {err("pageKey") && <div className="adm-error">{err("pageKey")}</div>}
          </label>
        </div>
      </div>

      <SeoFields values={values} errors={state.errors} />

      <FaqFields faqs={faqs} faqSchema={faqSchema} errors={state.errors} />

      <div className="adm-actions">
        <Submit />
        <Link href="/admin/seo" className="adm-btn adm-btn--ghost">
          Back
        </Link>
      </div>
    </form>
  );
}

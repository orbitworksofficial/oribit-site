"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { ActionState } from "../actions";

export type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

/**
 * Shared list + editor for categories and tags.
 *
 * Both are a name, a slug and a usage count, so one component serves both
 * rather than two near-identical pages. `withDescription` is the only
 * difference — tags do not have one.
 */
export default function TaxonomyManager({
  items,
  saveAction,
  deleteAction,
  noun,
  withDescription = false,
}: {
  items: TaxonomyItem[];
  saveAction: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  deleteAction: (fd: FormData) => Promise<void>;
  noun: string;
  withDescription?: boolean;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveAction, {});
  const [editing, setEditing] = useState<TaxonomyItem | null>(null);

  // Remount the form when the target changes so defaultValue is re-read.
  const formKey = editing?.id ?? "new";
  const err = (f: string) => state.errors?.[f];

  return (
    <div style={{ display: "grid", gap: 18, gridTemplateColumns: "minmax(0, 1fr) 320px" }}>
      <div className="adm-card">
        {items.length === 0 ? (
          <div className="adm-empty">No {noun}s yet. Create one on the right.</div>
        ) : (
          <div className="adm-tablewrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Posts</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <button
                        type="button"
                        onClick={() => setEditing(t)}
                        style={{
                          background: "none",
                          border: 0,
                          color: "inherit",
                          cursor: "pointer",
                          font: "inherit",
                          fontWeight: 550,
                          padding: 0,
                          textAlign: "left",
                        }}
                      >
                        {t.name}
                      </button>
                      {t.description && <div className="adm-sub">{t.description}</div>}
                    </td>
                    <td style={{ color: "var(--muted)" }}>{t.slug}</td>
                    <td>{t.count}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        className="adm-btn adm-btn--link"
                        onClick={() => setEditing(t)}
                      >
                        Edit
                      </button>
                      <form action={deleteAction} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={t.id} />
                        <button type="submit" className="adm-btn adm-btn--link">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <div className="adm-card">
          <h2 className="adm-card__title">
            {editing ? `Edit ${noun}` : `New ${noun}`}
          </h2>
          <p className="adm-card__hint">
            {editing
              ? "Changing the slug changes any URL that uses it."
              : "The slug is derived from the name when left blank."}
          </p>

          {state.ok && !editing && (
            <div className="adm-banner adm-banner--ok">Saved.</div>
          )}
          {state.error && <div className="adm-banner adm-banner--error">{state.error}</div>}

          <form action={formAction} key={formKey}>
            {editing && <input type="hidden" name="id" value={editing.id} />}

            <label className="adm-field">
              <span>Name</span>
              <input
                className="adm-input"
                name="name"
                defaultValue={editing?.name ?? ""}
                required
              />
              {err("name") && <div className="adm-error">{err("name")}</div>}
            </label>

            <label className="adm-field">
              <span>Slug</span>
              <input
                className="adm-input"
                name="slug"
                defaultValue={editing?.slug ?? ""}
                placeholder="auto"
              />
              {err("slug") && <div className="adm-error">{err("slug")}</div>}
            </label>

            {withDescription && (
              <label className="adm-field">
                <span>Description</span>
                <textarea
                  className="adm-textarea"
                  name="description"
                  defaultValue={editing?.description ?? ""}
                />
              </label>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <Submit label={editing ? "Save changes" : `Add ${noun}`} />
              {editing && (
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

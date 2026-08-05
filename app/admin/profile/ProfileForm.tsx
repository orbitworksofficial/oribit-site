"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateProfileAction, type ActionState } from "../actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export default function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action] = useActionState<ActionState, FormData>(updateProfileAction, {});
  const err = (f: string) => state.errors?.[f];

  return (
    <form action={action}>
      {state.error && <div className="adm-banner adm-banner--error">{state.error}</div>}
      {state.ok && <div className="adm-banner adm-banner--ok">Your account has been updated.</div>}

      <div className="adm-card">
        <h2 className="adm-card__title">Details</h2>
        <p className="adm-card__hint">Your name appears as the author on posts you write.</p>

        <div className="adm-row">
          <label className="adm-field">
            <span>Full name</span>
            <input className="adm-input" name="name" defaultValue={name} required />
            {err("name") && <div className="adm-error">{err("name")}</div>}
          </label>

          <label className="adm-field">
            <span>Email</span>
            <input
              className="adm-input"
              type="email"
              name="email"
              defaultValue={email}
              required
            />
            <span className="adm-hint">This is also your sign-in name.</span>
            {err("email") && <div className="adm-error">{err("email")}</div>}
          </label>
        </div>
      </div>

      <div className="adm-card">
        <h2 className="adm-card__title">Change password</h2>
        <p className="adm-card__hint">
          Leave blank to keep your current password. Your current password is required to set a
          new one.
        </p>

        <div className="adm-row">
          <label className="adm-field">
            <span>Current password</span>
            <input
              className="adm-input"
              type="password"
              name="currentPassword"
              autoComplete="current-password"
            />
            {err("currentPassword") && (
              <div className="adm-error">{err("currentPassword")}</div>
            )}
          </label>

          <label className="adm-field">
            <span>New password</span>
            <input
              className="adm-input"
              type="password"
              name="newPassword"
              autoComplete="new-password"
            />
            <span className="adm-hint">At least 10 characters.</span>
            {err("newPassword") && <div className="adm-error">{err("newPassword")}</div>}
          </label>
        </div>
      </div>

      <div className="adm-actions">
        <Submit />
      </div>
    </form>
  );
}

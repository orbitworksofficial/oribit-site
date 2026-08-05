"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { saveUserAction, type ActionState } from "../actions";

export type UserFormValues = {
  id?: string;
  name: string;
  email: string;
  role: string;
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export default function UserForm({
  values,
  submitLabel,
  isEdit,
  lockRole,
}: {
  values: UserFormValues;
  submitLabel: string;
  isEdit: boolean;
  /** True when this is the only admin — demoting them locks everyone out. */
  lockRole?: boolean;
}) {
  const [state, action] = useActionState<ActionState, FormData>(saveUserAction, {});
  const err = (f: string) => state.errors?.[f];

  return (
    <form action={action}>
      {values.id && <input type="hidden" name="id" value={values.id} />}
      {state.error && <div className="adm-banner adm-banner--error">{state.error}</div>}

      <div className="adm-card">
        <div className="adm-row">
          <label className="adm-field">
            <span>Full name</span>
            <input className="adm-input" name="name" defaultValue={values.name} required />
            {err("name") && <div className="adm-error">{err("name")}</div>}
          </label>

          <label className="adm-field">
            <span>Email</span>
            <input
              className="adm-input"
              type="email"
              name="email"
              defaultValue={values.email}
              autoComplete="off"
              required
            />
            <span className="adm-hint">Used to sign in.</span>
            {err("email") && <div className="adm-error">{err("email")}</div>}
          </label>
        </div>

        <label className="adm-field">
          <span>Role</span>
          <select
            className="adm-select"
            name="role"
            defaultValue={values.role}
            disabled={lockRole}
          >
            <option value="author">Author — content only</option>
            <option value="admin">Admin — full access including users</option>
          </select>
          {lockRole && (
            <span className="adm-hint">
              This is the only admin. Promote another user before changing this role.
            </span>
          )}
          {/* A disabled select submits nothing; keep the value in the payload. */}
          {lockRole && <input type="hidden" name="role" value={values.role} />}
        </label>
      </div>

      <div className="adm-card">
        <h2 className="adm-card__title">Password</h2>
        <p className="adm-card__hint">
          {isEdit
            ? "Leave blank to keep the current password."
            : "At least 10 characters. Share it with the user over something other than email."}
        </p>
        <label className="adm-field">
          <span>{isEdit ? "New password" : "Password"}</span>
          <input
            className="adm-input"
            type="password"
            name="password"
            autoComplete="new-password"
            required={!isEdit}
          />
          {err("password") && <div className="adm-error">{err("password")}</div>}
        </label>
      </div>

      <div className="adm-actions">
        <Submit label={submitLabel} />
        <Link href="/admin/users" className="adm-btn adm-btn--ghost">
          Cancel
        </Link>
      </div>
    </form>
  );
}

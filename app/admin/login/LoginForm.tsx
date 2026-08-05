"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction, type ActionState } from "../actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="adm-btn" disabled={pending} style={{ width: "100%" }}>
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginForm() {
  const [state, action] = useActionState<ActionState, FormData>(loginAction, {});

  return (
    <form action={action}>
      {state.error && <div className="adm-banner adm-banner--error">{state.error}</div>}

      <label className="adm-field">
        <span>Email</span>
        <input
          className="adm-input"
          type="email"
          name="email"
          autoComplete="username"
          required
        />
        {state.errors?.email && <div className="adm-error">{state.errors.email}</div>}
      </label>

      <label className="adm-field">
        <span>Password</span>
        <input
          className="adm-input"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        {state.errors?.password && <div className="adm-error">{state.errors.password}</div>}
      </label>

      <Submit />
    </form>
  );
}

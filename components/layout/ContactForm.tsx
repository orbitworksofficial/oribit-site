"use client";

import { useState } from "react";

/**
 * Enquiry form.
 *
 * Deliberately does NOT reuse the theme's .hs-form/.salesflare-form classes:
 * those are scoped to `footer form` (a dark panel with a single email input), so
 * on a light page they contribute nothing and the fields fall back to browser
 * defaults. This owns its own markup and styling — see .orbit-form in orbit.css.
 *
 * Posts to /api/contact, which is NOT wired to a mailbox yet.
 */

type Status = "idle" | "submitting" | "error" | "success";

export default function ContactForm({ services }: { services: string[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage("Thank you — we’ll be in touch shortly.");
        form.reset();
      } else {
        setStatus("error");
        setMessage("Something didn’t go through. Please check your details and try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  }

  const busy = status === "submitting";

  return (
    <div className={`orbit-form is-${status}`}>
      <form onSubmit={onSubmit} noValidate={false}>
        <div className="orbit-field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" type="text" name="name" required autoComplete="name" placeholder="Jane Doe" />
        </div>

        <div className="orbit-field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="jane@company.com"
          />
        </div>

        <div className="orbit-field">
          <label htmlFor="cf-company">Company</label>
          <input
            id="cf-company"
            type="text"
            name="company"
            autoComplete="organization"
            placeholder="Optional"
          />
        </div>

        <div className="orbit-field">
          <label htmlFor="cf-service">What do you need?</label>
          <select id="cf-service" name="service" defaultValue="">
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="orbit-field orbit-field--full">
          <label htmlFor="cf-message">What isn’t moving?</label>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            required
            placeholder="A sentence about the problem is plenty."
          />
        </div>

        <div className="orbit-field orbit-field--full orbit-form__foot">
          <button type="submit" className="orbit-submit" disabled={busy}>
            {busy ? "Sending…" : "Send"}
          </button>

          {/* aria-live so the outcome is announced, not just coloured. */}
          <p className="orbit-form__msg" role="status" aria-live="polite">
            {message}
          </p>
        </div>
      </form>
    </div>
  );
}

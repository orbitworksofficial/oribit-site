"use client";

import { useState } from "react";

/**
 * Port of modules/hubspot-forms (the Salesflare signup).
 *
 * The original POSTed to the WordPress REST route
 * /wp-json/kenza/v1/salesflare/submit with an X-WP-Nonce. That route dies with
 * WordPress, so this targets /api/newsletter — see app/api/newsletter/route.ts,
 * which still needs the real Salesflare credentials wired in.
 *
 * State is expressed as classes on the form (submitting/error/success) because
 * theme.css styles the messages off them.
 */

const ERROR_MSG = "To shape the future, we need a solid foundation. Please recheck your details.";
const SUCCESS_MSG = "Thank you. We’ll be in touch soon.";

type Status = "idle" | "submitting" | "error" | "success";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(SUCCESS_MSG);
        form.reset();
      } else {
        setStatus("error");
        setMessage(ERROR_MSG);
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  }

  const formClass = [
    "salesflare-email-form",
    status === "submitting" ? "submitting" : "",
    status === "error" ? "error" : "",
    status === "success" ? "success" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="hs-form salesflare-form">
      <h4>Sign up for latest news &amp; insights</h4>

      <form className={formClass} onSubmit={onSubmit} data-salesflare-form>
        <input type="email" name="email" placeholder="Enter your email" required />
        <input type="submit" value="Submit" disabled={status === "submitting"} />
      </form>

      <div className="our-error">
        <span>{status === "error" ? message : ""}</span>
      </div>
      <div className="our-success">
        <span>{status === "success" ? message : ""}</span>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Error boundary for the dashboard.
 *
 * Without this, a database blip rendered Next's default production error page:
 * a bare "Application error" with the message stripped, no navigation, and no
 * way forward but the browser's back button. The public site degrades to its
 * static fallbacks when Mongo is unreachable; the admin cannot, because it has
 * nothing to fall back to — so the least it can do is say what happened and
 * offer a retry.
 *
 * The digest is surfaced deliberately: production hides the message, and it is
 * the only handle that ties what the user saw to a line in the server log.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="adm-fail">
      <div className="adm-fail__box">
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        </svg>

        <h1>Something went wrong</h1>
        <p>
          The dashboard could not load this page. This is usually a temporary
          problem reaching the database — trying again often works.
        </p>

        <div className="adm-fail__actions">
          <button type="button" className="adm-btn" onClick={reset}>
            Try again
          </button>
          <Link href="/admin" className="adm-btn adm-btn--ghost">
            Back to dashboard
          </Link>
        </div>

        {error.digest && (
          <p className="adm-fail__digest">
            Reference: <code>{error.digest}</code>
          </p>
        )}
      </div>
    </div>
  );
}

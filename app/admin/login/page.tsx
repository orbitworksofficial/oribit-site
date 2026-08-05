import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in | Orbit Works Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <div className="adm adm-login" style={{ gridTemplateColumns: undefined }}>
      <section className="adm-login__brand">
        {/* The real brand lockup, not a letter tile. The site paints it as a
          * CSS background on `.logo`; here it is a plain <img> so it can size
          * naturally and carry alt text. */}
        <Link href="/" className="adm-login__logo" aria-label="Orbit Works home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/orbitworks-full-light.png"
            alt="Orbit Works"
            width={1259}
            height={248}
          />
        </Link>

        <div className="adm-login__pitch">
          <h2>
            Content &amp; SEO <em>control room</em>
          </h2>
          <p>
            Write and publish posts, and set every search and social tag they ship with — from
            one place, without touching a deploy.
          </p>
          <ul className="adm-login__list">
            <li>Draft, schedule and publish blog posts</li>
            <li>Titles, descriptions, canonicals and robots per page</li>
            <li>Open Graph, Twitter cards and JSON-LD</li>
            <li>Categories, tags and team access</li>
          </ul>
        </div>

        <div className="adm-login__meta">
          Authorised users only · <Link href="/">Back to the site</Link>
        </div>
      </section>

      <section className="adm-login__panel">
        <div className="adm-login__form">
          <h1>Sign in</h1>
          <p>Use the credentials issued to you.</p>

          {!isDbConfigured() && (
            <div className="adm-banner adm-banner--error">
              <strong>No database configured.</strong> Set <code>MONGODB_URI</code> in{" "}
              <code>.env.local</code>, then run <code>node scripts/seed-db.mjs</code> to create
              the first admin user.
            </div>
          )}

          <LoginForm />
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";

import PageHeader from "@/components/blocks/PageHeader";
import { BRAND, OFFICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Legal — OrbitWorks",
  description: "Privacy, cookies and company details for OrbitWorks.",
  robots: { index: false, follow: true },
};

/**
 * Exists because the cookie banner and footer both link here — a consent banner
 * pointing at a 404 is worse than no banner.
 *
 * PLACEHOLDER: this is scaffolding, not legal copy. It must be replaced with a
 * reviewed privacy policy and the registered company details before launch,
 * particularly given the Berlin office (GDPR) and the cookie consent flow.
 */
export default function Legal() {
  return (
    <main>
      <PageHeader
        title="Legal"
        lead="Privacy, cookies and company details."
        intro="Placeholder — this page needs reviewed policy copy before launch."
      />

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h3 className="wp-block-heading book">Cookies</h3>
        <p className="wp-block-paragraph">
          We use cookies to give you the best browsing experience. Your choice is stored locally in
          your browser and can be cleared at any time.
        </p>

        <h3 className="wp-block-heading book">Privacy</h3>
        <p className="wp-block-paragraph">
          Details submitted through our contact and newsletter forms are used only to reply to you.
          To request a copy or deletion of your data, email{" "}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
        </p>

        <h3 className="wp-block-heading book">Company</h3>
        <p className="wp-block-paragraph">
          {BRAND.name}
          <br />
          {OFFICES[0].address}, {OFFICES[0].city}
          <br />
          {BRAND.phone}
        </p>
      </div>
    </main>
  );
}

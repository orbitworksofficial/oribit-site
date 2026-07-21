import type { Metadata } from "next";

import PageHeader from "@/components/blocks/PageHeader";
import { BRAND, OFFICES } from "@/lib/content";
import { SERVICE_TITLES } from "@/lib/services-data";
import { chromeFor } from "@/lib/routes";
import ContactForm from "@/components/layout/ContactForm";

const chrome = chromeFor("/contact");
export const metadata: Metadata = { title: chrome.title, description: chrome.description };

export default function Contact() {
  return (
    <main>
      <PageHeader
        title="Contact"
        lead="Tell us what isn't moving."
        intro="Four offices, one inbox. A short note about the problem beats a long one about the brief."
      />

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <ul className="orbit-list">
          <li>
            <strong>Email</strong>
            <span>
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </span>
          </li>
          <li>
            <strong>Phone</strong>
            <span>
              <a href={`tel:${BRAND.phone.replace(/[^+\d]/g, "")}`}>{BRAND.phone}</a>
            </span>
          </li>
        </ul>
      </div>

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
      >
        <ContactForm services={SERVICE_TITLES} />
      </div>

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading deco-l mobile">Offices</h2>
        <ul className="orbit-list">
          {OFFICES.map((o) => (
            <li key={o.country}>
              <strong>
                {o.city}, {o.country}
              </strong>
              <span>{o.address}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

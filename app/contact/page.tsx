import type { Metadata } from "next";

import PageHero from "@/components/blocks/PageHero";
import { BRAND, OFFICES } from "@/lib/content";
import { SERVICE_TITLES } from "@/lib/services-data";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/layout/ContactForm";

export const metadata: Metadata = pageMetadata("/contact");

export default function Contact() {
  return (
    <main>
      <PageHero
        chip="Baltimore & Toronto · one inbox"
        icon="contact"
        title="Tell us what isn't moving"
        lead="A short note about the problem beats a long one about the brief. Send it over and the person who reads it is the person who can help."
        ctas={[
          { label: "Book a Discovery Call", href: "#contact-form" },
          { label: "Email the team", href: "mailto:sales@orb-itworks.com", ghost: true },
        ]}
        proof={["Reply within 1 business day", "No sales script", "Free 15-min discovery"]}
        image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=70"
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
        <span id="contact-form" />
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

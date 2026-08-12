import { BRAND, OFFICES, SERVICES_JSONLD_AREA, SOCIAL } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { SERVICE_BUCKETS } from "@/lib/services-data";

/**
 * Schema.org JSON-LD graph.
 *
 * The SEO audit flagged two separate failures that this one block answers:
 *   "Schema.org Structured Data — none detected"
 *   "Identity Schema — no Organization or Person schema identified"
 *
 * Emitted as a single @graph so the Organization, WebSite and Service nodes can
 * cross-reference by @id rather than repeating themselves. Rendered from the
 * real content constants, so it cannot drift from what the page actually says.
 */
export default function StructuredData() {
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: BRAND.name,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/orbitworks-full-dark.png`,
      },
      description: BRAND.footerAbout,
      email: BRAND.email,
      telephone: BRAND.phone,
      address: OFFICES.map((o) => ({
        "@type": "PostalAddress",
        streetAddress: o.street,
        addressLocality: o.city,
        addressRegion: o.region,
        postalCode: o.postalCode,
        addressCountry: o.countryCode,
      })),
      areaServed: SERVICES_JSONLD_AREA,
      knowsAbout: SERVICE_BUCKETS.map((b) => b.name),
      /**
       * The official profiles for this brand. sameAs is what lets Google
       * connect the accounts to the Organization rather than treating them as
       * unrelated pages, which is what feeds the knowledge panel. Read from the
       * same SOCIAL constant the footer renders, so the markup cannot claim a
       * profile the site does not actually link to.
       */
      ...(SOCIAL.length > 0 ? { sameAs: SOCIAL.map((s) => s.href) } : {}),
    },
    {
      "@type": "WebSite",
      "@id": siteId,
      url: SITE_URL,
      name: BRAND.name,
      publisher: { "@id": orgId },
      inLanguage: "en-US",
    },
    {
      /**
       * ProfessionalService is a LocalBusiness subtype, but an SEO audit still
       * reported "no Local Business Schema identified" because this node
       * carried none of the properties that make one: the address and phone
       * lived only on the Organization above. Validators match on the shape,
       * not the type name alone, so the NAP is repeated here deliberately.
       */
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: BRAND.name,
      url: SITE_URL,
      parentOrganization: { "@id": orgId },
      description: BRAND.intro,
      areaServed: SERVICES_JSONLD_AREA,
      image: `${SITE_URL}/brand/orbitworks-full-dark.png`,
      email: BRAND.email,
      telephone: BRAND.phone,
      address: OFFICES.map((o) => ({
        "@type": "PostalAddress",
        streetAddress: o.street,
        addressLocality: o.city,
        addressRegion: o.region,
        postalCode: o.postalCode,
        addressCountry: o.countryCode,
      })),
      /** Google wants a hint, not a rate card. */
      priceRange: "$$",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: SERVICE_BUCKETS.map((b) => ({
          "@type": "OfferCatalog",
          name: b.name,
          itemListElement: b.services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.tagline },
          })),
        })),
      },
    },
  ];

  return (
    <script
      type="application/ld+json"
      // Content is ours and contains no user input; JSON.stringify escapes it.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}

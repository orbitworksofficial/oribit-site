import { BRAND, OFFICES, SERVICES_JSONLD_AREA } from "@/lib/content";
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
        addressLocality: o.city,
        addressCountry: o.country,
        streetAddress: o.address,
      })),
      areaServed: SERVICES_JSONLD_AREA,
      knowsAbout: SERVICE_BUCKETS.map((b) => b.name),
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
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#service`,
      name: BRAND.name,
      url: SITE_URL,
      parentOrganization: { "@id": orgId },
      description: BRAND.intro,
      areaServed: SERVICES_JSONLD_AREA,
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

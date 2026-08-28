import type { Metadata } from "next";
import LegalDoc from "@/components/blocks/LegalDoc";
import { metadataFromDb } from "@/lib/page-seo";
import { ogImageFor } from "@/lib/seo";
import { TERMS } from "@/lib/legal-data";
import { SITE_URL } from "@/lib/site";

/**
 * Editable from the dashboard (Page SEO -> /terms); the object below is the
 * fallback used when no override is stored.
 */
export async function generateMetadata(): Promise<Metadata> {
  return metadataFromDb("/terms", {
    title: "Terms & Conditions | OrbitWorks",
    description: TERMS.subtitle,
    alternates: { canonical: `${SITE_URL}/terms` },
    robots: { index: false, follow: true },
    openGraph: { images: [ogImageFor("/terms").image] },
    twitter: { card: "summary_large_image", images: [ogImageFor("/terms").image.url] },
  });
}

export default function TermsPage() {
  return <LegalDoc doc={TERMS} />;
}

import type { Metadata } from "next";
import LegalDoc from "@/components/blocks/LegalDoc";
import { metadataFromDb } from "@/lib/page-seo";
import { PRIVACY } from "@/lib/legal-data";
import { SITE_URL } from "@/lib/site";

/**
 * Editable from the dashboard (Page SEO -> /privacy); the object below is the
 * fallback used when no override is stored.
 */
export async function generateMetadata(): Promise<Metadata> {
  return metadataFromDb("/privacy", {
    title: "Privacy Policy | OrbitWorks",
    description: PRIVACY.subtitle,
    alternates: { canonical: `${SITE_URL}/privacy` },
    robots: { index: false, follow: true },
  });
}

export default function PrivacyPage() {
  return <LegalDoc doc={PRIVACY} />;
}

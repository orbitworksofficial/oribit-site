import type { Metadata } from "next";
import LegalDoc from "@/components/blocks/LegalDoc";
import { metadataFromDb } from "@/lib/page-seo";
import { REFUND } from "@/lib/legal-data";
import { SITE_URL } from "@/lib/site";

/**
 * Editable from the dashboard (Page SEO -> /refund-policy); the object below is
 * the fallback used when no override is stored.
 */
export async function generateMetadata(): Promise<Metadata> {
  return metadataFromDb("/refund-policy", {
    title: "Cancellation & Refund Policy | OrbitWorks",
    description: REFUND.subtitle,
    alternates: { canonical: `${SITE_URL}/refund-policy` },
    robots: { index: false, follow: true },
  });
}

export default function RefundPage() {
  return <LegalDoc doc={REFUND} />;
}

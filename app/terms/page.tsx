import type { Metadata } from "next";
import LegalDoc from "@/components/blocks/LegalDoc";
import { TERMS } from "@/lib/legal-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions — OrbitWorks",
  description: TERMS.subtitle,
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return <LegalDoc doc={TERMS} />;
}

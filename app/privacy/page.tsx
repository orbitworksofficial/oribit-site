import type { Metadata } from "next";
import LegalDoc from "@/components/blocks/LegalDoc";
import { PRIVACY } from "@/lib/legal-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | OrbitWorks",
  description: PRIVACY.subtitle,
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <LegalDoc doc={PRIVACY} />;
}

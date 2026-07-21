import type { Metadata } from "next";
import LegalDoc from "@/components/blocks/LegalDoc";
import { PRIVACY } from "@/lib/legal-data";

export const metadata: Metadata = {
  title: "Privacy Policy — OrbitWorks",
  description: PRIVACY.subtitle,
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <LegalDoc doc={PRIVACY} />;
}

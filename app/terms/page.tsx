import type { Metadata } from "next";
import LegalDoc from "@/components/blocks/LegalDoc";
import { TERMS } from "@/lib/legal-data";

export const metadata: Metadata = {
  title: "Terms & Conditions — OrbitWorks",
  description: TERMS.subtitle,
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return <LegalDoc doc={TERMS} />;
}

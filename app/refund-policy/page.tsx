import type { Metadata } from "next";
import LegalDoc from "@/components/blocks/LegalDoc";
import { REFUND } from "@/lib/legal-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | OrbitWorks",
  description: REFUND.subtitle,
  alternates: { canonical: `${SITE_URL}/refund-policy` },
  robots: { index: false, follow: true },
};

export default function RefundPage() {
  return <LegalDoc doc={REFUND} />;
}

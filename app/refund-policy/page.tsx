import type { Metadata } from "next";
import LegalDoc from "@/components/blocks/LegalDoc";
import { REFUND } from "@/lib/legal-data";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy — OrbitWorks",
  description: REFUND.subtitle,
  robots: { index: false, follow: true },
};

export default function RefundPage() {
  return <LegalDoc doc={REFUND} />;
}

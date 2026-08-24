import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { metadataFromDb } from "@/lib/page-seo";
import { SITE_URL } from "@/lib/site";
import { LenisProvider } from "@/components/aeo/LenisProvider";
import "../../aeo.css";

/**
 * Route layout for the AEO/GEO landing page.
 *
 * The page itself is a Client Component (framer-motion, useState), which cannot
 * export metadata — so the SEO lives here, alongside the two fonts the design
 * needs and the smooth-scroll provider.
 *
 * Inter and JetBrains Mono are loaded through next/font and published as
 * scoped CSS variables rather than being set globally: the rest of the site
 * runs on Outfit, and this page must not change that.
 */
const inter = Inter({ subsets: ["latin"], variable: "--font-aeo-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-aeo-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  /**
   * metadataFromDb, not pageMetadataFromDb: the latter starts from
   * lib/routes.ts, which has no entry for this route and hands back the
   * FALLBACK "Not found" title. Passing our own base keeps the dashboard
   * override behaviour without inheriting the 404 defaults.
   */
  return metadataFromDb("/products/aeo-geo", {
    title: "AEO and GEO Services | Get Cited Inside AI Answers | Orbit Works",
    description:
      "Orbit Works helps businesses appear as direct answers and cited sources inside ChatGPT, Gemini, Perplexity and Google AI Overviews. Free audit, no long-term contracts.",
    alternates: { canonical: `${SITE_URL}/products/aeo-geo` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/products/aeo-geo`,
      siteName: "Orbit Works",
      title: "AEO and GEO Services | Get Cited Inside AI Answers",
      description:
        "Get your brand cited inside ChatGPT, Gemini and Perplexity. Free AEO + GEO audit from Orbit Works.",
    },
  });
}

export default function AeoGeoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${mono.variable}`}>
      <LenisProvider>{children}</LenisProvider>
    </div>
  );
}

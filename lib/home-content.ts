import type { CaseCard } from "@/components/blocks/CaseSlider";
import { CASE_STUDIES } from "./content";

/**
 * Homepage case slider cards, derived from the case studies so the two never
 * drift apart.
 *
 * NOTE ON IMAGERY: these still point at the Kenza photo library in /public/media
 * — they are placeholders standing in for OrbitWorks project shots. Swap `image`
 * in lib/content.ts CASE_STUDIES as real work photography lands.
 */
export const HOME_CASE_CARDS: CaseCard[] = CASE_STUDIES.map((c, i) => ({
  href: `/case-studies#${c.slug}`,
  title: c.client,
  src: c.image,
  id: String(700 + i),
}));

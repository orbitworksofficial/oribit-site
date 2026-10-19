import type { FaqItem } from "./models";

/**
 * Homepage FAQs.
 *
 * Shipped as the fallback for FaqSection on "/" — the dashboard (Page SEO ->
 * / -> FAQs) overrides these, same database-first rule as every other route.
 *
 * Written to answer what a visitor actually types into an AI assistant
 * ("what does X do", "how much", "how long"), because those phrasings are what
 * gets matched and cited. Answers lead with the direct response rather than
 * building up to it, for the same reason.
 *
 * Every figure here already appears elsewhere on this site — the case-study
 * results in lib/content.ts and the service catalogue in lib/services-data.ts.
 * Nothing is estimated or invented: these answers are quotable by an AI engine
 * verbatim, so an unverifiable number would become a claim the company is
 * publicly making. Questions that would need a figure we do not have (headcount,
 * founding year, fixed pricing) are deliberately absent rather than hedged.
 */
export const HOME_FAQS: FaqItem[] = [
  {
    question: "What does Orbit Works do?",
    answer:
      "Orbit Works is an AI automation and IT services company serving businesses in the United States and Canada. Our work spans four areas: AI automation and intelligent systems, digital marketing growth, IT and cloud infrastructure, and staff augmentation. Clients come to us to replace manual processes with automation, migrate and modernise infrastructure, grow qualified traffic, or add engineering capacity without hiring. We work with clients across 10+ countries and handle strategy through to implementation, so one partner covers the whole stack rather than coordinating several vendors.",
  },
  {
    question: "What results have Orbit Works clients seen?",
    answer:
      "Published client outcomes include infrastructure costs reduced by 40% year-over-year following a cloud migration, clinical decision-making speed improved by 60% after an AI workflow deployment, and user engagement increased 3X in the first quarter after a product rebuild. Results vary by engagement scope and starting position — these are specific project outcomes rather than averages across all clients.",
  },
  {
    question: "How much do Orbit Works services cost?",
    answer:
      "Pricing depends on scope, timeline, and which services an engagement covers, so we quote per project rather than publishing fixed rates. Engagements start with a free 30-minute discovery call where we scope the work and give you a written proposal with costs before anything is committed. There is no obligation and no charge for that call.",
  },
  {
    question: "How do I get started with Orbit Works?",
    answer:
      "Start with a free 30-minute discovery call, booked through the contact form or directly via Calendly. On that call we review what you are trying to achieve, what is currently blocking it, and which services apply. You then receive a written proposal covering scope, timeline, and cost. Nothing is charged until that proposal is agreed.",
  },
  {
    question: "Does Orbit Works work with businesses outside the United States?",
    answer:
      "Yes. Orbit Works has offices in Gambrills, Maryland in the United States and Beechville, Nova Scotia in Canada, and works with clients across 10+ countries. Engagements run remotely, so location is not a constraint — delivery is coordinated across time zones as standard.",
  },
  {
    question: "What industries does Orbit Works serve?",
    answer:
      "Orbit Works works across manufacturing, healthcare, fintech, SaaS, and logistics. Published case studies span cloud infrastructure for enterprise, AI-assisted analytics in healthcare, and consumer product development. Each sector has its own compliance and integration constraints, so engagements start by mapping those before any build begins.",
  },
];

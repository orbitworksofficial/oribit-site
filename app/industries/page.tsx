import type { Metadata } from "next";
import Link from "next/link";

import PageHero from "@/components/blocks/PageHero";
import Testimonials from "@/components/blocks/Testimonials";
import { INDUSTRIES, INDUSTRY_SPOTLIGHTS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/industries");

/** "Why generic IT fails" proof points. */
const WHY_GENERIC_FAILS = [
  {
    title: "Domain-Deep Teams",
    body: "We assign engineers and strategists who have worked in your specific industry before. They know the acronyms, the pain points, and the shortcuts.",
  },
  {
    title: "Compliance-First Design",
    body: "HIPAA, SOC2, GDPR, PCI-DSS: we bake security and regulatory compliance into every solution from day one, not as an afterthought.",
  },
  {
    title: "Operational Relevance",
    body: "We build what you actually need. Not what looks good on a portfolio. If it doesn't reduce downtime, increase throughput, or boost revenue, we don't build it.",
  },
];

const ADVANTAGE = [
  {
    title: "We Invest in Your Context",
    body: "We don't parachute in with a generic solution. We spend time understanding your workflows, your compliance obligations, and your customer expectations before we write a single line of code.",
  },
  {
    title: "We Bridge the Gap Between IT and Operations",
    body: "Our teams don't just talk to your CTO. They talk to your operations managers, your marketing directors, and your frontline staff. Because the best IT Solutions USA are the ones that actually improve daily work.",
  },
  {
    title: "We Bring Cross-Industry Insight",
    body: "Working across 14+ industries gives us a unique perspective. We bring best practices from healthcare into manufacturing, and from fintech into logistics. That cross-pollination is where breakthrough innovations happen.",
  },
  {
    title: "We're Built for the Long Haul",
    body: "We don't build solutions that break when your business grows. Our IT Solutions USA are engineered to scale, adapt, and evolve alongside your industry's changing landscape.",
  },
];

export default function Industries() {
  return (
    <main>
      <PageHero
        chip="14+ verticals, one delivery team"
        icon="industries"
        title="Tailored IT solutions US businesses trust across every industry"
        lead="OrbitWorks delivers specialized IT Solutions USA companies rely on to solve industry-specific challenges, without the generic playbooks."
        ctas={[
          { label: "Book a Discovery Call", href: "/contact" },
          { label: "View Our Industry Expertise", href: "#spotlights", ghost: true },
        ]}
        proof={["Domain-deep teams", "Compliance-first design", "Built to scale"]}
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=70"
      />

      {/* One size fits none */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-sec"
        data-transition="slideup"
      >
        <div className="orbit-sec__head">
          <span className="orbit-eyebrow">One size fits none</span>
          <h2 className="orbit-section-head">Why Generic IT Fails, And How We Fix It</h2>
        </div>
        <div className="orbit-sec__body">
        <p className="large large-intro wp-block-paragraph">
          Most IT services companies treat every client the same. They apply the same templates, the
          same stacks, and the same strategies to a hospital that they use for a logistics firm. That
          approach doesn&rsquo;t just waste money. It creates more problems than it solves.
        </p>
        <p className="small tabletbodyxs wp-block-paragraph">
          OrbitWorks takes a different path. Our IT Solutions USA framework is built around
          vertical-specific intelligence. We don&rsquo;t just ask about your tech stack. We ask about
          your regulatory environment, your supply chain, your customer journey, and your competitive
          pressures. Then we design solutions that fit your world, not ours.
        </p>
        <ul className="orbit-list orbit-list--check">
          {WHY_GENERIC_FAILS.map((w) => (
            <li key={w.title}>
              <strong>{w.title}</strong>
              <span>{w.body}</span>
            </li>
          ))}
        </ul>
        </div>
      </div>

      {/* Industry spotlights */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        id="spotlights"
      >
        <span className="orbit-eyebrow">Industry spotlights</span>
        <h2 className="orbit-section-head">
          Industry-Specific IT Solutions USA Companies Are Already Using
        </h2>
        {/* `shorten-70` capped this at 70% while the spotlight grid below runs
          * the full width, which left a dead band down the right-hand side.
          * A ch-based measure keeps the line length readable without leaving a
          * column of nothing beside it. */}
        <p className="has-text-align-left large large-intro wp-block-paragraph orbit-lead-wide">
          Here&rsquo;s how we apply our core capabilities (AI, cloud, marketing, and talent) to real
          industries with real challenges. These aren&rsquo;t hypotheticals. This is what our IT
          Solutions USA expertise looks like in action.
        </p>

        <ul className="orbit-spotlights">
          {INDUSTRY_SPOTLIGHTS.map((s, i) => (
            <li key={s.name} className="orbit-spotlight">
              <span className="orbit-spotlight__no">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="orbit-spotlight__name">{s.name}</h3>
              <p className="orbit-spotlight__body">{s.body}</p>
              <ul className="orbit-spotlight__points">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Full list */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-sec"
        data-transition="slideup"
      >
        <div className="orbit-sec__head">
          <span className="orbit-eyebrow">Industries we empower</span>
          <h2 className="orbit-section-head">A Proven Track Record Across Diverse Verticals</h2>
        </div>
        <div className="orbit-sec__body">
        <p className="large large-intro wp-block-paragraph">
          We&rsquo;ve delivered our IT Solutions USA approach to clients across these industries. No
          matter your niche, we bring the technical firepower and business acumen to move the needle.
        </p>
        <ul className="orbit-list">
          {INDUSTRIES.map((i) => (
            <li key={i.name}>
              <strong>{i.name}</strong>
              <span>{i.note}</span>
            </li>
          ))}
        </ul>
        </div>
      </div>

      {/* Advantage */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-sec"
        data-transition="slideup"
      >
        <div className="orbit-sec__head">
          <span className="orbit-eyebrow">Why OrbitWorks for your industry</span>
          <h2 className="orbit-section-head">
            The IT Solutions USA Advantage: Tailored to Your Vertical
          </h2>
        </div>
        <div className="orbit-sec__body">
        <p className="large large-intro wp-block-paragraph">
          We&rsquo;re proud to be a trusted provider of IT Solutions USA for businesses across the
          spectrum. But what makes us the right fit for your specific industry?
        </p>
        <ul className="orbit-list orbit-list--check">
          {ADVANTAGE.map((a) => (
            <li key={a.title}>
              <strong>{a.title}</strong>
              <span>{a.body}</span>
            </li>
          ))}
        </ul>
        </div>
      </div>

      <Testimonials limit={3} />

      {/* CTA */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-cta-strip"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading book">
          Ready to See How Our IT Solutions USA Expertise Applies to You?
        </h2>
        <p className="has-text-align-center small wp-block-paragraph">
          Stop settling for one-size-fits-all technology. Let&rsquo;s have a conversation about your
          industry, your challenges, and exactly how OrbitWorks can help you turn them into
          opportunities. No pitch. No pressure. Just a genuine discovery session.
        </p>
        <p className="orbit-cta-row orbit-cta-row--center">
          <Link href="/contact" className="orbit-btn">
            Book a Discovery Call
          </Link>
          <Link href="/contact" className="orbit-btn orbit-btn--ghost">
            Contact Our Industry Experts
          </Link>
        </p>
      </div>
    </main>
  );
}

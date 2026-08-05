import type { Metadata } from "next";
import Link from "next/link";

import PageHero from "@/components/blocks/PageHero";
import Stats from "@/components/blocks/Stats";
import TeamGrid from "@/components/blocks/TeamGrid";
import { OFFICES } from "@/lib/content";
import { pageMetadataFromDb } from "@/lib/page-seo";

/**
 * Editable from the dashboard (Page SEO -> /about), falling back to the
 * hardcoded copy in lib/routes.ts when no override is set.
 */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadataFromDb("/about");
}

/** Philosophy / values, rendered as ticked lists. */
const PHILOSOPHY = [
  {
    title: "We solve real problems",
    body: "Not invented ones. If a project doesn't address a genuine business pain point, we won't push it.",
  },
  {
    title: "We generate measurable ROI",
    body: "Every recommendation passes the “will this pay for itself?” test. If it doesn't, we go back to the drawing board.",
  },
  {
    title: "We make complex tech simple",
    body: "Your team shouldn't need a PhD to use what we build. Intuitive, clean, and practical. That's our standard.",
  },
];

const VALUES = [
  {
    title: "Reliability Over Rhetoric",
    body: "We hit deadlines. We stay on budget. We fix things when they break. It sounds basic, but you'd be surprised how rare it is.",
  },
  {
    title: "Human-First AI",
    body: "We don't automate for the sake of automation. We implement AI where it actually saves your people time and makes their work more meaningful.",
  },
  {
    title: "Obsession with ROI",
    body: "If a project doesn't clearly pay for itself within a reasonable window, we won't recommend it. We act like business partners, not vendors.",
  },
  {
    title: "Radical Transparency",
    body: "No hidden fees. No jargon-filled smoke screens. You'll always know exactly what's happening, why, and what it costs.",
  },
];

export default function About() {
  return (
    <main>
      <PageHero
        chip="Engineers, operators & strategists"
        icon="about"
        title="We don't just build tech. We build momentum."
        lead="OrbitWorks is an AI automation and IT services company in USA built for one reason: to make technology a growth engine, not a management headache."
        ctas={[
          { label: "Book a Discovery Call", href: "/contact" },
          { label: "Explore Our Services", href: "/services", ghost: true },
        ]}
        proof={["No fluff, no hype", "Measurable ROI", "Radical transparency"]}
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=70"
      />

      <Stats />

      {/* Philosophy */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-sec"
        data-transition="slideup"
      >
        <div className="orbit-sec__head">
          <span className="orbit-eyebrow">Our philosophy</span>
          <h2 className="orbit-section-head">Simplicity Over Hype</h2>
        </div>
        <div className="orbit-sec__body">
        <p className="large large-intro wp-block-paragraph">
          We&rsquo;ve seen too many IT consulting companies overpromise and underdeliver. They throw
          around buzzwords like &ldquo;digital transformation&rdquo; but can&rsquo;t tell you how
          they&rsquo;ll actually improve your bottom line. We keep it simple.
        </p>
        <ul className="orbit-list orbit-list--check">
          {PHILOSOPHY.map((p) => (
            <li key={p.title}>
              <strong>{p.title}</strong>
              <span>{p.body}</span>
            </li>
          ))}
        </ul>
        </div>
      </div>

      {/* Story */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-sec"
        data-transition="slideup"
      >
        <div className="orbit-sec__head">
          <span className="orbit-eyebrow">Our story</span>
          <h2 className="orbit-section-head">Built by Engineers. Run by Operators.</h2>
        </div>
        <div className="orbit-sec__body">
        <p className="large large-intro wp-block-paragraph">
          OrbitWorks wasn&rsquo;t founded in a boardroom. It was founded in the trenches of real
          delivery.
        </p>
        <p className="small tabletbodyxs wp-block-paragraph">
          Our leadership team comes from software engineering, cloud architecture, and performance
          marketing. We&rsquo;ve led global teams, managed million-dollar cloud infrastructures, and
          built SaaS platforms from zero to acquisition.
        </p>
        <p className="small tabletbodyxs wp-block-paragraph">
          We realized the market was flooded with &ldquo;best IT services companies&rdquo; that were
          great at sales but terrible at execution. So we started OrbitWorks to bridge that gap.
          Today, we operate with a global delivery model, but our heart and strategic direction are
          rooted firmly in the USA. We serve clients who demand quality, transparency, and
          accountability, and we deliver exactly that.
        </p>
        </div>
      </div>

      {/* Values */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-sec"
        data-transition="slideup"
      >
        <div className="orbit-sec__head">
          <span className="orbit-eyebrow">Our values</span>
          <h2 className="orbit-section-head">What Guides Us Every Day</h2>
        </div>
        <div className="orbit-sec__body">
        <p className="large large-intro wp-block-paragraph">
          We don&rsquo;t need a 50-page manifesto. Here&rsquo;s our compass: simple, direct, and
          non-negotiable.
        </p>
        <ul className="orbit-list orbit-list--check">
          {VALUES.map((v) => (
            <li key={v.title}>
              <strong>{v.title}</strong>
              <span>{v.body}</span>
            </li>
          ))}
        </ul>
        </div>
      </div>

      {/* Team */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-sec"
        data-transition="slideup"
      >
        <div className="orbit-sec__head">
          <span className="orbit-eyebrow">The team</span>
          <h2 className="orbit-section-head">The Experts Behind the Screens</h2>
        </div>
        <div className="orbit-sec__body">
        <p className="large large-intro wp-block-paragraph">
          Our people are what make us a leading IT consultancy company.
        </p>
        <p className="small tabletbodyxs wp-block-paragraph">
          We&rsquo;re a tight crew of senior developers, cloud engineers, data analysts, SEO
          strategists, and AI researchers who have worked across manufacturing, healthcare, fintech,
          and SaaS.
        </p>
        <p className="small tabletbodyxs wp-block-paragraph">
          But here&rsquo;s the difference: we don&rsquo;t just hire for technical chops. We hire for
          curiosity and communication. We want engineers who can explain a complex API integration to
          a marketing director in plain English. We want marketers who understand how a slow-loading
          server kills conversion rates. That cross-functional intelligence is what sets us apart
          from other IT solutions and services companies.
        </p>
        </div>
      </div>
      <div className="wp-block-kenza-column-constraint column-constraint cols-12" data-transition="slideup">
        <TeamGrid />
      </div>

      {/* Offices */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <span className="orbit-eyebrow">Where we are</span>
        <h2 className="orbit-section-head">Offices</h2>
        <ul className="orbit-list">
          {OFFICES.map((o) => (
            <li key={o.country}>
              <strong>
                {o.city}, {o.country}
              </strong>
              <span>{o.address}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Partnership CTA */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-cta-strip"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading book">More Than a Vendor. A Partner.</h2>
        <p className="has-text-align-center small wp-block-paragraph">
          If you&rsquo;re looking for a transactional IT service provider, there are plenty of options
          out there. But if you want a dedicated partner that actually cares about your growth and
          has the technical firepower to back it up, you&rsquo;re in the right place.
        </p>
        <p className="has-text-align-center small wp-block-paragraph">
          We&rsquo;re proud to be the go-to IT company for small business USA clients and large
          enterprises alike. From strategy sessions to sprint planning to post-launch optimization,
          we&rsquo;re with you for the long haul. No handoffs. No dropped balls. Just results.
        </p>
        <p className="orbit-cta-row orbit-cta-row--center">
          <Link href="/contact" className="orbit-btn">
            Book a Discovery Call
          </Link>
          <Link href="/contact" className="orbit-btn orbit-btn--ghost">
            Contact Us
          </Link>
        </p>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { metadataFromDb } from "@/lib/page-seo";
import VideoLoopHeader from "@/components/blocks/VideoLoopHeader";
import FrontPageImageCluster from "@/components/blocks/FrontPageImageCluster";
import ClientMarquee from "@/components/blocks/ClientMarquee";
import TechMarquee from "@/components/blocks/TechMarquee";
import CaseSlider from "@/components/blocks/CaseSlider";
import PreviewVideo from "@/components/blocks/PreviewVideo";
import BucketShowcase from "@/components/blocks/BucketShowcase";
import Stats from "@/components/blocks/Stats";
import TestimonialCarousel from "@/components/blocks/TestimonialCarousel";
import { MIRROR_PORTRAIT } from "@/lib/video";
import { BRAND, INDUSTRIES, SECTIONS, WHY, APPROACH, CASE_RESULTS } from "@/lib/content";
import { SERVICES_HOMEPAGE, SERVICE_BUCKETS } from "@/lib/services-data";
import { HOME_CASE_CARDS } from "@/lib/home-content";

/**
 * Editable from the dashboard (Page SEO -> /).
 *
 * The base is empty rather than a copy of the homepage title and description:
 * those live in app/layout.tsx and are inherited, so duplicating them here
 * would create a second place to keep in step. An empty base means every key
 * below is only ever set when the dashboard actually holds a value, and the
 * layout's metadata shows through untouched otherwise.
 */
export async function generateMetadata(): Promise<Metadata> {
  return metadataFromDb("/", {});
}

/**
 * OrbitWorks homepage.
 *
 * Heading order is deliberate and SEO-load-bearing: one H1 in the hero, every
 * section below opens with an H2. Don't demote them for visual reasons — the
 * theme's `deco-l` class sets the size independently of the level.
 *
 * data-transition / data-transition-include are read by TransitionEngine:
 * "through" means the container's children animate individually (theme.css
 * staggers them by nth-child); its absence means the block animates as one unit.
 */
export default function Home() {
  return (
    <main>
      {/* 1. Hero — the only H1 on the page. */}
      <VideoLoopHeader headline={BRAND.headline} selected={null} />

      {/* Tech strip, directly under the hero. */}
      <div className="wp-block-kenza-column-constraint column-constraint cols-12">
        <TechMarquee />
      </div>

      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-intro"
        data-transition="slideup"
      >
        <div className="orbit-intro__lead">
          <p className="large large-intro wp-block-paragraph">{BRAND.intro}</p>
          <p className="orbit-intro__support wp-block-paragraph">{BRAND.supporting}</p>
          <p className="orbit-cta-row">
            <Link href="/contact" className="orbit-btn">
              Book a Discovery Call
            </Link>
            <Link href="/services" className="orbit-btn orbit-btn--ghost">
              Explore Our Services
            </Link>
          </p>
        </div>

        <aside className="orbit-intro__panel">
          <span className="orbit-eyebrow">What we do</span>
          <ul>
            {SERVICE_BUCKETS.map((b, i) => (
              <li key={b.slug}>
                <Link href={`/services#${b.slug}`}>
                  <span className="orbit-intro__no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="orbit-intro__name">{b.name}</span>
                  <span className="orbit-intro__arrow" aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* 2. Trust — heading left, copy right, logo strip full width beneath. */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-sec orbit-sec--flat"
        data-transition="slideup"
      >
        <div className="orbit-sec__head">
          <h2 className="wp-block-heading deco-l mobile">Trusted</h2>
        </div>
        <div className="orbit-sec__body">
          <h3 className="wp-block-heading book mobilexl">{SECTIONS.trustEyebrow}</h3>
          <p className="small tabletbodyxs wp-block-paragraph">{SECTIONS.trustBody}</p>
        </div>
        <div className="orbit-sec__full">
          <ClientMarquee />
        </div>
      </div>

      <Stats />

      <FrontPageImageCluster />

      {/* 3. Everything we do — service buckets (brief Section 07) */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <span className="orbit-eyebrow">{SERVICES_HOMEPAGE.label}</span>
        <h2 className="orbit-section-head">{SERVICES_HOMEPAGE.heading}</h2>
        <p className="has-text-align-left large large-intro shorten shorten-70 wp-block-paragraph">
          {SERVICES_HOMEPAGE.sub}
        </p>
        <BucketShowcase />
        <p className="orbit-cta-row orbit-cta-row--center">
          <Link href="/services" className="orbit-btn">
            {SERVICES_HOMEPAGE.cta}
          </Link>
        </p>
      </div>

      {/* 4. Industries — over the theme's fixed background loop */}
      <div className="wp-block-kenza-column-constraint column-constraint cols-12 background-transparent clip orbit-bgvideo--crimson">
        {/* data-video is a styling hook — see VideoLoopHeader. */}
        <div className="wp-block-kenza-services-page-background-video k-full" data-video="">
          <PreviewVideo sources={MIRROR_PORTRAIT} />
        </div>
        <h2 className="wp-block-heading has-text-align-center extralight">
          {SECTIONS.industriesHeading}
        </h2>
        <p className="has-text-align-center small tabletbodyxs wp-block-paragraph">
          {SECTIONS.industriesIntro}
        </p>
        <p className="has-text-align-center small tabletbodyxs wp-block-paragraph">
          {INDUSTRIES.map((i) => i.name).join(" · ")}
        </p>
        <p className="k-center">
          <Link href="/industries" className="orangerightuparrowonleft">
            See every industry
          </Link>
        </p>
        <div className="background-block" />
      </div>

      {/* 5. Case studies */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading deco-l mobile">{SECTIONS.casesHeading}</h2>
        <h3 className="wp-block-heading book mobilexl shorten">{SECTIONS.casesIntro}</h3>
        <ul className="orbit-results">
          {CASE_RESULTS.map((c) => (
            <li key={c.title}>
              <span className="label">{c.sector}</span>
              <strong>{c.title}</strong>
              <span className="orbit-results__figure">{c.result}</span>
            </li>
          ))}
        </ul>
      </div>

      <CaseSlider cards={HOME_CASE_CARDS} />

      <p className="k-center alt-mobile">
        <Link href="/case-studies" className="squarearrowonleft">
          View Case Studies
        </Link>
      </p>

      {/* 6. Why us */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading deco-l mobile">{SECTIONS.whyHeading}</h2>
        <h3 className="wp-block-heading book mobilexl shorten">{SECTIONS.whyIntro}</h3>
        <ul className="orbit-list orbit-list--check">
          {WHY.map((w) => (
            <li key={w.title}>
              <strong>{w.title}</strong>
              <span>{w.body}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Client reviews as a single-line carousel; inner pages use the grid. */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
      >
        <h2 className="wp-block-heading deco-l mobile">Clients</h2>
        <h3 className="wp-block-heading book mobilexl shorten">
          What the work looked like from the other side.
        </h3>
        <TestimonialCarousel />
      </div>

      {/* 7. Approach */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading deco-l mobile">{SECTIONS.approachHeading}</h2>
        <h3 className="wp-block-heading book mobilexl shorten">{SECTIONS.approachBody}</h3>
        <ol className="orbit-steps">
          {APPROACH.map((a, i) => (
            <li key={a.step}>
              <span className="orbit-steps__no">{String(i + 1).padStart(2, "0")}</span>
              <strong>{a.step}</strong>
              <span className="orbit-steps__body">{a.body}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* 8. Closing CTA */}
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-cta-strip"
        data-transition="slideup"
        data-transition-include="through"
      >
        <h2 className="wp-block-heading book">{SECTIONS.ctaHeading}</h2>
        <p className="has-text-align-center small wp-block-paragraph">{SECTIONS.ctaBody}</p>
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

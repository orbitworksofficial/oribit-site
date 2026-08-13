import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { metadataFromDb } from "@/lib/page-seo";
import { SITE_URL } from "@/lib/site";
import AeoMotion from "./AeoMotion";
import "../../aeo.css";

/**
 * AEO + GEO campaign landing page.
 *
 * Opened in its own tab from the Products dropdown, so app/layout.tsx gives it
 * bare chrome (no site nav or footer) — it ships its own. Everything below is
 * static server-rendered markup; AeoMotion only decorates it, which matters on
 * a page whose entire pitch is being readable to AI crawlers.
 *
 * Editable from the dashboard (Page SEO -> /products/aeo-geo) like every other
 * route, falling back to the metadata declared here.
 */
export async function generateMetadata(): Promise<Metadata> {
  /**
   * metadataFromDb, not pageMetadataFromDb: the latter starts from
   * lib/routes.ts, which has no entry for this route and so hands back the
   * FALLBACK "Not found" title. Passing our own base keeps the dashboard
   * override behaviour without inheriting the 404 defaults.
   */
  return metadataFromDb("/products/aeo-geo", {
    title: "AEO + GEO: Be the Answer in AI Search | Orbit Works",
    description:
      "60% of searches now end without a click. Orbit Works puts your business inside the answers ChatGPT, Perplexity and Google AI give — cited by name, in 60 days.",
    alternates: { canonical: `${SITE_URL}/products/aeo-geo` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/products/aeo-geo`,
      siteName: "Orbit Works",
      title: "AEO + GEO: Be the Answer in AI Search",
      description:
        "Your clients ask ChatGPT and Perplexity who to hire. We put your business inside those answers — cited by name, in 60 days.",
    },
  });
}

const MARQUEE = [
  "CHATGPT",
  "PERPLEXITY",
  "GOOGLE AI OVERVIEWS",
  "GEMINI",
  "COPILOT",
  "CLAUDE",
];

const STEPS = [
  {
    no: "01",
    name: "Audit",
    desc: "We scan your business across all three territories and identify exactly where you are invisible — and where competitors are appearing.",
  },
  {
    no: "02",
    name: "Optimise",
    desc: "Technical fixes and content restructuring that make your business readable, extractable, and trustworthy to AI search engines.",
  },
  {
    no: "03",
    name: "Build authority",
    desc: "Entity consistency, citations, and external signals that tell AI models your business is a credible recommendation in your category.",
  },
  {
    no: "04",
    name: "Monitor",
    desc: "Monthly AI visibility tracking across ChatGPT, Perplexity, and Google AI Overviews. You see exactly how visibility grows over time.",
  },
];

const QUOTES = [
  {
    text: "We had no idea our business wasn't appearing in ChatGPT. After Orbit Works implemented AEO and GEO, enquiries started arriving from clients who said they found us through AI search. That channel didn't exist for us before.",
    initials: "JM",
    name: "James M.",
    role: "Professional Services, Baltimore MD",
    metric: "3.4×",
    metricNote: "increase in inbound enquiries within 60 days",
  },
  {
    text: "Our competitors were appearing in Google AI Overviews and we weren't. Orbit Works fixed it in under a month. We now appear in AI summaries for our top service keywords, and the lead quality is noticeably better.",
    initials: "SR",
    name: "Sarah R.",
    role: "Healthcare Clinic, Austin TX",
    metric: "+67%",
    metricNote: "improvement in AI search visibility score",
  },
  {
    text: "I asked ChatGPT to recommend IT companies in our area and our name came up. That had never happened before. Our AEO score went from 31 to 78 in 90 days.",
    initials: "DK",
    name: "David K.",
    role: "Technology Company, Dallas TX",
    metric: "78/100",
    metricNote: "AEO visibility score — up from 31 in 90 days",
  },
];

const SECTORS = [
  "Healthcare",
  "Professional Services",
  "Technology",
  "Real Estate",
  "E-Commerce",
  "Hospitality",
];

/** Reveal-on-scroll wrapper. Delay is applied by AeoMotion once in view. */
function Rv({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
}: {
  as?: "div" | "h2" | "p" | "span";
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag className={`aeo-rv ${className}`.trim()} data-aeo-delay={delay}>
      {children}
    </Tag>
  );
}

export default function AeoGeoLanding() {
  return (
    <div className="aeo">
      <AeoMotion />
      {/*
        Without JS the reveal elements would never receive data-shown and the
        page would render blank. This makes them visible by default and lets the
        stylesheet's animated state take over only once scripting is confirmed.
      */}
      <noscript>
        <style>{`.aeo-rv{opacity:1;transform:none}`}</style>
      </noscript>

      <header className="aeo-header" data-aeo-header data-stuck="0">
        <a className="aeo-header__brand" href="#aeo-top">
          <Image
            src="/brand/orbitworks-full-light.png"
            alt="Orbit Works"
            width={188}
            height={34}
            priority
          />
        </a>
        {/*
          `social` is the theme's own opt-out: theme.css pins every
          `nav:not(.social)` to position:fixed;top:0 with pointer-events:none and
          hides its <ul>. Without the class this header collapses onto the logo
          and its links stop responding to clicks. Same trap SiteFooter documents.
        */}
        <nav className="social aeo-header__nav">
          <a href="#aeo-shift">The shift</a>
          <a href="#aeo-method">Method</a>
          <a href="#aeo-proof">Results</a>
          <Link href="/contact" className="aeo-btn aeo-btn--sm">
            <span className="aeo-btn__sheen" />
            <span className="aeo-btn__label">Book a Strategy Call</span>
          </Link>
        </nav>
      </header>

      {/* ------------------------------------------------------------ hero */}
      <section id="aeo-top" className="aeo-hero">
        <canvas className="aeo-hero__canvas" data-aeo-canvas aria-hidden="true" />
        <div className="aeo-hero__grid" aria-hidden="true" />
        <div className="aeo-hero__aurora" aria-hidden="true" />

        <div className="aeo-hero__inner">
          <div className="aeo-hero__copy">
            <Rv className="aeo-chip">
              <span className="aeo-chip__dot" />
              AEO + GEO agency — 2026
            </Rv>

            <h1 className="aeo-hero__title">
              <span style={{ display: "block" }}>Be the answer,</span>
              <span className="aeo-hero__rotator" data-aeo-rotate />
              <span className="aeo-caret" aria-hidden="true" />
            </h1>

            <Rv as="p" delay={520} className="aeo-hero__lead">
              Your clients now ask ChatGPT, Perplexity and Google AI who to hire. We put your
              business <em>inside those answers</em> — cited by name, in 60 days.
            </Rv>

            <Rv delay={640} className="aeo-hero__ctas">
              <Link href="/contact" className="aeo-btn">
                <span className="aeo-btn__sheen" />
                <span className="aeo-btn__label">Book a strategy call</span>
              </Link>
              <a href="#aeo-scanner" className="aeo-btn aeo-btn--ghost">
                Scan my business free →
              </a>
            </Rv>

            <Rv delay={760} className="aeo-hero__stats">
              <span className="aeo-hero__stat">
                <b>
                  60<span>%</span>
                </b>
                <span>searches end without a click</span>
              </span>
              <span className="aeo-hero__stat">
                <b>
                  3<span>×</span>
                </b>
                <span>avg. lift in inbound enquiries</span>
              </span>
              <span className="aeo-hero__stat">
                <b>
                  60<span>d</span>
                </b>
                <span>to measurable AI visibility</span>
              </span>
            </Rv>
          </div>

          <Rv delay={380} className="aeo-answer">
            <div className="aeo-answer__halo" aria-hidden="true" />
            <div className="aeo-answer__card">
              <div className="aeo-win">
                <span className="aeo-win__dots" aria-hidden="true">
                  <i style={{ background: "#FF5F57" }} />
                  <i style={{ background: "#FEBC2E" }} />
                  <i style={{ background: "#28C840" }} />
                </span>
                <span className="aeo-win__label">AI answer — live</span>
                <span className="aeo-win__live">
                  <span className="aeo-chip__dot" />
                  cited
                </span>
              </div>

              <div style={{ padding: 18 }}>
                <div className="aeo-prompt">
                  <span
                    data-aeo-type="who should I hire for [your service] near me?"
                    data-aeo-typedelay="700"
                  />
                  <span className="aeo-caret" style={{ background: "#00D4FF" }} aria-hidden="true" />
                </div>

                <div className="aeo-answer__body">
                  Three providers stand out in your area. <span className="aeo-mark">Your Business</span>{" "}
                  is the most consistently recommended, with verified reviews, strong entity signals
                  and citations across multiple sources.
                </div>

                <div className="aeo-tags">
                  <span className="aeo-tag aeo-tag--cyan">yourbusiness.com</span>
                  <span className="aeo-tag">reviews</span>
                  <span className="aeo-tag">local directory</span>
                </div>
              </div>

              <div className="aeo-score">
                <span className="aeo-score__ring" data-aeo-ring>
                  <i>
                    <span data-aeo-count="82">0</span>
                  </i>
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <b style={{ fontSize: 12.5, fontWeight: 600 }}>AI visibility score</b>
                  <span style={{ fontSize: 11, color: "var(--aeo-muted)" }}>
                    after 60 days with Orbit Works — up from 24
                  </span>
                </span>
              </div>
            </div>
          </Rv>
        </div>

        <a href="#aeo-evidence" className="aeo-scroll">
          <span>Scroll</span>
          <i aria-hidden="true" />
        </a>
      </section>

      {/* --------------------------------------------------------- marquee */}
      <div className="aeo-marquee" aria-hidden="true">
        <div className="aeo-marquee__track">
          {[0, 1].map((copy) => (
            <div className="aeo-marquee__row" key={copy}>
              {MARQUEE.map((name, i) => (
                <span key={name} style={{ display: "contents" }}>
                  <b>{name}</b>
                  <i style={{ background: i % 2 ? "#00D4FF" : "#F3124E" }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------- evidence */}
      <section id="aeo-evidence" className="aeo-section aeo-section--panel">
        <div className="aeo-shell">
          <Rv className="aeo-eyebrow">Where your next client is searching right now</Rv>
          <Rv as="h2" delay={90} className="aeo-h2">
            AI is already recommending businesses.
            <br />
            Is yours one of them?
          </Rv>
          <Rv as="p" delay={170} className="aeo-sub">
            Right now, potential clients are asking AI tools who to hire in your category. Here is
            what they see.
          </Rv>

          <div className="aeo-grid">
            <Rv delay={80} className="aeo-card">
              <span className="aeo-card__blob" aria-hidden="true" />
              <div className="aeo-card__head">
                <span className="aeo-win__dots" aria-hidden="true">
                  <i style={{ background: "#FF5F57" }} />
                  <i style={{ background: "#FEBC2E" }} />
                  <i style={{ background: "#28C840" }} />
                </span>
                <b>ChatGPT</b>
              </div>
              <div className="aeo-card__query">Best digital agency in [your city]?</div>
              <div className="aeo-card__body">
                Here are some highly recommended agencies in the area:
                <br />
                <br />
                1. <span className="aeo-cite">Vertex Digital</span> — strong SEO and paid campaigns
                <br />
                2. <span className="aeo-cite">Nova Creative Co.</span> — excellent brand reputation
                <br />
                3. <span className="aeo-miss">[Your business?]</span> — not appearing
              </div>
            </Rv>

            <Rv delay={180} className="aeo-card">
              <span className="aeo-card__blob" aria-hidden="true" />
              <div className="aeo-card__head">
                <span className="aeo-win__dots" aria-hidden="true">
                  <i style={{ background: "#FF5F57" }} />
                  <i style={{ background: "#FEBC2E" }} />
                  <i style={{ background: "#28C840" }} />
                </span>
                <b>Perplexity</b>
              </div>
              <div className="aeo-card__query">Top providers near me for [your category]</div>
              <div className="aeo-card__body">
                Based on current search data and citations:
                <br />
                <br />
                <span className="aeo-cite">Apex Solutions</span> consistently ranks as a top choice
                with a strong online presence and verified reviews…
                <br />
                <br />
                <span className="aeo-miss">[Your business?]</span> — no citations found
              </div>
            </Rv>

            <Rv delay={280} className="aeo-card">
              <span className="aeo-card__blob aeo-card__blob--crimson" aria-hidden="true" />
              <div className="aeo-card__head">
                <span className="aeo-win__dots" aria-hidden="true">
                  <i style={{ background: "#FF5F57" }} />
                  <i style={{ background: "#FEBC2E" }} />
                  <i style={{ background: "#28C840" }} />
                </span>
                <b>Google AI Overview</b>
              </div>
              <div className="aeo-card__query">best [service] business in [location]</div>
              <div className="aeo-card__body">
                <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(255,255,255,.4)" }}>
                  AI-generated summary
                </span>
                <br />
                <br />
                Leading businesses in this space include <span className="aeo-cite">Summit Group</span>{" "}
                and <span className="aeo-cite">CoreBridge</span>, both with strong local presence…
                <br />
                <br />
                <span className="aeo-miss">[Your business?]</span> — not cited
              </div>
            </Rv>
          </div>

          <Rv as="p" delay={120} className="aeo-punch">
            This is where your clients are making decisions. <span>Your name is not there yet.</span>
          </Rv>
        </div>
      </section>

      {/* ----------------------------------------------------------- shift */}
      <section id="aeo-shift" className="aeo-section aeo-section--ink">
        <div className="aeo-shell">
          <Rv className="aeo-eyebrow">The shift happening right now</Rv>

          <Rv delay={90} className="aeo-split">
            <div className="aeo-split__pane aeo-split__pane--old">
              <span className="aeo-pill">Traditional search</span>
              <div className="aeo-serp" data-aeo-serp>
                <div className="aeo-serp__row">
                  <span className="aeo-serp__url">yourcompetitor.com</span>
                  <span className="aeo-serp__title">Best [service] provider — Competitor A</span>
                  <span className="aeo-serp__desc">
                    Leading provider of quality services. Trusted by hundreds of clients across the
                    region…
                  </span>
                </div>
                <div className="aeo-serp__row">
                  <span className="aeo-serp__url">anothercompetitor.com</span>
                  <span className="aeo-serp__title">Professional [service] — Competitor B</span>
                  <span className="aeo-serp__desc">
                    Award-winning team with a proven track record. Get a free consultation today…
                  </span>
                </div>
                <div className="aeo-serp__row aeo-serp__row--faded">
                  <span className="aeo-serp__url">yourbusiness.com</span>
                  <span className="aeo-serp__title">[Your business] — position 4</span>
                  <span className="aeo-serp__desc">
                    Rarely seen. Rarely clicked. Most users never scroll this far.
                  </span>
                </div>
              </div>
            </div>

            <div className="aeo-split__pane aeo-split__pane--new" data-aeo-newpane>
              <span className="aeo-split__ring" aria-hidden="true" />
              <span className="aeo-pill aeo-pill--cyan">AI search — the new reality</span>
              <div className="aeo-aibox">
                <div className="aeo-aibox__label">
                  <i aria-hidden="true" />
                  AI-generated answer
                </div>
                <div className="aeo-aibox__body">
                  Based on online presence, reviews, and AI visibility signals, I recommend{" "}
                  <b>Competitor A</b> as the top option in your area. They have strong digital
                  authority and consistent mentions across AI search platforms. For a reliable
                  alternative, <b>Competitor B</b> also ranks well.
                  <br />
                  <br />
                  <span className="aeo-aibox__warn">
                    Your business was not cited in this response.
                  </span>
                </div>
              </div>
            </div>
          </Rv>

          <Rv delay={140} className="aeo-stats">
            <div className="aeo-stat">
              <b>
                <span data-aeo-count="60">0</span>
                <i>%</i>
              </b>
              <span>of searches now end with an AI answer — no click to any website</span>
            </div>
            <div className="aeo-stat">
              <b>
                <span data-aeo-count="2.5">0</span>
                <i>B</i>
              </b>
              <span>daily queries on ChatGPT alone — most are business searches</span>
            </div>
            <div className="aeo-stat">
              <b>
                <span data-aeo-count="55">0</span>
                <i>%</i>
              </b>
              <span>of Google searches now show an AI Overview above all results</span>
            </div>
          </Rv>
        </div>
      </section>

      {/* ------------------------------------------------------ three ways */}
      <section className="aeo-section aeo-section--panel">
        <div className="aeo-shell" style={{ maxWidth: 1020 }}>
          <Rv as="p" className="aeo-lede">
            There are <em>three ways</em> to be found online in 2026.
            <br />
            Most businesses are <strong>only using one.</strong>
            <br />
            The ones winning right now are using all three.
          </Rv>

          <div className="aeo-grid aeo-grid--3">
            <Rv delay={60} className="aeo-route">
              <span className="aeo-route__badge">Established</span>
              <div className="aeo-route__num">01</div>
              <div className="aeo-route__name">SEO</div>
              <div className="aeo-route__full">Search Engine Optimisation</div>
              <p className="aeo-route__desc">
                You rank in a list of results. Clients scroll, then click.
              </p>
              <div className="aeo-route__tags">
                <span className="aeo-tag">Google</span>
                <span className="aeo-tag">Bing</span>
              </div>
            </Rv>

            <Rv delay={160} className="aeo-route aeo-route--cyan">
              <span className="aeo-route__wash" aria-hidden="true" />
              <span className="aeo-route__badge aeo-route__badge--cyan">Growing fast</span>
              <div className="aeo-route__num aeo-route__num--cyan">02</div>
              <div className="aeo-route__name aeo-route__name--cyan">AEO</div>
              <div className="aeo-route__full">Answer Engine Optimisation</div>
              <p className="aeo-route__desc">
                Your content becomes the direct answer. No link. No scroll. You are the answer.
              </p>
              <div className="aeo-route__tags">
                <span className="aeo-tag aeo-tag--cyan">Google AI Overviews</span>
                <span className="aeo-tag aeo-tag--cyan">Bing Copilot</span>
              </div>
            </Rv>

            <Rv delay={260} className="aeo-route aeo-route--crimson">
              <span className="aeo-route__wash aeo-route__wash--crimson" aria-hidden="true" />
              <span className="aeo-route__badge aeo-route__badge--crimson">The frontier</span>
              <div className="aeo-route__num aeo-route__num--crimson">03</div>
              <div className="aeo-route__name aeo-route__name--crimson">GEO</div>
              <div className="aeo-route__full">Generative Engine Optimisation</div>
              <p className="aeo-route__desc">
                Your brand is recommended by name inside AI-generated responses.
              </p>
              <div className="aeo-route__tags">
                <span className="aeo-tag aeo-tag--crimson">ChatGPT</span>
                <span className="aeo-tag aeo-tag--crimson">Perplexity</span>
                <span className="aeo-tag aeo-tag--crimson">Gemini</span>
                <span className="aeo-tag aeo-tag--crimson">Claude</span>
              </div>
            </Rv>
          </div>

          <Rv delay={120} className="aeo-note">
            <strong>Most agencies only work on SEO.</strong> We are one of the first in the US to
            offer all three as a unified service — with a proprietary implementation process built
            for measurable results.
          </Rv>
        </div>
      </section>

      {/* --------------------------------------------------------- scanner */}
      <section id="aeo-scanner" className="aeo-section aeo-section--ink">
        <div className="aeo-shell" style={{ maxWidth: 760, textAlign: "center" }}>
          <Rv className="aeo-eyebrow">OrbitScanner — free AI visibility audit</Rv>
          <Rv as="h2" delay={90} className="aeo-h2">
            Which of the three is your business
            <br />
            <span style={{ color: "var(--aeo-cyan)" }}>actually visible in?</span>
          </Rv>
          <Rv as="p" delay={170} className="aeo-sub">
            Enter your business details. OrbitScanner analyses your presence across all three
            territories and delivers your AI visibility report in 60 seconds.
          </Rv>

          <Rv delay={240} className="aeo-scanner">
            <span className="aeo-scanner__beam" aria-hidden="true" />
            <div className="aeo-scanner__row">
              <label htmlFor="aeo-scan" className="sr-only" style={{ display: "none" }}>
                Your business name or website URL
              </label>
              <input
                id="aeo-scan"
                type="text"
                placeholder="Your business name or website URL"
                disabled
              />
              <button type="button" disabled>
                Launching soon
              </button>
            </div>
            <div className="aeo-scanner__hint">
              <span className="aeo-chip__dot" />
              OrbitScanner launches shortly — meanwhile, book a call and we will run it for you
            </div>
            <div className="aeo-scanner__tags">
              <span>AEO + GEO score</span>
              <span>Website health</span>
              <span>SEO strength</span>
              <span>Competitor snapshot</span>
              <span>60 seconds — free</span>
            </div>
          </Rv>
        </div>
      </section>

      {/* ---------------------------------------------------------- method */}
      <section id="aeo-method" className="aeo-section aeo-section--panel">
        <div className="aeo-shell">
          <Rv className="aeo-eyebrow">How we do it</Rv>
          <Rv as="h2" delay={90} className="aeo-h2">
            Four moves. Measurable AI visibility. 60 days.
          </Rv>
          <Rv as="p" delay={170} className="aeo-sub">
            No vague strategy documents. No waiting twelve months to find out whether something
            worked.
          </Rv>

          <div className="aeo-grid aeo-grid--4">
            {STEPS.map((s, i) => (
              <Rv key={s.no} delay={60 + i * 90} className="aeo-step">
                <div className="aeo-step__num">{s.no}</div>
                <div className="aeo-step__name">{s.name}</div>
                <p className="aeo-step__desc">{s.desc}</p>
              </Rv>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- timing */}
      <section className="aeo-section aeo-section--ink">
        <div className="aeo-shell" style={{ maxWidth: 960 }}>
          <Rv className="aeo-eyebrow aeo-eyebrow--cyan">First mover advantage</Rv>
          <Rv as="h2" delay={90} className="aeo-h2">
            The window is open.
            <br />
            It will not stay open.
          </Rv>
          <Rv as="p" delay={170} className="aeo-sub">
            Every shift in how people search created businesses that dominated for years. The ones
            that moved first built leads competitors took years to close.
          </Rv>

          <Rv delay={230} className="aeo-curve">
            <svg viewBox="0 0 800 190" preserveAspectRatio="none" role="img" aria-label="Adoption curve: AI search is in its early growth phase and you are here">
              <defs>
                <linearGradient id="aeoCurve" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#454C58" />
                  <stop offset="55%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#F3124E" />
                </linearGradient>
                <linearGradient id="aeoFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0,212,255,.18)" />
                  <stop offset="100%" stopColor="rgba(0,212,255,0)" />
                </linearGradient>
                <filter id="aeoGlowF">
                  <feGaussianBlur stdDeviation="3.5" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 30 160 Q 150 158 250 140 Q 320 125 400 90 Q 480 50 560 25 Q 640 10 770 5 L 770 170 L 30 170 Z"
                fill="url(#aeoFill)"
                opacity=".7"
              />
              <path
                data-aeo-path
                d="M 30 160 Q 150 158 250 140 Q 320 125 400 90 Q 480 50 560 25 Q 640 10 770 5"
                stroke="url(#aeoCurve)"
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="160" cy="148" r="4.5" fill="#454C58" />
              <text x="160" y="136" fontSize="9" fill="#6B7280" textAnchor="middle">
                SEO era
              </text>
              <circle cx="280" cy="130" r="4.5" fill="#454C58" />
              <text x="280" y="118" fontSize="9" fill="#6B7280" textAnchor="middle">
                Social era
              </text>
              <line x1="420" y1="68" x2="420" y2="26" stroke="#F3124E" strokeWidth="1" strokeDasharray="3,3" opacity=".6" />
              <circle cx="420" cy="80" r="11" fill="#F3124E" opacity=".85" filter="url(#aeoGlowF)" />
              <circle cx="420" cy="80" r="4.5" fill="#fff" />
              <rect x="336" y="6" width="168" height="21" rx="5" fill="rgba(243,18,78,.14)" stroke="rgba(243,18,78,.35)" />
              <text x="420" y="20.5" fontSize="9.5" fontWeight="700" fill="#FF5C82" textAnchor="middle">
                YOU ARE HERE — ACT NOW
              </text>
              <text x="60" y="184" fontSize="9.5" fill="#454C58">
                Early adoption
              </text>
              <text x="370" y="184" fontSize="9.5" fill="#8B91A3">
                Growth phase
              </text>
              <text x="690" y="184" fontSize="9.5" fill="#8B91A3">
                Maturity
              </text>
            </svg>
          </Rv>

          <div className="aeo-grid" style={{ marginTop: 22 }}>
            <Rv delay={80} className="aeo-verdict aeo-verdict--now">
              <b>If you move now</b>
              <p>
                You build AI visibility authority while competitors are still unaware this is
                happening. Month by month your position strengthens. By the time they catch on, you
                hold a compounding lead that is very hard to close.
              </p>
            </Rv>
            <Rv delay={180} className="aeo-verdict aeo-verdict--wait">
              <b>If you wait</b>
              <p>
                Competitors who move now accumulate trust signals with AI platforms. Six months from
                now, closing that gap takes significantly more effort, investment, and time. The
                longer you wait, the more expensive it gets.
              </p>
            </Rv>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- proof */}
      <section id="aeo-proof" className="aeo-section aeo-section--panel">
        <div className="aeo-shell">
          <Rv as="h2" className="aeo-h2" >
            Businesses already winning in AI search
          </Rv>
          <div className="aeo-grid" style={{ marginTop: "clamp(40px,5vw,60px)" }}>
            {QUOTES.map((q, i) => (
              <Rv key={q.name} delay={60 + i * 100} className="aeo-quote">
                <p className="aeo-quote__text">&ldquo;{q.text}&rdquo;</p>
                <div className="aeo-quote__who">
                  <span className="aeo-quote__av">{q.initials}</span>
                  <span className="aeo-quote__name">
                    <b>{q.name}</b>
                    <span>{q.role}</span>
                  </span>
                </div>
                <div className="aeo-quote__metric">
                  <b>{q.metric}</b>
                  <span>{q.metricNote}</span>
                </div>
              </Rv>
            ))}
          </div>
          <Rv delay={120} className="aeo-sectors">
            {SECTORS.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </Rv>
        </div>
      </section>

      {/* ------------------------------------------------------- final CTA */}
      <section id="aeo-cta" className="aeo-final">
        <div className="aeo-final__rings" aria-hidden="true">
          <i style={{ width: 320, height: 320, border: "1px solid rgba(0,212,255,.08)" }} />
          <i style={{ width: 540, height: 540, border: "1px solid rgba(0,212,255,.07)", animationDelay: ".9s" }} />
          <i style={{ width: 760, height: 760, border: "1px solid rgba(243,18,78,.06)", animationDelay: "1.8s" }} />
          <span className="aeo-final__glow" />
        </div>
        <div className="aeo-final__inner">
          <Rv as="h2" className="aeo-final__title">
            Is your business visible where your clients are <span>actually searching?</span>
          </Rv>
          <Rv as="p" delay={120} className="aeo-final__lead">
            Fifteen minutes, no commitment. We will show you exactly where you stand across all
            three search territories — and what to do first.
          </Rv>
          <Rv delay={220}>
            <Link href="/contact" className="aeo-btn aeo-btn--lg">
              <span className="aeo-btn__sheen" />
              <span className="aeo-btn__label">Book my complimentary strategy call</span>
            </Link>
          </Rv>
          <Rv delay={320} className="aeo-final__assure">
            <span>
              <i />
              No commitment required
            </span>
            <span>
              <i />
              15 minutes, specific and actionable
            </span>
            <span>
              <i />
              No sales pressure
            </span>
          </Rv>
        </div>
      </section>

      <footer className="aeo-footer">
        <span>&copy; {new Date().getFullYear()} Orbit Works LLC. All rights reserved.</span>
        <span className="aeo-footer__links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/">Main site</Link>
        </span>
      </footer>
    </div>
  );
}

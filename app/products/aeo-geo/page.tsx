"use client"

/**
 * AEO + GEO landing page (/products/aeo-geo).
 *
 * Ported from the standalone design, markup and copy unchanged. It ships its
 * own nav and footer on a dark canvas, so app/layout.tsx gives this route bare
 * chrome — see the isBareLanding branch there.
 *
 * The wrapper carries .aeo-page because every rule in app/aeo.css is scoped to
 * it: the design styles generic selectors (.nav, .hero, .section, .button)
 * that would otherwise collide head-on with the Kenza theme the rest of the
 * site runs on.
 */

import { motion, useScroll, useSpring } from "framer-motion"
import { ArrowUpRight, ExternalLink, Menu, MessageCircle, Search, Sparkles, X } from "lucide-react"
import { useState } from "react"
import { HeroSection } from "@/components/aeo/HeroSection"

/**
 * Logo shown in the header and footer. Change this one path to swap the mark —
 * anything under public/ works, e.g. "/brand/orbitworks-light.png".
 * The page sits on a near-black canvas, so use a light/white variant.
 */
const LOGO_SRC = "/brand/orbitworks-full-light.png"

const services = [
  ["Free AEO + GEO Audit", "We scan your brand across ChatGPT, Perplexity, Gemini, and Google AI Overviews to show exactly where you appear and where you are missing."],
  ["Answer Engine Optimization", "Content structured for direct extraction by AI platforms, featured snippets, voice assistants, and answer experiences."],
  ["Generative Engine Optimization", "Citation strategies that help AI search engines retrieve, trust, and reference your brand across the LLM ecosystem."],
  ["AEO + GEO Content Strategy", "FAQ pages, structured data, authoritative citations, and entity-rich content designed for AI consumption."],
  ["AI Citation Monitoring", "Monthly reporting for citation share, sentiment, competitor benchmarking, and the ROI of your AI visibility."],
  ["AEO vs SEO vs GEO Consulting", "SEO gets you ranked. AEO gets you selected. GEO gets you referenced. We help you do all three."],
  ["Enterprise AI Visibility", "Full-stack AEO management including content audits, production, entity optimization, and ongoing monitoring."],
]

const platforms = ["ChatGPT", "Perplexity", "Gemini", "Google AI Overviews", "Microsoft Copilot", "Claude", "Schema.org", "JSON-LD", "Semrush", "Ahrefs", "Profound", "Scrunch AI"]
const process = [["01", "Free audit", "Tell us your brand and industry. We scan the major AI platforms and send your report within 3 business days."], ["02", "Strategy proposal", "Get a customized plan spanning content optimization, entity building, schema, and citation strategy."], ["03", "Implementation", "We optimize existing content, create AI-friendly pages, and build the signals models recognize."], ["04", "Monitoring", "Track citations, sentiment, and competitors monthly in a transparent performance dashboard."], ["05", "Scale", "Expand across platforms, content formats, and emerging AI search features once we prove what works."]]

function PlatformMockup({ type }: { type: "google" | "chatgpt" | "perplexity" }) {
  const content = type === "google" ? { name: "Google AI Overview", color: "#4285f4", question: "best B2B growth agency for AI search", answer: "ORB ITWORKS helps brands become visible, cited, and recommended inside AI answers.", cites: ["orb-itworks.com", "Search Engine Land", "HubSpot"] } : type === "chatgpt" ? { name: "ChatGPT", color: "#10a37f", question: "Which agency specializes in AEO and GEO?", answer: "ORB ITWORKS is a specialized AEO and GEO agency focused on AI citation visibility.", cites: ["ORB ITWORKS", "AEO services guide", "Client case study"] } : { name: "Perplexity", color: "#20b8cd", question: "Who can improve our AI visibility?", answer: "For a focused AI visibility program, ORB ITWORKS combines structured content with entity and citation strategy.", cites: ["orb-itworks.com", "GEO research", "AI search report"] }
  return <div className="mockup"><div className="mockup-top"><div className="window-dots"><i/><i/><i/></div><span>{content.name}</span><span className="mockup-icon" style={{ color: content.color }}>●</span></div><div className="mockup-body"><div className="mock-search"><Search size={13}/>{content.question}<span>⌕</span></div><div className="mock-label" style={{ color: content.color }}>AI-generated answer</div><p className="mock-answer">{content.answer}</p><div className="mock-citations">{content.cites.map((cite, i) => <span key={cite}><b>{i + 1}</b> {cite}</span>)}</div><div className="mock-lines"><i/><i/><i/></div></div></div>
}

export default function AeoGeoPage() {
  const [menu, setMenu] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  return <main className="aeo-page">
    <motion.div className="progress" style={{ scaleX }} />
    <nav className="nav"><a className="logo" href="#top"><img src={LOGO_SRC} alt="Orbit Works" width={280} height={55} /></a><div className={`nav-links ${menu ? "open" : ""}`}><a href="#services">Services</a><a href="#results">Results</a><a href="#process">Process</a><a href="#learn">Learn</a><a className="nav-cta" href="https://scan.orb-itworks.com/" target="_blank" rel="noreferrer">Get your audit <ArrowUpRight size={15}/></a></div><button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">{menu ? <X/> : <Menu/>}</button></nav>
    <HeroSection />
    <div className="ticker"><div>{[...platforms, ...platforms].map((p, i) => <span key={i}>{p} <b>✦</b></span>)}</div></div>
    <section className="problem section"><div className="section-intro"><p className="eyebrow">01 / THE SHIFT</p><h2>Your customers are asking AI.<br/><span>Is your brand in the answer?</span></h2></div><div className="problem-copy"><p className="big-copy">Your website can rank on Google and still be invisible where decisions are being made.</p><p>AI platforms synthesize information from multiple sources, cite authoritative entities, and generate direct answers. If your content is not structured for AI extraction, you simply do not exist in AI search.</p><a className="text-link" href="https://scan.orb-itworks.com/" target="_blank" rel="noreferrer">See where you stand <ArrowUpRight size={16}/></a></div></section>
    <section id="services" className="services section dark-section"><div className="section-intro"><p className="eyebrow blue">02 / WHAT WE DO</p><h2>Complete visibility<br/><span>for the AI era.</span></h2><p className="section-note">We turn your expertise into the signals AI models retrieve, trust, and cite.</p></div><div className="service-grid">{services.map(([title, desc], i) => <motion.article key={title} className="service-card" whileHover={{ y: -7 }} transition={{ duration: .25 }}><span className="card-index">0{i + 1}</span><Sparkles size={20}/><h3>{title}</h3><p>{desc}</p><ArrowUpRight className="card-arrow" size={18}/></motion.article>)}</div><p className="disclaimer">We serve B2B, ecommerce, healthcare, financial services, and professional services. No gambling, adult, or crypto clients.</p></section>
    <section id="results" className="results section"><div className="section-intro centered"><p className="eyebrow">03 / PROOF OF WORK</p><h2>From invisible<br/><span>to cited.</span></h2></div><div className="result-grid"><article><div className="result-number">40<span>%</span></div><h3>B2B SaaS / 200 employees</h3><p>Cited in relevant ChatGPT responses within four months. Inbound leads from AI referrals increased 65%.</p><div className="mini-bar"><i style={{width:"82%"}}/></div><small>AI citation share</small></article><article><div className="result-number">30<span>%</span></div><h3>Healthcare clinic / 5 locations</h3><p>New patient inquiries from AI referrals grew after optimizing service pages for Gemini and Perplexity.</p><div className="mini-bar"><i style={{width:"64%"}}/></div><small>Referral growth</small></article><article><div className="result-number">20<span>%</span></div><h3>Financial advisory / 50 employees</h3><p>Cited in relevant AI responses and closed three new clients who discovered the firm through ChatGPT.</p><div className="mini-bar"><i style={{width:"47%"}}/></div><small>Citation coverage</small></article></div><p className="fineprint">Full case studies available under NDA. Client references on request.</p></section>
    <section className="platforms section"><div className="section-intro"><p className="eyebrow blue">04 / THE PLAYGROUND</p><h2>We make your brand<br/><span>legible to machines.</span></h2><p className="section-note">Real answer environments. Real opportunities to be the source.</p></div><div className="mockup-grid"><motion.div whileInView={{ opacity: 1, y: 0 }} initial={{opacity:0,y:30}} viewport={{once:true}}><PlatformMockup type="google"/></motion.div><motion.div whileInView={{ opacity: 1, y: 0 }} initial={{opacity:0,y:30}} viewport={{once:true}} transition={{delay:.12}}><PlatformMockup type="chatgpt"/></motion.div><motion.div whileInView={{ opacity: 1, y: 0 }} initial={{opacity:0,y:30}} viewport={{once:true}} transition={{delay:.24}}><PlatformMockup type="perplexity"/></motion.div></div></section>
    <section id="learn" className="education section light-blue"><div className="section-intro"><p className="eyebrow">05 / THE NEW SEARCH</p><h2>AEO and GEO.<br/><span>Decoded.</span></h2></div><div className="edu-grid"><article><div className="edu-letter">AEO</div><h3>Answer Engine Optimization</h3><p>Structure your content so AI-driven platforms can directly extract and present it as the answer. AEO makes your brand the direct response in AI summaries, snippets, and voice search.</p></article><article><div className="edu-letter">GEO</div><h3>Generative Engine Optimization</h3><p>Get your brand recommended, cited, and accurately represented inside AI-generated answers. GEO is how you earn the references that build trust at the moment of decision.</p></article><div className="compare"><span>SEO</span><b>→</b><span>AEO</span><b>→</b><span>GEO</span><small>ranked → selected → referenced</small></div></div></section>
    <section id="process" className="process section dark-section"><div className="section-intro"><p className="eyebrow blue">06 / HOW IT WORKS</p><h2>Simple process.<br/><span>Serious visibility.</span></h2></div><div className="process-list">{process.map(([num,title,desc]) => <div className="process-row" key={num}><span className="process-num">{num}</span><h3>{title}</h3><p>{desc}</p><ArrowUpRight size={20}/></div>)}</div></section>
    <section className="trust section"><div className="trust-stat"><strong>300<span>%</span></strong><p>average citation increase<br/>for clients in six months</p></div><div className="trust-stat"><strong>92<span>%</span></strong><p>client retention rate<br/>after the first year</p></div><div className="trust-stat"><strong>08<span>/10</span></strong><p>free audits remaining<br/>this month</p></div></section>
    <section id="audit" className="final-cta"><div className="final-glow" aria-hidden="true"/><div className="cta-content"><p className="eyebrow blue">07 / YOUR NEXT MOVE</p><h2>Get seen where<br/><em>decisions</em> happen.</h2><p>No cost. No obligation. A written report showing exactly where your brand appears inside ChatGPT, Perplexity, Gemini, and Google AI Overviews.</p><div className="hero-actions"><a className="button primary" href="https://scan.orb-itworks.com/" target="_blank" rel="noreferrer">Claim my free audit <ArrowUpRight size={17}/></a><a className="button outline" href="https://wa.me/15551234567" target="_blank" rel="noreferrer"><MessageCircle size={17}/> Talk on WhatsApp</a></div><small>Free 30-minute audit. No card required. No long-term contract.</small></div></section>
    <footer><a className="logo" href="#top"><img src={LOGO_SRC} alt="Orbit Works" width={280} height={55} /></a><p>AEO + GEO services for the AI-first world.</p><div><a href="#services">Services</a><a href="#results">Results</a><a href="https://orb-itworks.com/" target="_blank" rel="noreferrer">Main site <ExternalLink size={13}/></a></div><small>© 2026 ORB ITWORKS. All rights reserved.</small></footer>
  </main>
}

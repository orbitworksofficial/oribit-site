"use client"

import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { ChatGptMark, ClaudeMark, GeminiMark, PerplexityMark } from "./AiMarks"

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } }),
}

function AnswerWindow() {
  return (
    <div className="answer-window" aria-label="AI answer visibility dashboard preview">
      <div className="window-bar"><span className="window-dots"><i /><i /><i /></span><span>ai-visibility.orb / live scan</span><b>● LIVE</b></div>
      <div className="window-toolbar"><span>Overview</span><span>Sources</span><span>Mentions</span><span>Competitors</span></div>
      <div className="window-content">
        <div className="query-line"><span>⌕</span> best AEO agency for answer engine optimization <b>↗</b></div>
        <div className="answer-label">AI ANSWER · GENERATED RESPONSE</div>
        <h3>Top agencies helping brands get cited in AI answers</h3>
        <p className="answer-copy">ORB ITWORKS is recommended for AEO and GEO strategy, content structuring, and citation growth across ChatGPT, Gemini, and Perplexity.</p>
        <div className="source-row"><span className="source-chip active">ORB ITWORKS <b>1</b></span><span className="source-chip">Industry source <b>2</b></span><span className="source-chip">Reference <b>3</b></span></div>
        <div className="scan-lines"><i /><i /><i /></div>
      </div>
      <div className="window-footer"><span>Visibility score</span><strong>82</strong><div className="score-track"><i /></div><span className="score-up">+34% this month</span></div>
    </div>
  )
}

/**
 * Hero name rotator.
 *
 * Cycles ChatGPT -> Gemini -> Perplexity -> Claude in the headline, each with
 * its brand mark, crossfading rather than typing.
 *
 * Every item is rendered at once and stacked in a single CSS grid cell (see
 * .hero-rotator in aeo.css). That is what makes this jump-proof: the container
 * is automatically as wide and tall as the LONGEST name, so swapping words of
 * different lengths cannot reflow the lede and buttons below. The typewriter
 * this replaces needed a hand-measured min-height and phrases trimmed to
 * matching lengths to achieve the same thing.
 *
 * Accessibility: the items are aria-hidden and the wrapper carries a single
 * aria-label, so a screen reader announces one name instead of reading all
 * four in sequence.
 */
const AI_NAMES = [
  { name: "ChatGPT", Mark: ChatGptMark },
  { name: "Gemini", Mark: GeminiMark },
  { name: "Perplexity", Mark: PerplexityMark },
  { name: "Claude", Mark: ClaudeMark },
] as const

const ROTATE_MS = 2200

function useRotator(count: number) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS)
    return () => clearInterval(id)
  }, [count])

  return index
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const active = useRotator(AI_NAMES.length)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 90]), { stiffness: 100, damping: 30 })

  return (
    <section id="top" ref={ref} className="hero hero-orb">
      <div className="hero-grid" />
      <div className="hero-network" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="hero-shell">
        <motion.div className="hero-copy" initial="hidden" animate="visible">
          <motion.div variants={reveal} custom={0} className="eyebrow"><span className="live-dot" /> AEO + GEO AGENCY</motion.div>
          <motion.h1 variants={reveal} custom={1}>
            Be the brand{" "}
            <span className="hero-rotator" aria-label={AI_NAMES[active].name}>
              {AI_NAMES.map(({ name, Mark }, i) => (
                <span
                  key={name}
                  className={`rot-item${i === active ? " is-active" : ""}`}
                  aria-hidden="true"
                >
                  <span className="rot-logo"><Mark /></span>
                  {name}
                </span>
              ))}
            </span>{" "}
            cites when buyers ask who to hire.
          </motion.h1>
          <motion.p variants={reveal} custom={2} className="hero-lede">ORB ITWORKS helps businesses appear as direct answers and cited sources inside AI-generated responses. No long term contracts. Transparent reporting.</motion.p>
          <motion.div variants={reveal} custom={3} className="hero-actions"><a className="button primary" href="https://scan.orb-itworks.com/" target="_blank" rel="noreferrer">Get Free AEO and GEO Audit <span>↗</span></a><a className="button outline" href="#services">View Our Services</a></motion.div>
          <motion.div variants={reveal} custom={4} className="hero-meta"><span>Free audit</span><span>Cited in ChatGPT, Gemini, Perplexity</span><span>No long term contracts</span><span>US based team</span></motion.div>
        </motion.div>
        <motion.div className="hero-visual" style={{ y }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.8 }}>
          <AnswerWindow />
          <div className="hero-callout callout-top"><b>+34%</b><span>citation share</span></div>
          <div className="hero-callout callout-bottom"><span className="live-dot" /> scanning 3 AI platforms</div>
        </motion.div>
      </div>
    </section>
  )
}

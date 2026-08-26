"use client"

import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

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
 * Typewriter rotator for the second half of the hero headline.
 *
 * Types a phrase in, holds, deletes it, moves to the next. Restored from the
 * page's earlier version — the static headline lost the movement that made the
 * hero feel live.
 *
 * Timings are the originals: 45ms per character typing, 22ms deleting (backing
 * out reads better slightly faster than typing), 2600ms hold on a completed
 * phrase, 320ms before the next begins, 700ms before the first starts so the
 * entrance animation lands first.
 *
 * Honours prefers-reduced-motion by showing the first phrase statically.
 */
const ROTATING = [
  // Short and near-equal in length on purpose: each wraps to the same number
  // of lines, so the reserved height below matches every phrase and there is
  // no void under the short ones and no reflow between them.
  "Cited in ChatGPT",
  "Cited in Gemini",
  "Cited in Perplexity",
]

function useTypewriter(phrases: string[]) {
  const [text, setText] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(phrases[0])
      setDone(true)
      return
    }

    let w = 0
    let i = 0
    let dir = 1
    const timers: ReturnType<typeof setTimeout>[] = []
    const later = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)) }

    const step = () => {
      const phrase = phrases[w]
      setText(phrase.slice(0, i))
      if (dir === 1) {
        if (i < phrase.length) { i += 1; later(step, 45) }
        else later(() => { dir = -1; step() }, 2600)
      } else if (i > 0) {
        i -= 1
        later(step, 22)
      } else {
        dir = 1
        w = (w + 1) % phrases.length
        later(step, 320)
      }
    }
    later(step, 700)

    return () => timers.forEach(clearTimeout)
  }, [phrases])

  return { text, done }
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { text: typed, done: typedDone } = useTypewriter(ROTATING)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 90]), { stiffness: 100, damping: 30 })

  return (
    <section id="top" ref={ref} className="hero hero-orb">
      <div className="hero-grid" />
      <div className="hero-network" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="hero-shell">
        <motion.div className="hero-copy" initial="hidden" animate="visible">
          <motion.div variants={reveal} custom={0} className="eyebrow"><span className="live-dot" /> AEO + GEO AGENCY</motion.div>
          <motion.h1 variants={reveal} custom={1}>AEO and GEO Services{" "}
            <span className="hero-type">
              {typed}
              {!typedDone && <i className="hero-caret" aria-hidden="true" />}
            </span>
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

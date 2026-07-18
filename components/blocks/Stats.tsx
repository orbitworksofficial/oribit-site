"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/content";

/**
 * The numbers band. Ports the count-up from modules/countup: the theme fires it
 * on data-scrolltrigger="start-countup" and eases the value in over ~1.5s.
 *
 * Counting is skipped under prefers-reduced-motion — a number ticking is motion.
 */

const DURATION = 1500;

function useCountUp(target: number, run: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // easeOutQuint — matches the theme's cubic-bezier(.23,1,.32,1) feel
      const eased = 1 - Math.pow(1 - t, 5);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);

  return value;
}

function Stat({ value, suffix, label, run }: (typeof STATS)[number] & { run: boolean }) {
  const n = useCountUp(value, run);
  return (
    <li>
      <span className="orbit-stat-value">
        {n}
        {suffix}
      </span>
      <span className="orbit-stat-label">{label}</span>
    </li>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries, self) => {
        for (const e of entries) {
          if (e.intersectionRatio > 0) {
            setRun(true);
            self.unobserve(e.target);
          }
        }
      },
      { rootMargin: "5%", threshold: [0, 0.2] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="wp-block-kenza-column-constraint column-constraint cols-12 orbit-stats"
      data-transition="slideup"
      data-scrolltrigger="start-countup"
    >
      <ul>
        {STATS.map((s) => (
          <Stat key={s.label} {...s} run={run} />
        ))}
      </ul>
    </div>
  );
}

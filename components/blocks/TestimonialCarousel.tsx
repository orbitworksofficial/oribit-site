"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/lib/content";
import ClientLogo from "./ClientLogo";

/**
 * Client reviews as a single-line carousel.
 *
 * Built on native scroll-snap rather than a transform slider: the track is a
 * real scroll container, so trackpad/touch swiping, keyboard and screen readers
 * all work for free, and the arrows just call scrollBy(). No layout maths to
 * desync on resize.
 *
 * Arrows disable at each end; the dots reflect and control the active page.
 */
export default function TestimonialCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /** Width of one card + gap — read from the DOM so CSS stays the source of truth. */
  const step = () => {
    const t = trackRef.current;
    if (!t) return 0;
    const card = t.querySelector<HTMLElement>(".orbit-quote");
    if (!card) return t.clientWidth;
    const gap = parseFloat(getComputedStyle(t).columnGap || "0") || 0;
    return card.offsetWidth + gap;
  };

  const sync = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const s = step() || 1;
    setActive(Math.round(t.scrollLeft / s));
    setAtStart(t.scrollLeft <= 2);
    setAtEnd(t.scrollLeft + t.clientWidth >= t.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    sync();
    t.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      t.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const go = (dir: -1 | 1) =>
    trackRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });

  const goTo = (i: number) =>
    trackRef.current?.scrollTo({ left: i * step(), behavior: "smooth" });

  return (
    <div className="orbit-carousel">
      <div className="orbit-carousel__track" ref={trackRef}>
        {TESTIMONIALS.map((t) => (
          <blockquote key={t.client} className="orbit-quote">
            <ClientLogo name={t.client} logo={t.logo} />
            <p>{t.quote}</p>
            <footer>
              <cite>{t.client}</cite>
              <span className="label small">{t.sector}</span>
            </footer>
          </blockquote>
        ))}
      </div>

      <div className="orbit-carousel__controls">
        <div className="orbit-carousel__dots">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.client}
              type="button"
              className={`orbit-carousel__dot${i === active ? " is-active" : ""}`}
              aria-label={`Go to review ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <div className="orbit-carousel__arrows">
          <button
            type="button"
            className="orbit-carousel__arrow"
            aria-label="Previous reviews"
            disabled={atStart}
            onClick={() => go(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className="orbit-carousel__arrow"
            aria-label="Next reviews"
            disabled={atEnd}
            onClick={() => go(1)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

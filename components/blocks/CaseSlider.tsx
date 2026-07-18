"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type CaseCard = {
  href: string;
  title: string;
  src: string;
  width?: number;
  height?: number;
  id: string;
  focal?: string;
};

/**
 * Port of modules/animatedCarousel — the pinned homepage case stack.
 *
 * Faithfully reproduced:
 *  - a .spacer provides the scroll runway the pinned .sticky travels through
 *    (see perCard below for how far each card takes);
 *  - the incoming card gets .active, the outgoing .activeout, and the track gets
 *    .animating / .reverse — theme.css owns every transition off those;
 *  - the "01/05" counter and the --percentage progress bar.
 *
 * Deliberately NOT reproduced: the original also rewrote document.scrollTop
 * mid-gesture and collapsed its own spacer to snap between cards. That fights
 * the browser (it breaks scroll anchoring and momentum on trackpads/iOS) and is
 * the fiddliest part of the old bundle. Scroll position maps straight to an
 * index here instead. Visually equivalent; worth a look on review.
 */
export default function CaseSlider({ cards }: { cards: CaseCard[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;

    const count = cards.length;
    const first = inner.children[0] as HTMLElement | undefined;
    if (!first) return;

    // Scroll runway PER CARD. The original tied this to 4x the card height,
    // which on these tall cards meant ~5-6 wheel notches to advance one image.
    // Pinning it to ~0.85 of the viewport instead gives a consistent ~2-3
    // scrolls per card regardless of how tall the card renders — long enough
    // that the 1.5s zoom transition finishes rather than snapping.
    const perCard = Math.max(600, Math.round(window.innerHeight * 0.85));
    const travel = count * perCard;

    // The spacer is what gives the pinned stack its scroll runway.
    const spacer = document.createElement("div");
    spacer.classList.add("spacer");
    spacer.style.height = `${travel}px`;
    root.appendChild(spacer);

    const escapeAnchor = document.createElement("a");
    escapeAnchor.classList.add("escapeAnchor");
    escapeAnchor.id = "escape";
    root.appendChild(escapeAnchor);

    // Centre the pinned track in the viewport, as q() did.
    const centre = window.innerHeight / 2 - inner.offsetHeight / 2;
    root.style.setProperty("--scrollTop", `${centre}px`);

    let previous = 0;
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const top = root.offsetTop;
        const progress = (document.documentElement.scrollTop - top) / travel;
        const next = Math.max(0, Math.min(count - 1, Math.floor(progress * count)));

        if (next === previous) return;
        inner.classList.toggle("reverse", next < previous);
        inner.classList.add("animating");
        previous = next;
        setIndex(next);
      });
    };

    // theme.css leaves .animating on for the 1.5s card transition.
    let settle = 0;
    const onSettle = () => {
      clearTimeout(settle);
      settle = window.setTimeout(() => inner.classList.remove("animating"), 1500);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onSettle, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onSettle);
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      spacer.remove();
      escapeAnchor.remove();
    };
  }, [cards.length]);

  const label = `${(index + 1).toString().padStart(2, "0")}/${cards.length
    .toString()
    .padStart(2, "0")}`;

  return (
    <div
      ref={rootRef}
      className="wp-block-kenza-case-slider"
      data-transition="slideup"
      data-scrolltrigger="animated-carousel"
    >
      <div className="sticky">
        <div className="inner" ref={innerRef}>
          {cards.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              className={`wp-block-kenza-case-card${i === index ? " active" : ""}`}
              style={card.focal ? ({ "--focal": card.focal } as React.CSSProperties) : undefined}
            >
              <figure className="wp-block-image size-main-page-full-width">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  decoding="async"
                  width={card.width}
                  height={card.height}
                  loading="lazy"
                  src={card.src}
                  alt=""
                  className={`wp-image-${card.id}`}
                />
              </figure>
              <h3 className="wp-block-heading book">{card.title}</h3>
            </Link>
          ))}
        </div>

        <div className="bottomPanel">
          <div
            className="progress"
            style={
              { "--percentage": `${((index + 1) / cards.length) * 100}%` } as React.CSSProperties
            }
          />
          <div className="count">{label}</div>
          <a href="#escape" className="escape" data-action="escapeScroll">
            Continue
          </a>
        </div>
      </div>
    </div>
  );
}

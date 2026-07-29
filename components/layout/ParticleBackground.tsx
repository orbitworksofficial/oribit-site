"use client";

import { useEffect, useRef } from "react";

/**
 * Constellation backdrop — drifting particles joined by lines to their near
 * neighbours, on a canvas behind the whole site.
 *
 * Tuned for a WHITE page and deliberately bold: every dot is brand crimson and
 * every link line is black, so the network actually reads as a design element
 * rather than a faint smudge. The connecting lines are what make it legible —
 * outlines alone give the eye nothing to catch.
 *
 * Cheap by construction: particle count scales with viewport area and is capped,
 * neighbour search is O(n²) over that small n, the canvas is DPR-aware, and the
 * loop stops entirely when the tab is hidden. Honours prefers-reduced-motion by
 * drawing one static frame.
 *
 * TO REMOVE: delete the <ParticleBackground /> line and the "./particles.css"
 * import in app/layout.tsx, plus this file and app/particles.css.
 */
type P = { x: number; y: number; vx: number; vy: number; r: number };

const LINK_DIST = 132; // px at which two particles are joined
const MAX_PARTICLES = 90;

export default function ParticleBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: P[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(MAX_PARTICLES, Math.round((w * h) / 20000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.9 + 1.3,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Links first so dots sit on top of them.
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > LINK_DIST) continue;
          // Black links, fading out as the pair separates.
          ctx.strokeStyle = `rgba(0, 0, 0, ${(1 - d / LINK_DIST) * 0.3})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.fillStyle = "rgba(243, 18, 78, 0.85)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap at the edges so the field never thins out.
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduced) draw();
      else raf = requestAnimationFrame(step);
    };

    const onResize = () => {
      seed();
      start();
    };

    // Don't burn frames on a hidden tab.
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };

    seed();
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="orbit-particles" aria-hidden="true" />;
}

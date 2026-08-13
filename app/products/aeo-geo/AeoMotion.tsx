"use client";

import { useEffect } from "react";

/**
 * Behaviour for the AEO/GEO landing page.
 *
 * One effect that wires every interaction on the page, rather than a component
 * per widget: the markup is static server-rendered HTML (good for the crawlers
 * this page is about), and this only decorates it. Everything degrades to a
 * readable page with no JS — reveals start visible via the `no-js` fallback
 * below, so nothing is ever hidden from a crawler that does not run scripts.
 *
 * Honours prefers-reduced-motion: the canvas, typing and counters all skip
 * straight to their finished state.
 */
export default function AeoMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    const rafs: number[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];

    const later = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    const on = <K extends keyof WindowEventMap>(
      target: Window | Document,
      evt: K,
      fn: (e: WindowEventMap[K]) => void,
      opts?: AddEventListenerOptions,
    ) => {
      target.addEventListener(evt, fn as EventListener, opts);
      cleanups.push(() => target.removeEventListener(evt, fn as EventListener, opts));
    };

    /* --------------------------------------------------------- header -- */
    const header = document.querySelector<HTMLElement>("[data-aeo-header]");
    if (header) {
      const sync = () => header.setAttribute("data-stuck", window.scrollY > 70 ? "1" : "0");
      sync();
      on(window, "scroll", sync, { passive: true });
    }

    /* -------------------------------------------------------- reveals -- */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.transitionDelay = `${Number(el.dataset.aeoDelay || 0)}ms`;
          el.setAttribute("data-shown", "1");
          io.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll<HTMLElement>(".aeo-rv").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    /* ------------------------------------------------ headline rotator -- */
    const rot = document.querySelector<HTMLElement>("[data-aeo-rotate]");
    if (rot) {
      const words = [
        "not just another result.",
        "not page four of Google.",
        "not a link nobody clicks.",
      ];
      if (reduce) {
        rot.textContent = words[0];
      } else {
        let w = 0;
        let i = 0;
        let dir = 1;
        const step = () => {
          const text = words[w];
          rot.textContent = text.slice(0, i);
          if (dir === 1) {
            if (i < text.length) {
              i += 1;
              later(step, 45);
            } else {
              later(() => {
                dir = -1;
                step();
              }, 2600);
            }
          } else if (i > 0) {
            i -= 1;
            later(step, 22);
          } else {
            dir = 1;
            w = (w + 1) % words.length;
            later(step, 320);
          }
        };
        later(step, 700);
      }
    }

    /* ------------------------------------------------------ prompt type -- */
    document.querySelectorAll<HTMLElement>("[data-aeo-type]").forEach((el) => {
      const text = el.dataset.aeoType || "";
      if (reduce) {
        el.textContent = text;
        return;
      }
      let i = 0;
      const step = () => {
        if (i >= text.length) return;
        i += 1;
        el.textContent = text.slice(0, i);
        later(step, 38);
      };
      later(step, Number(el.dataset.aeoTypedelay || 0));
    });

    /* --------------------------------------------------------- counters -- */
    const counters = document.querySelectorAll<HTMLElement>("[data-aeo-count]");
    const cio = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          cio.unobserve(el);
          const target = parseFloat(el.dataset.aeoCount || "0");
          const dec = String(target).includes(".") ? 1 : 0;
          const ring = el.closest<HTMLElement>("[data-aeo-ring]");

          if (reduce) {
            el.textContent = target.toFixed(dec);
            if (ring) {
              ring.style.background = `conic-gradient(var(--aeo-cyan) ${target * 3.6}deg, rgba(255,255,255,.07) 0deg)`;
            }
            continue;
          }

          let start: number | null = null;
          const tick = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / 1800, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(dec);
            if (ring) {
              ring.style.background = `conic-gradient(var(--aeo-cyan) ${(target * eased * 3.6).toFixed(1)}deg, rgba(255,255,255,.07) 0deg)`;
            }
            if (p < 1) rafs.push(requestAnimationFrame(tick));
            else el.textContent = target.toFixed(dec);
          };
          rafs.push(requestAnimationFrame(tick));
        }
      },
      { threshold: 0.35 },
    );
    counters.forEach((el) => cio.observe(el));
    cleanups.push(() => cio.disconnect());

    /* ------------------------------------------------- old vs new split -- */
    const pane = document.querySelector<HTMLElement>("[data-aeo-newpane]");
    const serp = document.querySelector<HTMLElement>("[data-aeo-serp]");
    if (pane) {
      const sio = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          sio.disconnect();
          later(() => {
            pane.setAttribute("data-lit", "1");
            serp?.setAttribute("data-dim", "1");
          }, reduce ? 0 : 700);
        },
        { threshold: 0.35 },
      );
      sio.observe(pane);
      cleanups.push(() => sio.disconnect());
    }

    /* ------------------------------------------------------ growth path -- */
    const path = document.querySelector<SVGPathElement>("[data-aeo-path]");
    if (path) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = reduce ? "0" : `${len}`;
      if (!reduce) {
        const pio = new IntersectionObserver(
          (entries) => {
            if (!entries[0].isIntersecting) return;
            pio.disconnect();
            path.style.transition = "stroke-dashoffset 2200ms cubic-bezier(.22,1,.36,1)";
            path.style.strokeDashoffset = "0";
          },
          { threshold: 0.2 },
        );
        pio.observe(path);
        cleanups.push(() => pio.disconnect());
      }
    }

    /* ---------------------------------------------------- hero particles -- */
    const cv = document.querySelector<HTMLCanvasElement>("[data-aeo-canvas]");
    const ctx = cv?.getContext("2d");
    if (cv && ctx && !reduce) {
      const host = cv.parentElement as HTMLElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let W = 0;
      let H = 0;
      let ang = 0;
      let dots: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

      const build = () => {
        const w = host.offsetWidth;
        const h = host.offsetHeight;
        if (!w || !h) return;
        W = w;
        H = h;
        cv.width = w * dpr;
        cv.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const n = Math.min(70, Math.round((w * h) / 22000));
        dots = Array.from({ length: n }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.4 + 0.5,
        }));
      };
      build();
      on(window, "resize", build);

      const draw = () => {
        if (W && H) {
          ctx.clearRect(0, 0, W, H);
          const ox = W / 2;
          const oy = H / 2;
          const mr = Math.hypot(ox, oy) * 0.85;

          for (let i = 1; i <= 5; i += 1) {
            ctx.beginPath();
            ctx.arc(ox, oy, (mr / 5) * i, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0,212,255,${i === 3 ? 0.09 : 0.04})`;
            ctx.lineWidth = i === 3 ? 1 : 0.5;
            ctx.stroke();
          }

          // Radar sweep — the visual metaphor for "scanning AI answers".
          const g = ctx.createLinearGradient(
            ox + Math.cos(ang) * mr * 0.5,
            oy + Math.sin(ang) * mr * 0.5,
            ox,
            oy,
          );
          g.addColorStop(0, "rgba(0,212,255,0)");
          g.addColorStop(0.6, "rgba(0,212,255,.05)");
          g.addColorStop(1, "rgba(243,18,78,.10)");
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.arc(ox, oy, mr, ang - Math.PI * 0.55, ang);
          ctx.closePath();
          ctx.fillStyle = g;
          ctx.fill();
          ctx.restore();

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(ox + Math.cos(ang) * mr, oy + Math.sin(ang) * mr);
          ctx.strokeStyle = "rgba(0,212,255,.38)";
          ctx.lineWidth = 1;
          ctx.shadowColor = "#00D4FF";
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.restore();

          for (let i = 0; i < dots.length; i += 1) {
            const d = dots[i];
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0 || d.x > W) d.vx *= -1;
            if (d.y < 0 || d.y > H) d.vy *= -1;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,.30)";
            ctx.fill();
            for (let j = i + 1; j < dots.length; j += 1) {
              const o = dots[j];
              const dist = Math.hypot(d.x - o.x, d.y - o.y);
              if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(o.x, o.y);
                ctx.strokeStyle = `rgba(0,212,255,${(0.1 * (1 - dist / 120)).toFixed(3)})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
              }
            }
          }

          ang += 0.0055;
          if (ang > Math.PI * 2) ang -= Math.PI * 2;
        }
        rafs.push(requestAnimationFrame(draw));
      };
      rafs.push(requestAnimationFrame(draw));
    }

    return () => {
      rafs.forEach((id) => cancelAnimationFrame(id));
      timers.forEach((id) => clearTimeout(id));
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}

"use client";

import { useEffect, type RefObject } from "react";

/**
 * Port of modules/mouseover-circle.
 *
 * A cursor-following disc. theme.css matches it as
 * `[data-item=hover-circle] + .hoverCircle`, so the <i> must be the element's
 * IMMEDIATE next sibling — it is inserted via .after() rather than rendered by
 * React for exactly that reason (React would need it inside the parent).
 *
 * Position is published as --left/--top on the hovered element's PARENT, which
 * is what the original does; the disc is position:fixed against the viewport.
 * Label text is read from a [data-item="circle"] descendant.
 */
export function useHoverCircle(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Pointer-driven affordance; skip on touch, matching the CSS hover guards.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const label = el.querySelector<HTMLElement>('[data-item="circle"]');
    const disc = document.createElement("i");
    disc.classList.add("hoverCircle");
    disc.innerText = label ? label.innerText : "";
    el.after(disc);

    let enterTimer = 0;
    let leaveTimer = 0;

    const onMove = (event: MouseEvent) => {
      const parent = (event.currentTarget as HTMLElement).parentNode as HTMLElement | null;
      if (!parent) return;
      const { clientX, clientY } = event;
      requestAnimationFrame(() => {
        parent.style.setProperty("--left", `${clientX}px`);
        parent.style.setProperty("--top", `${clientY}px`);
      });
    };

    const onEnter = () => {
      enterTimer = window.setTimeout(() => disc.classList.add("show"), 100);
    };
    const onLeave = () => {
      leaveTimer = window.setTimeout(() => disc.classList.remove("show"), 500);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      disc.remove();
    };
  }, [ref]);
}

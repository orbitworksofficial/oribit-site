"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Behaviour for the mobile menu, which the theme drives purely from a CSS
 * `#nav-toggle` checkbox and therefore never scripts:
 *
 *  1. Close on navigation. Tapping a link left the checkbox checked, so you
 *     landed on the new page with the menu still covering it.
 *  2. Lock scrolling while open. The page scrolled underneath the drawer, so
 *     closing it dumped you somewhere else on the page.
 *  3. Close on Escape, which the checkbox pattern gives no way to do.
 *
 * Scroll position is captured and restored around the lock so nothing jumps.
 */
export default function NavDrawer() {
  const pathname = usePathname();

  // 1. Close whenever the route changes.
  useEffect(() => {
    const cb = document.getElementById("nav-toggle") as HTMLInputElement | null;
    if (cb?.checked) {
      cb.checked = false;
      cb.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, [pathname]);

  // 2 + 3. Scroll lock and Escape-to-close, driven by the checkbox state.
  useEffect(() => {
    const cb = document.getElementById("nav-toggle") as HTMLInputElement | null;
    if (!cb) return;

    const body = document.body;
    let lockedAt = 0;

    const lock = () => {
      lockedAt = window.scrollY;
      body.style.position = "fixed";
      body.style.top = `-${lockedAt}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
    };

    const unlock = () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, lockedAt);
    };

    const sync = () => (cb.checked ? lock() : unlock());

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !cb.checked) return;
      cb.checked = false;
      cb.dispatchEvent(new Event("change", { bubbles: true }));
    };

    cb.addEventListener("change", sync);
    document.addEventListener("keydown", onKey);
    return () => {
      cb.removeEventListener("change", sync);
      document.removeEventListener("keydown", onKey);
      unlock();
    };
  }, []);

  return null;
}

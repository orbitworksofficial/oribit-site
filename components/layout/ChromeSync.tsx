"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { chromeFor } from "@/lib/routes";

/**
 * Keeps the <body> template classes in sync with the current route on the
 * CLIENT.
 *
 * The root layout is a server component that reads the pathname from a request
 * header and stamps `<body className>` once. App-Router soft navigation does not
 * re-run the root layout, so after a client-side navigation the body keeps the
 * FIRST page's classes — which is why e.g. Home → About left the body as
 * `nav-white` and the logo as the light (invisible-on-white) lockup.
 *
 * Re-applying chromeFor(pathname).body on every navigation fixes the logo colour,
 * the nav colour, and the per-template layout hooks. Dynamic runtime classes
 * (scrolling, mob-nav, …) live on <html>, not <body>, so replacing body.className
 * is safe.
 */
export default function ChromeSync() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    const next = chromeFor(pathname).body;
    if (document.body.className !== next) document.body.className = next;
  }, [pathname]);

  return null;
}

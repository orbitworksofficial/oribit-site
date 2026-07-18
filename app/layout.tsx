import type { Metadata } from "next";
import { headers } from "next/headers";

/*
 * CSS order mirrors the original <head> and is load-bearing:
 *   wp-pre    — wp-img-auto-sizes + structured-content, before the theme
 *   theme     — the ported kenza-4.3.4 stylesheet
 *   wp-blocks — WordPress core block styles; these come AFTER the theme, which
 *               is what lets `img[class*=wp-image-]{max-width:100%}` win. Move
 *               them above the theme and every image overflows its column.
 *   base      — our tokens/overrides
 *   orbit     — OrbitWorks accent, last so it wins without !important
 */
import "./wp-pre.css";
import "./theme.css";
import "./wp-blocks.css";
import "./base.css";
import "./orbit.css";

import { ppMori } from "@/lib/fonts";
import { chromeFor } from "@/lib/routes";
import TransitionEngine from "@/components/animation/TransitionEngine";
import Nav from "@/components/layout/Nav";
import ContactFooter from "@/components/layout/ContactFooter";
import SiteFooter from "@/components/layout/SiteFooter";
import CookieBanner from "@/components/layout/CookieBanner";

/*
 * TODO: metadataBase must point at the real production origin before launch —
 * OG/twitter image URLs resolve against it.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://orbitworks.com"),
  title: {
    default: "OrbitWorks — Crafting Solutions With Purpose",
    template: "%s",
  },
  description:
    "A digital agency for cloud, software, data, AI and digital marketing. Strategy through delivery, in one team.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "OrbitWorks",
    title: "OrbitWorks — Crafting Solutions With Purpose",
    description:
      "A digital agency for cloud, software, data, AI and digital marketing. Strategy through delivery, in one team.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: { icon: "/brand/orbitworks-dark.png", apple: "/brand/orbitworks-dark.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000",
};

/**
 * Mirrors the theme's inline head script. The html element has to carry
 * `js apending` before first paint: the engine tags elements .ahide (opacity:0)
 * and `.apending` is what suppresses their transitions until it takes over.
 * Without this the page paints, then visibly re-hides on hydration.
 *
 * The existing className is preserved rather than replaced — next/font puts the
 * --font-sans class on <html>, and clobbering it drops PP Mori site-wide.
 */
const BOOT = `(function(d){var h=d.documentElement,c=['js','apending'];
if(h.className!=='')c.push(h.className);
if(window.chrome)c.push('chrome');h.className=c.join(' ');
d.addEventListener('DOMContentLoaded',function(){requestAnimationFrame(function(){h.className+=' js-ready'})});})(document);`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = (await headers()).get("x-pathname") ?? "/";
  const { body } = chromeFor(pathname);

  return (
    <html lang="en" className={ppMori.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body className={body}>
        <a id="top" className="top-link" />

        <Nav pathname={pathname} />

        {children}

        <CookieBanner />
        <ContactFooter />
        <SiteFooter />

        <TransitionEngine />
      </body>
    </html>
  );
}

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
import "./services-hub.css";
// Vivacity-inspired restyle — loaded last so its tokens win. Revert this import
// plus lib/fonts.ts to return to the previous theme.
import "./vivacity.css";
// Page background finish (dot grid + brand wash) — delete this import + the file to remove.
import "./page-bg.css";
// Constellation canvas backdrop — delete this import + <ParticleBackground/> to remove.
import "./particles.css";

import { ppMori, outfit } from "@/lib/fonts";
import { chromeFor } from "@/lib/routes";
import TransitionEngine from "@/components/animation/TransitionEngine";
import Nav from "@/components/layout/Nav";
import ChromeSync from "@/components/layout/ChromeSync";
import SiteLoader from "@/components/layout/SiteLoader";
import ParticleBackground from "@/components/layout/ParticleBackground";
import ContactFooter from "@/components/layout/ContactFooter";
import SiteFooter from "@/components/layout/SiteFooter";
import CookieBanner from "@/components/layout/CookieBanner";

/*
 * TODO: metadataBase must point at the real production origin before launch —
 * OG/twitter image URLs resolve against it.
 */
const HOME_TITLE = "AI Automation and IT Services USA | Orbit Works";
const HOME_DESC =
  "Orbit Works delivers AI automation, digital marketing, cloud solutions, and IT talent for US businesses ready to scale. Start with a free discovery call.";

export const metadata: Metadata = {
  metadataBase: new URL("https://orbitworks.com"),
  title: {
    default: HOME_TITLE,
    template: "%s",
  },
  description: HOME_DESC,
  keywords: [
    "AI Automation and IT Services USA",
    "IT services company USA",
    "AI automation",
    "cloud solutions",
    "digital marketing",
    "staff augmentation",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Orbit Works",
    title: HOME_TITLE,
    description: HOME_DESC,
  },
  twitter: { card: "summary_large_image", title: HOME_TITLE, description: HOME_DESC },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg", apple: "/brand/orbitworks-dark.png" },
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
    <html
      lang="en"
      className={`${outfit.variable} ${ppMori.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body className={body}>
        <ParticleBackground />
        <SiteLoader />
        <ChromeSync />
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

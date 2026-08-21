import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";

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

/*
 * Only Outfit is applied. PP Mori is still exported from lib/fonts.ts, but
 * nothing resolves var(--font-mori) while the Vivacity restyle is active — and
 * merely applying its `.variable` class shipped all 14 self-hosted faces
 * (~700KB per page) for type that never renders. Re-add `ppMori` here and to
 * the className below if you revert the restyle.
 */
import { outfit } from "@/lib/fonts";
import { chromeFor } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";
import TransitionEngine from "@/components/animation/TransitionEngine";
import Nav from "@/components/layout/Nav";
import ChromeSync from "@/components/layout/ChromeSync";
import StructuredData from "@/components/layout/StructuredData";
import PageSchema from "@/components/layout/PageSchema";
import Analytics from "@/components/layout/Analytics";
import NavDrawer from "@/components/layout/NavDrawer";
import SiteLoader from "@/components/layout/SiteLoader";
import ParticleBackground from "@/components/layout/ParticleBackground";
import ContactFooter from "@/components/layout/ContactFooter";
import SiteFooter from "@/components/layout/SiteFooter";
import CookieBanner from "@/components/layout/CookieBanner";

/*
 * TODO: metadataBase must point at the real production origin before launch —
 * OG/twitter image URLs resolve against it.
 */
const HOME_TITLE = "AI Automation & IT Services Company in USA | Orbit Works";
const HOME_DESC =
  "Orbit Works delivers AI automation, digital marketing, cloud solutions, and IT talent for US businesses ready to scale. Start with a free discovery call.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    // og:url was the one Open Graph tag the SEO audit flagged as missing.
    url: SITE_URL,
    locale: "en_US",
    siteName: "Orbit Works",
    title: HOME_TITLE,
    description: HOME_DESC,
  },
  /**
   * `summary`, not `summary_large_image`: the share card is square now (see
   * opengraph-image.tsx), and summary_large_image would crop it to 2:1 and cut
   * the logo. summary renders a square thumbnail, which is what the card is.
   */
  twitter: { card: "summary", title: HOME_TITLE, description: HOME_DESC },
  robots: { index: true, follow: true },
  /**
   * Meta (Facebook) domain verification. Proves we own orb-itworks.com so the
   * Business Manager account can claim it — needed before Meta will attribute
   * conversions from the pixel, and before Aggregated Event Measurement can be
   * configured for iOS traffic.
   *
   * Emitted through Next's `verification.other` rather than a hand-written
   * <meta> tag: the App Router owns <head>, and a manual tag there caused a
   * hydration mismatch on this site once already.
   */
  verification: {
    other: {
      "facebook-domain-verification": "smkixormx3b3r8vu8fvs9w6p9zhwwm",
    },
  },
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
function ready(){requestAnimationFrame(function(){
  if(h.className.indexOf('js-ready')<0)h.className+=' js-ready';});}
/*
 * readyState is checked BEFORE falling back to the event. next/script injects
 * this tag rather than inlining it in the source, so on a warm/cached load it
 * can execute after DOMContentLoaded has already fired — and a listener added
 * then never runs. That is exactly what broke the homepage hero: theme.css
 * holds [data-video] video.preview at opacity:0 until html.js-ready, so the
 * video loaded and played invisibly behind a blank section.
 */
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',ready);else ready();})(document);`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = (await headers()).get("x-pathname") ?? "/";
  const { body } = chromeFor(pathname);

  /**
   * The admin panel is a different application that happens to share a domain.
   * It gets none of the marketing chrome: no nav, no footer, no cookie banner,
   * no particle canvas, no loader, and none of the transition engine — those
   * exist for the public site and only get in the way of a CMS. It also skips
   * the Organization JSON-LD and analytics, neither of which belongs on a
   * signed-in admin screen.
   */
  const isAdmin = pathname.startsWith("/admin");

  /**
   * The AEO/GEO landing page is a self-contained campaign page opened in its own
   * tab from the Products dropdown. It ships its own header, hero and footer on
   * a dark canvas, so the marketing chrome would duplicate the nav and bolt a
   * light footer onto the bottom of a black page. It keeps the JSON-LD and
   * analytics above — unlike /admin, this one is a public, indexable page.
   */
  const isBareLanding = pathname.startsWith("/products/aeo-geo");

  return (
    <html
      lang="en"
      className={outfit.variable}
      suppressHydrationWarning
    >
      {/*
        No hand-written <head>. The App Router builds and owns that element, and
        hoists <script>/<link>/JSON-LD rendered anywhere in the tree into it. A
        manual <head> made React's client tree disagree with the server's about
        which node came first, which surfaced as a hydration mismatch pointing at
        the first <body> child (ParticleBackground vs <meta charset>).

        next/script with beforeInteractive rather than a raw <script> tag for the
        same reason the docs give: React never executes a script rendered as a
        child component on the client. beforeInteractive is the supported way to
        run something in the root layout ahead of hydration — see BOOT above.
      */}
      <body className={isAdmin ? "adm-body" : isBareLanding ? "aeo-body" : body}>
        {!isAdmin && (
          <Script id="orbit-boot" strategy="beforeInteractive">
            {BOOT}
          </Script>
        )}
        {/*
          JSON-LD lives in the body, which is what the Next docs recommend for
          the App Router ("render structured data as a <script> tag in your
          layout.js or page.js"). Google reads ld+json from either <head> or
          <body>, so nothing is lost by not forcing it upward.
        */}
        {!isAdmin && <StructuredData />}
        {/*
          Per-page JSON-LD authored in the dashboard (Page SEO -> Schema
          markup). Emitted here rather than in each of the thirteen pages
          because the layout already resolves the pathname, and pageSchema()
          returns null for any route without a stored value. Blog posts carry
          their own, added in app/blogs/[slug]/page.tsx.
        */}
        {!isAdmin && !pathname.startsWith("/blogs/") && <PageSchema path={pathname} />}

        {isAdmin || isBareLanding ? (
          <>
            {children}
            {!isAdmin && <Analytics />}
          </>
        ) : (
          <>
            <ParticleBackground />
            <SiteLoader />
            <ChromeSync />
            <NavDrawer />
            <a id="top" className="top-link" />

            <Nav pathname={pathname} />

            {children}

            <CookieBanner />
            <ContactFooter />
            <SiteFooter />

            <TransitionEngine />
            <Analytics />
          </>
        )}
      </body>
    </html>
  );
}

/**
 * Per-route page chrome for OrbitWorks.
 *
 * The `body` classes are the Kenza theme's own template hooks and are NOT
 * cosmetic — theme.css scopes 179 rules to .service, 153 to .case, 88 to
 * .science and 17 to .contact-template. Each route reuses the template whose
 * layout it wants:
 *
 *   classic          general content page
 *   services         the services index treatment
 *   contact-template the contact treatment
 *
 * `nav` is the header colour modifier: white over a dark hero, black over a
 * light page. It is a separate axis from the body class — the theme's own
 * /services page is nav-black in body yet renders `header` with no modifier,
 * which is why this is data rather than derived.
 */

export type RouteChrome = {
  body: string;
  nav: string;
  selected: string | null;
  title: string;
  description: string;
  /** Pages with a video hero get the in-hero .fake-nav clone. */
  hero?: boolean;
};

const THEME = "wp-theme-kenza-4-3-4 wp-embed-responsive wp-singular page";

export const ROUTES: Record<string, RouteChrome> = {
  "/": {
    body: `home ${THEME} classic homepage nav-white`,
    nav: "white",
    selected: null,
    title: "OrbitWorks — Crafting Solutions With Purpose",
    description:
      "A digital agency for cloud, software, data, AI and digital marketing. Strategy through delivery, in one team.",
    hero: true,
  },
  "/about": {
    body: `${THEME} classic nav-black`,
    nav: "black",
    selected: "About",
    title: "About — OrbitWorks",
    description:
      "Who we are: 50 specialists across four offices, building for clients in 10+ countries.",
  },
  "/services": {
    body: `${THEME} services page-parent nav-black`,
    nav: "black",
    selected: "Services",
    title: "Services — OrbitWorks",
    description:
      "Digital marketing, software, AI, cloud and data. Thirteen services, one delivery team.",
  },
  "/products": {
    body: `${THEME} classic nav-black`,
    nav: "black",
    selected: "Products",
    title: "Products — OrbitWorks",
    description: "Vivalex and Vivalid — products in development at OrbitWorks.",
  },
  "/industries": {
    body: `${THEME} classic nav-black`,
    nav: "black",
    selected: "Industries",
    title: "Industries — OrbitWorks",
    description:
      "Manufacturing, healthcare, real estate, logistics, education, hospitality and more.",
  },
  "/case-studies": {
    body: `${THEME} classic page-parent nav-black`,
    nav: "black",
    selected: "Case Studies",
    title: "Case studies — OrbitWorks",
    description: "Selected work, and what it changed.",
  },
  "/resources": {
    body: `${THEME} classic nav-black`,
    nav: "black",
    selected: "Resources",
    title: "Resources — OrbitWorks",
    description: "Guides, checklists and templates from our delivery teams.",
  },
  "/blogs": {
    body: `${THEME} classic page-parent nav-black`,
    nav: "black",
    selected: "Blogs",
    title: "Blog — OrbitWorks",
    description: "Notes on digital marketing, AI, cloud and software delivery.",
  },
  "/contact": {
    body: `${THEME} contact-template nav-black`,
    nav: "black",
    selected: "Contact",
    title: "Contact — OrbitWorks",
    description: "Four offices, one inbox. Tell us what you are trying to move.",
  },
  // Not in the nav, but linked from the footer and the cookie banner.
  "/legal": {
    body: `privacy-policy ${THEME} classic nav-black`,
    nav: "black",
    selected: null,
    title: "Legal — OrbitWorks",
    description: "Privacy, cookies and company details for OrbitWorks.",
  },
};

const FALLBACK: RouteChrome = {
  body: `error404 ${THEME}`,
  nav: "black",
  selected: null,
  title: "Not found — OrbitWorks",
  description: "",
};

/**
 * Chrome for dynamic children (e.g. /blogs/<slug>). Without this they fall to
 * FALLBACK and render with the error404 body class — no nav colour, wrong
 * template — which is invisible until you notice the header is missing.
 */
const SECTION_CHROME: [prefix: string, chrome: RouteChrome][] = [
  [
    "/blogs/",
    {
      body: `${THEME} classic page-child nav-black`,
      nav: "black",
      selected: "Blogs",
      title: "OrbitWorks",
      description: "",
    },
  ],
];

export function chromeFor(pathname: string): RouteChrome {
  const key = pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
  if (ROUTES[key]) return ROUTES[key];

  for (const [prefix, chrome] of SECTION_CHROME) {
    if (key.startsWith(prefix)) return chrome;
  }
  return FALLBACK;
}

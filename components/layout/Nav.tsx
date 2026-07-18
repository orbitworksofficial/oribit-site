import Link from "next/link";
import { chromeFor } from "@/lib/routes";
import NavList from "./NavList";
import NavPosition from "./NavPosition";
import HeaderScroll from "./HeaderScroll";

/**
 * Header chrome.
 *
 * Markup order is deliberate: the #nav-toggle checkbox must precede
 * .logo / .nav-toggle-label / nav, because theme.css drives the mobile drawer
 * entirely off `#nav-toggle:checked ~ ...` sibling selectors. No JS opens it.
 *
 * On hero pages (body.nav-white) this fixed nav is invisible until you scroll —
 * the visible one is the .fake-nav clone inside the hero. See NavPosition and
 * VideoLoopHeader.
 */
export default function Nav({ pathname }: { pathname: string }) {
  const { nav, selected } = chromeFor(pathname);

  return (
    <>
      {/* Contact/Calendly panel opener — theme.css toggles it off :checked */}
      <input type="checkbox" id="main-form" className="form-opener" value="foo" readOnly />
      <input type="checkbox" id="nav-toggle" className="nav-toggle" />

      {/*
       * Opaque backing for the fixed header. The theme kept its logo legible
       * over scrolling content with mix-blend-mode:difference; a flat-colour PNG
       * can't, so without this the big deco-l headings bleed straight under the
       * logo. Hidden over the hero (transparent nav), shown on inner pages and
       * once scrolled past the hero — see .orbit-navbar-scrim in orbit.css.
       *
       * Must sit AFTER #nav-toggle so the `:checked ~` rule can reach it.
       */}
      <div className="orbit-navbar-scrim" aria-hidden="true" />

      <figure className="logo">
        <figcaption>OrbitWorks logo</figcaption>
      </figure>

      <label htmlFor="nav-toggle" className="nav-toggle-label">
        Toggle Navigation<i />
      </label>

      <nav className={`header ${nav}`}>
        <NavList selected={selected} />
      </nav>

      <div className="logo-link">
        <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
          OrbitWorks
        </Link>
      </div>

      <NavPosition />
      <HeaderScroll />
    </>
  );
}

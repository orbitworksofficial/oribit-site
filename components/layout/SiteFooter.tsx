import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import SocialIcon from "./SocialIcon";
import { SOCIAL, BRAND, OFFICES } from "@/lib/content";
import { SERVICE_BUCKETS } from "@/lib/services-data";
import { LEGAL_DOCS } from "@/lib/legal-data";

/**
 * Site footer — a four-column grid (brand · quick links · services · contact)
 * over a slim bottom bar. Columns are top-aligned; layout lives in the footer
 * block of app/vivacity.css.
 *
 * Link lists are plain <ul>s inside `.orbit-footer__links` sections (NOT <nav>):
 * the theme's global `nav:not(.social)` rule forces every <nav> to
 * position:fixed;top:0, which used to stack these columns at the top of the page.
 */
const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const tel = BRAND.phone.replace(/[^+\d]/g, "");

  return (
    <footer className="invert" data-transition="slideup">
      <div className="inner">
        <section className="col orbit-footer__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="orbit-footer__logo"
            src="/brand/orbitworks-full-light.png"
            alt="OrbitWorks"
            width={188}
            height={34}
          />
          <p className="orbit-footer__about">{BRAND.footerAbout}</p>
          <NewsletterForm />

          {/* Driven by SOCIAL in lib/content.ts, which also feeds the sameAs
            * list in StructuredData — so the footer and the schema can never
            * disagree about which profiles are ours. No heading: the marks are
            * self-explanatory, and each link carries its own aria-label so the
            * row is still labelled for a screen reader. */}
          {SOCIAL.length > 0 && (
            <ul className="orbit-footer__social">
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a
                    className={`orbit-social orbit-social--${s.cls}`}
                    target="_blank"
                    rel="noopener noreferrer me"
                    href={s.href}
                    /* The mark is aria-hidden, so the link needs its own name —
                       without this the row reads as six blank links. */
                    aria-label={s.label}
                    title={s.label}
                  >
                    <SocialIcon name={s.cls} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="col orbit-footer__links">
          <h4>Quick links</h4>
          <ul>
            {QUICK_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="col orbit-footer__links">
          <h4>Services</h4>
          <ul>
            {SERVICE_BUCKETS.map((b) => (
              <li key={b.slug}>
                <Link href={`/services#${b.slug}`}>{b.name}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="col orbit-footer__links orbit-footer__contact">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </li>
            <li>
              <a href={`tel:${tel}`}>{BRAND.phone}</a>
            </li>
          </ul>
          {/* Rendered from OFFICES rather than hardcoded — the two had already
            * drifted, and an SEO audit reported the address as missing. The
            * microdata gives crawlers a parseable NAP on every page. */}
          {OFFICES.map((o) => (
            <p
              className="orbit-footer__addr"
              key={o.city}
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              {o.street && (
                <>
                  <span itemProp="streetAddress">{o.street}</span>
                  <br />
                </>
              )}
              <span itemProp="addressLocality">{o.city}</span>
              {o.region && <>, <span itemProp="addressRegion">{o.region}</span></>}
              {o.postalCode && <> <span itemProp="postalCode">{o.postalCode}</span></>}
              <br />
              <span itemProp="addressCountry">{o.country}</span>
            </p>
          ))}

        </section>
      </div>

      <div className="footer">
        <div className="inner">
          <span className="orbit-footer__copy">
            &copy; {year} OrbitWorks. All rights reserved.
          </span>
          <ul className="orbit-footer__legal">
            {LEGAL_DOCS.map((d) => (
              <li key={d.slug}>
                <Link rel="nofollow" href={`/${d.slug}`}>
                  {d.navLabel}
                </Link>
              </li>
            ))}
            <li>
              <a href="#top">Back to top</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

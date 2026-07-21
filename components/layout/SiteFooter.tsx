import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { NAV_ITEMS } from "@/lib/nav";
import { SOCIAL, BRAND } from "@/lib/content";
import { SERVICE_BUCKETS } from "@/lib/services-data";
import { LEGAL_DOCS } from "@/lib/legal-data";

/**
 * The engine looks this up as `footer[data-transition="slideup"]`.
 * The empty middle column is intentional — it is the grid spacer the theme
 * relies on, and is hidden from assistive tech.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="invert" data-transition="slideup">
      <div className="inner">
        <section className="col" data-transition="slideup">
          <article>
            <p className="orbit-footer__about">{BRAND.footerAbout}</p>
            <NewsletterForm />
          </article>
        </section>

        <section className="col orbit-footer__links">
          {/* A <div>, not a <nav>: the theme's global `nav:not(.social)` rule
           * forces every <nav> to position:fixed;top:0, which was stacking these
           * footer columns at the top of the page. */}
          <div className="orbit-footer__nav">
            <h4>Quick links</h4>
            <ul className="orbit-footer__quick">
              <li>
                <Link href="/">Home</Link>
              </li>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="col orbit-footer__links">
          <div className="orbit-footer__nav">
            <h4>Services</h4>
            <ul>
              {SERVICE_BUCKETS.map((b) => (
                <li key={b.slug}>
                  <Link href={`/services#${b.slug}`}>{b.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="orbit-footer__contact">
            <h4>Contact</h4>
            <p>
              <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              <br />
              <a href={`tel:${BRAND.phone.replace(/[^+\d]/g, "")}`}>{BRAND.phone}</a>
              <br />
              <span>Global delivery centres</span>
            </p>
          </div>

          {/* Hidden until real handles exist — see SOCIAL in lib/content.ts. */}
          {SOCIAL.length > 0 && (
            <nav className="social">
              <h4>Follow our moves</h4>
              <ul>
                {SOCIAL.map((s, i) => (
                  <li key={s.href} className={`cl${i + 1} ${s.cls}`}>
                    <a target="_blank" rel="noopener noreferrer" href={s.href}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </section>
      </div>

      <div className="footer">
        <div className="inner">
          <section className="col copy">
            <div>
              &copy; {year} OrbitWorks. All rights reserved.
            </div>
          </section>

          <section className="col logo">
            <Link href="/" className="logo-mark">
              OrbitWorks
            </Link>
          </section>

          <section className="col legal">
            <ul className="label small">
              {LEGAL_DOCS.map((d, i) => (
                <li key={d.slug} className={`cl${i + 4}`}>
                  <Link rel="nofollow" href={`/${d.slug}`}>
                    {d.navLabel}
                  </Link>
                </li>
              ))}
              <li className="back-to-top">
                <a href="#top">Back to top</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </footer>
  );
}

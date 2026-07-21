import type { CSSProperties } from "react";
import ServiceNav from "./ServiceNav";
import { SERVICE_BUCKETS } from "@/lib/services-data";

/**
 * Services hub body — the sticky category nav followed by the four buckets, each
 * expanded into its full service cards (tagline, description, sub-services, who
 * it is for, key outcome). Bucket section ids are the sticky-nav targets; each
 * service card also carries its own id for deep links from elsewhere.
 */
export default function ServiceBuckets() {
  return (
    <>
      <ServiceNav
        items={SERVICE_BUCKETS.map((b) => ({ slug: b.slug, navLabel: b.navLabel }))}
      />

      {SERVICE_BUCKETS.map((b) => (
        <section
          key={b.slug}
          id={b.slug}
          className="orbit-svcbucket"
          style={{ "--bucket-accent": b.accent } as CSSProperties}
        >
          <header className="orbit-svcbucket__head">
            <div>
              <span className="orbit-svcbucket__eyebrow">Category</span>
              <h2 className="orbit-svcbucket__name">{b.name}</h2>
              <p className="orbit-svcbucket__tag">{b.taglineHub}</p>
            </div>
            <span className="orbit-svcbucket__count">
              {b.services.length}
              <i>{b.services.length === 1 ? "service" : "services"}</i>
            </span>
          </header>

          <div className="orbit-svccards">
            {b.services.map((s) => (
              <article key={s.slug} id={s.slug} className="orbit-svccard">
                <div className="orbit-svccard__main">
                  <span className="orbit-svccard__no">{s.no}</span>
                  <h3 className="orbit-svccard__title">{s.title}</h3>
                  <p className="orbit-svccard__tagline">{s.tagline}</p>
                  <p className="orbit-svccard__desc">{s.description}</p>
                  <span className="orbit-svccard__label">Sub-services</span>
                  <ul className="orbit-svccard__subs">
                    {s.subServices.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>

                <aside className="orbit-svccard__aside">
                  <div className="orbit-svccard__block">
                    <span className="orbit-svccard__label">Who it is for</span>
                    <p>{s.who}</p>
                  </div>
                  <div className="orbit-svccard__block orbit-svccard__outcome">
                    <span className="orbit-svccard__label">Key outcome</span>
                    <p>{s.outcome}</p>
                  </div>
                </aside>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

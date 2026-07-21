import type { LegalDoc as Doc } from "@/lib/legal-data";

/**
 * Renders a legal document (see lib/legal-data) as a readable, single-column
 * policy page: a dark title band, an intro, then numbered sections whose blocks
 * are paragraphs, sub-headings, bullet lists, callout boxes or a table.
 */
export default function LegalDoc({ doc }: { doc: Doc }) {
  return (
    <main>
      <div
        className="wp-block-kenza-column-constraint column-constraint cols-12"
        data-transition="slideup"
        data-transition-include="through"
      >
        <div className="orbit-legal__hero">
          <span className="orbit-eyebrow">Orbit Works LLC</span>
          <h1 className="orbit-legal__title">{doc.title}</h1>
          <p className="orbit-legal__subtitle">{doc.subtitle}</p>
          <p className="orbit-legal__effective">{doc.effective}</p>
        </div>
      </div>

      <div className="wp-block-kenza-column-constraint column-constraint cols-12" data-transition="slideup">
        <div className="orbit-legal">
          {doc.intro.map((p, i) => (
            <p key={i} className="orbit-legal__intro">
              {p}
            </p>
          ))}

          {doc.sections.map((s) => (
            <section key={s.no} className="orbit-legal__section">
              <h2 className="orbit-legal__heading">
                <span className="orbit-legal__no">{s.no}</span>
                {s.title}
              </h2>
              {s.blocks.map((b, i) => {
                switch (b.type) {
                  case "p":
                    return (
                      <p key={i} className="orbit-legal__p">
                        {b.text}
                      </p>
                    );
                  case "sub":
                    return (
                      <h3 key={i} className="orbit-legal__sub">
                        {b.text}
                      </h3>
                    );
                  case "list":
                    return (
                      <ul key={i} className="orbit-legal__list">
                        {b.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    );
                  case "callout":
                    return (
                      <p key={i} className="orbit-legal__callout">
                        {b.text}
                      </p>
                    );
                  case "table":
                    return (
                      <div key={i} className="orbit-legal__tablewrap">
                        <table className="orbit-legal__table">
                          <thead>
                            <tr>
                              {b.head.map((h) => (
                                <th key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {b.rows.map((row, r) => (
                              <tr key={r}>
                                {row.map((cell, c) => (
                                  <td key={c}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                }
              })}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

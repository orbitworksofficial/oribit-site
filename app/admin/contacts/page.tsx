import { requireUserPage } from "@/lib/auth";
import { listContacts } from "@/lib/contacts";
import { isMailConfigured } from "@/lib/mail";
import { deleteContactAction, setContactHandledAction } from "../actions";

export const dynamic = "force-dynamic";

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ContactsIndex() {
  await requireUserPage();
  const rows = await listContacts();
  const open = rows.filter((r) => !r.handled).length;
  const failed = rows.filter((r) => !r.emailed).length;

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Enquiries</h1>
          <p>
            Everything submitted through the contact form. Stored here first, then emailed — so a
            mail problem can never lose one.
          </p>
        </div>
      </div>

      {!isMailConfigured() && (
        <div className="adm-banner adm-banner--error">
          SMTP is not configured, so no notification emails are being sent. Enquiries are still
          being saved and listed below.
        </div>
      )}

      <div className="adm-stats">
        <div className="adm-stat">
          <strong>{rows.length}</strong>
          <span>Total</span>
        </div>
        <div className="adm-stat">
          <strong>{open}</strong>
          <span>Needs reply</span>
        </div>
        {failed > 0 && (
          <div className="adm-stat">
            <strong>{failed}</strong>
            <span>Email failed</span>
          </div>
        )}
      </div>

      <div className="adm-card">
        {rows.length === 0 ? (
          <div className="adm-empty">
            No enquiries yet. Submissions to the contact form will appear here.
          </div>
        ) : (
          <div className="adm-tablewrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Received</th>
                  <th>From</th>
                  <th>Service</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={r.handled ? { opacity: 0.55 } : undefined}>
                    <td style={{ whiteSpace: "nowrap" }}>{when(r.createdAt)}</td>
                    <td>
                      <strong>{r.name}</strong>
                      <br />
                      {/* mailto so a reply is one click from the dashboard. */}
                      <a className="adm-btn--link" href={`mailto:${r.email}`}>
                        {r.email}
                      </a>
                      {r.company && (
                        <>
                          <br />
                          <span className="adm-sub">{r.company}</span>
                        </>
                      )}
                    </td>
                    <td>{r.service || <span className="adm-sub">—</span>}</td>
                    <td style={{ maxWidth: 420, whiteSpace: "pre-wrap" }}>{r.message}</td>
                    <td>
                      {r.handled ? (
                        <span className="adm-pill adm-pill--published">Handled</span>
                      ) : (
                        <span className="adm-pill adm-pill--draft">Open</span>
                      )}
                      {!r.emailed && (
                        <>
                          <br />
                          <span
                            className="adm-pill adm-pill--archived"
                            title={r.emailError ?? "Notification not sent"}
                          >
                            Email failed
                          </span>
                        </>
                      )}
                    </td>
                    <td>
                      <div className="adm-actions">
                        <form action={setContactHandledAction}>
                          <input type="hidden" name="id" value={r.id} />
                          <input type="hidden" name="handled" value={r.handled ? "0" : "1"} />
                          <button className="adm-btn adm-btn--sm adm-btn--ghost" type="submit">
                            {r.handled ? "Reopen" : "Mark handled"}
                          </button>
                        </form>
                        <form action={deleteContactAction}>
                          <input type="hidden" name="id" value={r.id} />
                          <button className="adm-btn adm-btn--sm adm-btn--ghost" type="submit">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

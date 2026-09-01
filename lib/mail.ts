import "server-only";

import nodemailer from "nodemailer";

/**
 * Outbound mail, over the domain's own Hostinger mailbox.
 *
 * Hostinger rather than a transactional provider (Resend, SendGrid) because the
 * domain's SPF record already authorises it:
 *
 *   v=spf1 include:_spf.mail.hostinger.com ~all
 *
 * so mail from this mailbox authenticates today, with no sending-domain
 * verification step and no extra DNS. The site being hosted on Vercel makes no
 * difference — this is an ordinary outbound SMTP connection.
 *
 * NOT for bulk mail. Hostinger caps outbound volume per plan; this is sized for
 * enquiry notifications, not newsletters.
 */

const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT ?? 465);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASSWORD;
const FROM = process.env.SMTP_FROM ?? USER;
const TO = process.env.SMTP_TO ?? USER;

/** Whether SMTP is configured — lets callers degrade instead of throwing. */
export function isMailConfigured(): boolean {
  return Boolean(HOST && USER && PASS);
}

/**
 * One transporter per container, cached on globalThis.
 *
 * Same reasoning as the Mongo client: module scope is re-evaluated on every
 * edit in development, and a new transporter per reload leaks connections.
 * `pool` keeps a single SMTP connection alive across the invocations a warm
 * container serves, rather than reconnecting and re-authenticating each time.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mailTransport: nodemailer.Transporter | undefined;
}

function transport(): nodemailer.Transporter {
  if (!global._mailTransport) {
    global._mailTransport = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      // 465 is implicit TLS; 587 upgrades via STARTTLS.
      secure: PORT === 465,
      auth: { user: USER, pass: PASS },
      pool: true,
      maxConnections: 2,
      /**
       * Fail fast. A serverless invocation that hangs on a stalled SMTP
       * handshake times out the whole request, so the visitor waits on a
       * notification they never see — the enquiry is already saved by then,
       * so giving up quickly costs nothing.
       */
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 12_000,
    });
  }
  return global._mailTransport;
}

/** Escape text interpolated into the HTML body. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type Enquiry = {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
};

/**
 * Notify the team about a new enquiry.
 *
 * Resolves to an error string rather than throwing: the caller has already
 * stored the enquiry, and a delivery failure must not turn a saved lead into
 * a 500 for the visitor. The string is recorded on the row so the failure is
 * visible in the dashboard.
 */
export async function sendEnquiryNotification(e: Enquiry): Promise<string | null> {
  if (!isMailConfigured()) return "SMTP is not configured";

  const rows: [string, string][] = [
    ["Name", e.name],
    ["Email", e.email],
    ["Company", e.company || "—"],
    ["Service", e.service || "Not specified"],
  ];

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nMessage:\n${e.message}\n`;

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;color:#111">
  <h2 style="margin:0 0 16px;font-size:18px">New enquiry from orb-itworks.com</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:4px 16px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`,
      )
      .join("")}
  </table>
  <div style="padding:14px 16px;background:#f6f7f9;border-radius:8px;white-space:pre-wrap">${esc(e.message)}</div>
</div>`;

  try {
    await transport().sendMail({
      from: FROM,
      to: TO,
      /**
       * Reply-To is the enquirer, so hitting reply in the mailbox answers the
       * customer rather than the site's own mailbox. The From stays our
       * authenticated address — sending as the visitor's domain would fail
       * SPF/DMARC and land in spam.
       */
      replyTo: `${e.name} <${e.email}>`,
      subject: `New enquiry: ${e.name}${e.company ? ` (${e.company})` : ""}`,
      text,
      html,
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : "Unknown SMTP error";
  }
}

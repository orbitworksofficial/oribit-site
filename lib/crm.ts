import "server-only";

/**
 * Forwards website enquiries to the Orbit Works CRM.
 *
 * The enquiry is stored in Mongo first and this runs afterwards, for the same
 * reason the notification email does: the database row is the record, and the
 * CRM is a second home for it. A CRM outage, a rotated secret or a network
 * blip must never turn a real lead into a lost one.
 *
 * Why forward at all: leads from Meta Lead Ads already land in the CRM, so a
 * website enquiry that stops at Mongo is invisible beside them — the sales
 * team has to watch two places, and the automated email follow-up the CRM
 * triggers never fires for it.
 */

const CRM_URL = process.env.CRM_LEADS_URL;
const CRM_SECRET = process.env.CRM_LEAD_INTAKE_SECRET;

/** Matches the CRM's own cap, so a value is never truncated server-side. */
const MESSAGE_MAX = 5000;

/**
 * Maps a service picked on this site to the CRM's catalogue slug.
 *
 * The two vocabularies grew separately: the site sells "AI automation" while
 * the CRM tracks "AI Chatbot Development". An unmapped slug is not an error —
 * the CRM ignores one it does not recognise and still records the lead — but
 * the service tag is what makes "which services do enquiries ask for" answer
 * anything, so it is worth keeping aligned.
 *
 * Anything absent here is sent through as-is, on the chance the CRM has since
 * gained a matching slug.
 */
const SERVICE_SLUG_MAP: Record<string, string> = {
  // "Digital marketing" on the site covers several CRM services (SEO, social,
  // paid). Tagging it as any one of them would be a guess, so it maps to
  // marketing-automation as the closest umbrella and whoever picks the lead up
  // narrows it from the message.
  "digital-marketing": "marketing-automation",
  "ai-automation": "ai-chatbot-development",
  "software-development": "custom-software",
  "product-development": "custom-software",
  "web-development": "web-development",
  "mobile-development": "custom-software",
  "cloud-infrastructure": "custom-software",
  "cloud-modernisation": "custom-software",
  "data-ai": "ai-chatbot-development",
  "it-consulting": "custom-software",
  "website-maintenance": "web-development",
  crm: "custom-software",
};

export interface CrmForwardInput {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}

export type CrmForwardResult =
  | { ok: true; contactId: string }
  | { ok: false; error: string };

/** Whether forwarding is configured. Absent config is a no-op, not a failure. */
export function isCrmConfigured(): boolean {
  return Boolean(CRM_URL && CRM_SECRET);
}

export async function forwardEnquiryToCrm(
  input: CrmForwardInput,
): Promise<CrmForwardResult> {
  if (!CRM_URL || !CRM_SECRET) {
    return { ok: false, error: "CRM_LEADS_URL or CRM_LEAD_INTAKE_SECRET is not set" };
  }

  const serviceSlug = input.service
    ? (SERVICE_SLUG_MAP[input.service] ?? input.service)
    : null;

  const payload = {
    full_name: input.name,
    email: input.email,
    // The CRM drops empty strings, but sending null is clearer about intent.
    company_name: input.company || null,
    message: input.message.slice(0, MESSAGE_MAX),
    // The slug is the contract: the CRM resolves the source by it, so renaming
    // the display label in its settings cannot break this.
    source: "website_form",
    services: serviceSlug ? [serviceSlug] : [],
    utm_source: "website",
    utm_medium: "organic",
  };

  try {
    const res = await fetch(CRM_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-orbit-lead-secret": CRM_SECRET,
      },
      body: JSON.stringify(payload),
      /**
       * Short, and deliberately so. This runs inside the visitor's request, so
       * a slow CRM would hold up the "thanks, we'll be in touch" they are
       * waiting for. Ten seconds is generous for a single insert; past that,
       * recording the failure and moving on serves them better.
       */
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
      /**
       * Do NOT follow redirects.
       *
       * A wrong path on the CRM is caught by its auth middleware and answered
       * with a 307 to /login, which fetch would follow to a page that returns
       * 200 — so a misconfigured URL reported success for a lead that was never
       * created. Treating the redirect itself as the response makes that
       * failure visible instead.
       */
      redirect: "manual",
    });

    // A redirect means the request never reached the intake endpoint.
    if (res.status >= 300 && res.status < 400) {
      return {
        ok: false,
        error: `CRM redirected (${res.status}) — check CRM_LEADS_URL points at /api/leads`,
      };
    }

    const body = (await res.json().catch(() => null)) as
      | { contact_id?: string; error?: string }
      | null;

    if (!res.ok) {
      return { ok: false, error: body?.error ?? `CRM returned ${res.status}` };
    }

    // A 2xx without an id means something answered that was not the intake
    // endpoint. Recording success here would hide a lead that does not exist.
    if (!body?.contact_id) {
      return { ok: false, error: "CRM accepted the request but returned no contact id" };
    }

    return { ok: true, contactId: body.contact_id };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown error";
    return { ok: false, error: `Could not reach the CRM: ${reason}` };
  }
}

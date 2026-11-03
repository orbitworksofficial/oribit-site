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
 * Keyed on the exact dropdown TITLE, because that is what the form posts —
 * SERVICE_TITLES is a flat list of `title` strings, not slugs. An earlier
 * version keyed on slugs and silently matched nothing, so every enquiry
 * reached the CRM with no service tag at all.
 *
 * The two vocabularies grew separately: the site sells "AI Automation and
 * GenAI" while the CRM tracks "AI Chatbot Development". Several site services
 * have no distinct CRM equivalent and share one, which is honest — the CRM
 * catalogue is coarser.
 *
 * An unmapped title is not an error: the CRM ignores a slug it does not
 * recognise and still records the lead, just without the tag.
 */
const SERVICE_SLUG_MAP: Record<string, string> = {
  "AI Automation and GenAI": "ai-chatbot-development",
  "Unified Revenue Dashboard and Analytics": "custom-software",
  "CRM Setup and Sales Pipeline Automation": "marketing-automation",
  "Paid Advertising Management": "meta-ads-management",
  // Spans SEO, content, email and WhatsApp. SEO is the closest single CRM
  // service; the message says which of them they actually want.
  "SEO, Content, Email and WhatsApp Marketing": "seo",
  "Cloud Migrations and Modernization": "custom-software",
  "Custom Website Development": "web-development",
  "Custom Mobile App Development": "custom-software",
  "Software and Product Development": "custom-software",
  "Power Platform and Dynamics 365": "custom-software",
  "IT Consulting and Strategy": "custom-software",
  "Website Maintenance and Support": "web-development",
  "Staff Augmentation and On-Demand IT Talent": "custom-software",
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

  const serviceSlug = input.service ? (SERVICE_SLUG_MAP[input.service] ?? null) : null;

  /**
   * The chosen service is repeated in the message as well as tagged.
   *
   * The tag is structured and reportable but coarse — several site services
   * map to one CRM slug — and an unrecognised one is dropped entirely. The
   * line of text always survives, so whoever picks the lead up can see what
   * they actually asked for rather than inferring it from a broad tag.
   */
  const message = input.service
    ? `Interested in: ${input.service}\n\n${input.message}`
    : input.message;

  const payload = {
    full_name: input.name,
    email: input.email,
    // The CRM drops empty strings, but sending null is clearer about intent.
    company_name: input.company || null,
    message: message.slice(0, MESSAGE_MAX),
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

/**
 * Conversion events pushed to the GTM dataLayer.
 *
 * Kept separate from lib/consent so the two concerns stay apart: consent
 * decides whether a tag may STORE anything, this decides what happened. GTM
 * reads both from the same `dataLayer` array.
 *
 * Nothing here talks to Meta or Google directly. The page announces the fact
 * ("a lead was submitted") and GTM decides which tags act on it — which is the
 * point of running a container at all: Meta's Lead event, a GA4 conversion, or
 * anything added later can be attached in the GTM dashboard with no redeploy.
 */

type DataLayerEvent = Record<string, unknown> & { event: string };

/**
 * Push an event, safely.
 *
 * `dataLayer` is a plain array until GTM's script defines its push handler, so
 * this works whether the container has loaded, is still loading, or was blocked
 * outright — pushing to the queue is exactly what Google's own snippet does.
 * When GTM is not configured at all the array simply grows and nothing reads
 * it, which is harmless.
 */
function push(payload: DataLayerEvent): void {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(payload);
}

/**
 * A contact enquiry was successfully submitted.
 *
 * Fired only after the API confirms success, never on button click: a click
 * fires even when the request fails validation or the network drops, which
 * would report leads that do not exist and train ad delivery on noise.
 *
 * `form_location` distinguishes the contact page's form from the one in the
 * site footer, so the two can be compared without needing separate events.
 *
 * No name, email, company or message is included. Meta's Lead event does not
 * need them, and passing personal data into a marketing tag is a consent and
 * privacy problem that this deliberately avoids — the fact of the conversion
 * is the whole payload.
 */
export function trackLead(formLocation: string): void {
  push({ event: "generate_lead", form_location: formLocation });
}

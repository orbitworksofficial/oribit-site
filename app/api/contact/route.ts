import { NextResponse } from "next/server";

import { getDb, isDbConfigured } from "@/lib/db";
import { sendEnquiryNotification } from "@/lib/mail";
import { COLLECTIONS, type ContactDoc } from "@/lib/models";
import {
  forwardEnquiryToCrm,
  isCrmConfigured,
  type CrmForwardResult,
} from "@/lib/crm";

/**
 * Enquiry endpoint for the contact form.
 *
 * Order matters: the enquiry is STORED first, then the notification is
 * attempted. Email is the convenience, the database row is the record — an
 * SMTP outage, a wrong password or a Hostinger rate limit must never turn a
 * real lead into a lost one. A failed send is recorded on the row and shown in
 * the dashboard rather than disappearing into a log line.
 *
 * This previously did neither: it validated, warned to the console and
 * returned success, so every enquiry submitted since launch was discarded
 * while the visitor was told "we'll be in touch shortly".
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trim, and cap length so a pasted essay cannot bloat a document. */
function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const name = field(body.name, 200);
  const email = field(body.email, 320);
  const company = field(body.company, 200);
  const service = field(body.service, 200);
  const message = field(body.message, 5000);

  if (!name || !EMAIL.test(email) || !message) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (!isDbConfigured()) {
    console.error("[contact] MONGODB_URI is not set — enquiry NOT saved:", email);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  const doc: ContactDoc = {
    name,
    email,
    ...(company ? { company } : {}),
    ...(service ? { service } : {}),
    message,
    emailed: false,
    handled: false,
    userAgent: request.headers.get("user-agent")?.slice(0, 400) ?? undefined,
    createdAt: new Date(),
  };

  let id;
  try {
    const db = await getDb();
    const res = await db.collection<ContactDoc>(COLLECTIONS.contacts).insertOne(doc);
    id = res.insertedId;
  } catch (err) {
    // Nothing was stored, so do NOT report success — the visitor needs to know
    // it did not go through rather than assume someone will reply.
    console.error("[contact] failed to store enquiry:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  /**
   * Awaited rather than fired and forgotten: a serverless container is frozen
   * the moment the response is returned, so a floating promise would be killed
   * mid-handshake and the mail silently never sent.
   *
   * The CRM forward runs alongside it, and in parallel because neither depends
   * on the other — the visitor should not wait for two round trips in sequence.
   */
  const [error, crm] = await Promise.all([
    sendEnquiryNotification({ name, email, company, service, message }),
    isCrmConfigured()
      ? forwardEnquiryToCrm({ name, email, company, service, message })
      : Promise.resolve<CrmForwardResult>({
          ok: false,
          error: "CRM forwarding is not configured",
        }),
  ]);

  if (error) {
    console.error("[contact] stored, but notification failed:", error);
  }

  // A CRM failure is logged and recorded, never surfaced: the enquiry is
  // already safe in Mongo, and the visitor has no stake in where else it goes.
  if (!crm.ok) {
    console.error("[contact] stored, but CRM forwarding failed:", crm.error);
  }

  try {
    const db = await getDb();
    await db.collection<ContactDoc>(COLLECTIONS.contacts).updateOne(
      { _id: id },
      {
        $set: {
          emailed: !error,
          ...(error ? { emailError: error } : {}),
          // Recorded on the row for the same reason as the email flags: a
          // failure that lives only in a log line is one nobody discovers.
          crmSynced: crm.ok,
          ...(crm.ok ? { crmContactId: crm.contactId } : { crmError: crm.error }),
        },
      },
    );
  } catch {
    // The enquiry is safe; only the delivery flags are stale. Not worth failing.
  }

  // The enquiry is stored, so this is a success from the visitor's side even
  // when the notification failed.
  return NextResponse.json({ success: true });
}

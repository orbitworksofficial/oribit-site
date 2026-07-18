import { NextResponse } from "next/server";

/**
 * Enquiry endpoint for the contact form.
 *
 * NOT WIRED UP: this validates and returns success without delivering anywhere.
 * Point it at a mailbox / CRM before launch, or enquiries are silently dropped.
 * The console warning is deliberate — it should be noisy until it is real.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const { name, email, message } = body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !EMAIL.test(email) ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // TODO: deliver to a real destination (CRM / transactional email).
  console.warn(`[contact] NOT DELIVERED — no provider configured. From: ${email}`);

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";

/**
 * Replaces the WordPress REST route /wp-json/kenza/v1/salesflare/submit, which
 * does not survive the migration.
 *
 * NOT WIRED UP: this validates the address and returns success without
 * forwarding anywhere. Point it at Salesflare (or whichever list you land on)
 * before launch, or signups will be silently dropped.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;

  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL.test(email)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // TODO: forward to Salesflare using a server-side API key.
  console.warn(`[newsletter] not forwarded — no provider configured: ${email}`);

  return NextResponse.json({ success: true });
}

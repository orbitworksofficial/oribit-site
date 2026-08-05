import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { saveUpload } from "@/lib/uploads";

/**
 * Image upload endpoint for the dashboard.
 *
 * A route handler rather than a Server Action because the editor uploads
 * mid-edit, without submitting the surrounding form, and needs the resulting
 * URL back to insert into the document.
 *
 * Authentication is checked here and not merely in the UI: this is a public
 * HTTP endpoint, and an unauthenticated upload route is an open file drop that
 * anyone could use to host arbitrary content on our domain.
 */
export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file received." }, { status: 400 });
  }

  const result = await saveUpload(file, user.id);
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }
  return NextResponse.json(result);
}

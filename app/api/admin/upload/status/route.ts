import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { usingCloudinary } from "@/lib/uploads";

/**
 * Upload configuration check, for diagnosing a failing upload without reading
 * server logs.
 *
 * Reports only whether each variable is PRESENT — never its value. A secret
 * echoed back over HTTP is a secret leaked, and the question being answered
 * here ("did the environment reach this build?") never needs the value itself.
 *
 * Signed in only: it describes the server's configuration, which is not
 * something to hand to anonymous callers.
 */
export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  const cloudinaryReady = usingCloudinary();

  return NextResponse.json({
    ok: true,
    storage: cloudinaryReady ? "cloudinary" : "local-disk",
    cloudinaryReady,
    present: {
      CLOUDINARY_URL: Boolean(process.env.CLOUDINARY_URL),
      CLOUDINARY_CLOUD_NAME: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
      CLOUDINARY_API_KEY: Boolean(process.env.CLOUDINARY_API_KEY),
      CLOUDINARY_API_SECRET: Boolean(process.env.CLOUDINARY_API_SECRET),
      NEXT_PUBLIC_GTM_ID: Boolean(process.env.NEXT_PUBLIC_GTM_ID),
      NEXT_PUBLIC_GA_ID: Boolean(process.env.NEXT_PUBLIC_GA_ID),
    },
    host: {
      vercel: Boolean(process.env.VERCEL),
      nodeEnv: process.env.NODE_ENV,
      allowLocalUploads: process.env.ALLOW_LOCAL_UPLOADS === "1",
    },
  });
}

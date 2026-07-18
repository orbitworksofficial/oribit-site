import { NextResponse, type NextRequest } from "next/server";

/**
 * The root layout owns <body>, but the body class is per-route and load-bearing
 * (theme.css scopes heavily to .service/.case/.science). Forwarding the pathname
 * as a request header lets the layout resolve it server-side, so the correct
 * class is in the first paint rather than patched on after hydration.
 */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|media|theme|favicon.ico).*)"],
};

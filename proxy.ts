import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { method, nextUrl } = request;
  const requestId = crypto.randomUUID();

  console.log(`[proxy] ${method} ${nextUrl.pathname} (${requestId})`);

  // Auth gate: protect /dashboard routes
  const isProtected = nextUrl.pathname.startsWith("/dashboard");
  const session = request.cookies.get("session")?.value;

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Stamp request ID header for downstream tracing
  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: ["/users/:path*", "/dashboard/:path*"],
};

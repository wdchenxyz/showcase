import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { method, nextUrl } = request;
  console.log(`[proxy] ${method} ${nextUrl.pathname}`);

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*", "/dashboard/:path*"],
};

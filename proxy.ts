import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { method, nextUrl } = request;
  console.log(`[proxy] ${method} ${nextUrl.pathname}`);

  // Protect /users/[id] — require ?token=secret
  if (nextUrl.pathname.match(/^\/users\/\d+$/)) {
    const token = nextUrl.searchParams.get("token");

    if (token !== "secret") {
      const url = nextUrl.clone();
      url.pathname = "/users";
      url.searchParams.delete("token");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*"],
};

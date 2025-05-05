import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken");

  // Exclude paths that don't require the middleware, such as styling or components
  // Redirect logic based on the token presence
  if (accessToken && url.pathname === "/login") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  } else if (!accessToken && url.pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/:path*"], // Define the paths where this middleware should run
};

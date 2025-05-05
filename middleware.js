import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const response = NextResponse.next();

  // Exclude Next.js specific paths and API calls
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/static/") ||
    url.pathname.startsWith("/api/")
  ) {
    return response;
  }

  const accessToken = request.cookies.get("accessToken");
  console.log(accessToken)
  // // Check if the user is already on the dashboard or home page to prevent redirection loops
  // if (url.pathname === "/app/dashboard" || url.pathname === "/") {
  //   return response;
  // }

  // Set the accessToken in the headers if it exists
  if (accessToken) {
    response.headers.set("Authorization", `Bearer ${accessToken}`);
    // User is authenticated, redirect to dashboard
  } else if (url.pathname.startsWith("/app/") && !accessToken) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/"], // Define the paths where this middleware should run
};

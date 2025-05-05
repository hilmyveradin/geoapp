import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Redirect authenticated users accessing the root path to /app/maps
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/app/maps", req.url));
  }

  // If the user is not authenticated and tries to access protected routes, redirect to /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/app/:path*"],
};

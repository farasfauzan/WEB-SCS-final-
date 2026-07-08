import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const COOKIE_NAME = "scs_admin_token";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not the login page)
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Only ADMIN role can access admin pages
  if (payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
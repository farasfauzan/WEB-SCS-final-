import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const COOKIE_NAME = "scs_admin_token";

/**
 * Map of old admin paths to their new locations.
 */
const REDIRECT_MAP = {
  "/admin/admin": "/admin/users",
  "/admin/project": "/admin/projects",
  "/admin/partner": "/admin/partners",
  "/admin/statistic": "/admin/statistics",
  "/admin/setting": "/admin/settings",
  "/api/project": "/api/projects",
  "/api/partner": "/api/partners",
  "/api/statistic": "/api/statistics",
  "/api/setting": "/api/settings",
};

/**
 * Check if a pathname matches an old prefix and redirect if so.
 */
function tryRedirect(pathname, request) {
  for (const [oldPrefix, newPrefix] of Object.entries(REDIRECT_MAP)) {
    if (pathname === oldPrefix || pathname.startsWith(oldPrefix + "/")) {
      const newPath = pathname.replace(oldPrefix, newPrefix);
      return NextResponse.redirect(new URL(newPath, request.url), 308);
    }
  }
  return null;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // --- Step 1: Redirect old paths (admin + API) to new ones ---
  const redirect = tryRedirect(pathname, request);
  if (redirect) return redirect;

  // --- Step 2: Only protect /admin routes (not the login page) ---
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  // --- Step 3: Check for auth token ---
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
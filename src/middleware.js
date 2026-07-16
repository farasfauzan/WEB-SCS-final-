import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const COOKIE_NAME = "scs_admin_token";

/**
 * Map of old admin/api paths to their new pluralized locations.
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
 * Mencegat rute lama dan mengalihkannya secara permanen (308) ke rute baru.
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

// KOREKSI UTAMA: Nama fungsi wajib "middleware", bukan "proxy"
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // --- Step 1: Redirect rute lama ke rute baru (Berlaku untuk Admin & API) ---
  const redirect = tryRedirect(pathname, request);
  if (redirect) return redirect;

  // --- Step 2: Bypass perlindungan untuk API dan halaman login ---
  // API tidak diproteksi di sini karena API memiliki proteksi JWT sendiri di route.js masing-masing
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  // --- Step 3: Pengecekan Token Sesi ---
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // --- Step 4: Verifikasi Kriptografi Token ---
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // --- Step 5: Otorisasi Role ---
  if (payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

// KOREKSI UTAMA: Matcher harus mencakup /api agar REDIRECT_MAP untuk API bisa bekerja
export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

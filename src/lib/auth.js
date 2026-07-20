import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "__REDACTED__"
);
const JWT_EXPIRES_IN = "24h";
const COOKIE_NAME = "scs_admin_token";

// In-memory rate limiter untuk login attempts
const loginAttempts = new Map();

const MAX_LOGIN_ATTEMPTS = 3;
const LOGIN_COOLDOWN_MS = 1 * 60 * 1000; // 1 menit

function cleanExpired() {
  const now = Date.now();
  for (const [key, data] of loginAttempts.entries()) {
    if (now > data.expiresAt) {
      loginAttempts.delete(key);
    }
  }
}

export function checkLoginRateLimit(username, ip) {
  cleanExpired();
  const key = `${username}:${ip}`;
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (record && now < record.expiresAt) {
    const remainingSeconds = Math.ceil((record.expiresAt - now) / 1000);
    return {
      allowed: false,
      remainingSeconds,
      attemptsLeft: 0,
    };
  }

  // Reset jika sudah lewat masa cooldown
  if (record && now >= record.expiresAt) {
    loginAttempts.delete(key);
  }

  return { allowed: true, remainingSeconds: 0, attemptsLeft: MAX_LOGIN_ATTEMPTS };
}

export function recordLoginAttempt(username, ip, success) {
  cleanExpired();
  const key = `${username}:${ip}`;
  const now = Date.now();
  
  if (success) {
    // Reset attempts jika berhasil login
    loginAttempts.delete(key);
    return;
  }

  // Catat attempt gagal
  const record = loginAttempts.get(key) || { count: 0, expiresAt: 0 };
  record.count += 1;
  
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.expiresAt = now + LOGIN_COOLDOWN_MS;
  }
  
  loginAttempts.set(key, record);
}

export function getRemainingAttempts(username, ip) {
  const key = `${username}:${ip}`;
  const record = loginAttempts.get(key);
  if (!record) return MAX_LOGIN_ATTEMPTS;
  // Jika sedang dalam cooldown, sisa percobaan = 0
  if (record.expiresAt > 0) return 0;
  return Math.max(0, MAX_LOGIN_ATTEMPTS - record.count);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function createAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export function getTokenFromRequest(request) {
  return request.cookies.get(COOKIE_NAME)?.value;
}

export async function getCurrentAdmin() {
  const token = await getAuthToken();
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return decoded;
}

export async function requireAuth(request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return await verifyToken(token);
}

export async function requireAdminRole(request) {
  const payload = await requireAuth(request);
  if (!payload) {
    return null;
  }
  return payload;
}

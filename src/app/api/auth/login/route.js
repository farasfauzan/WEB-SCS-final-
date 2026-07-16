import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  createToken,
  createAuthCookie,
  checkLoginRateLimit,
  recordLoginAttempt,
  getRemainingAttempts,
} from "@/lib/auth";

function getClientIP(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

function getUserAgent(request) {
  return request.headers.get("user-agent") || "";
}

async function createLog(action, username, adminId, ip, userAgent) {
  try {
    await prisma.adminLog.create({
      data: { adminId, username, action, ip, userAgent },
    });
  } catch (err) {
    console.error("Gagal mencatat log:", err.message);
  }
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password harus diisi" }, { status: 400 });
    }

    // Cek rate limit
    const rateCheck = checkLoginRateLimit(username, ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan login. Silakan coba lagi dalam ${rateCheck.remainingSeconds} detik.`,
          remainingSeconds: rateCheck.remainingSeconds,
        },
        { status: 429 }
      );
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      recordLoginAttempt(username, ip, false);
      await createLog("LOGIN_FAILED", username, null, ip, userAgent);
      const remaining = getRemainingAttempts(username, ip);
      return NextResponse.json(
        {
          error: `Username atau password salah. Sisa percobaan: ${remaining}`,
          attemptsLeft: remaining,
        },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      recordLoginAttempt(username, ip, false);
      await createLog("LOGIN_FAILED", username, admin.id, ip, userAgent);
      const remaining = getRemainingAttempts(username, ip);

      if (remaining <= 0) {
        return NextResponse.json(
          {
            error: "Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit.",
            remainingSeconds: 60,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Username atau password salah. Sisa percobaan: ${remaining}`,
          attemptsLeft: remaining,
        },
        { status: 401 }
      );
    }

    // Login berhasil — reset attempts
    recordLoginAttempt(username, ip, true);
    await createLog("LOGIN_SUCCESS", username, admin.id, ip, userAgent);

    const token = await createToken({ id: admin.id, username: admin.username, role: admin.role });
    await createAuthCookie(token);

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, username: admin.username, role: admin.role },
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan, silakan coba lagi" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken, createAuthCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password harus diisi" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
    }

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

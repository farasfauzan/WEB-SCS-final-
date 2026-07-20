import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, requireAdminRole, hashPassword } from "@/lib/auth";
import { saveApiError } from "@/lib/api-error-log";

export async function GET(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admins = await prisma.admin.findMany({
      select: { id: true, username: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ admins });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "GET", error });
    console.error("API /api/admin GET error:", error);
    return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const currentAdmin = await requireAdminRole(request);
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password harus diisi" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    // Check if username already exists
    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: "Username sudah digunakan" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: { id: true, username: true, createdAt: true },
    });

    return NextResponse.json({ admin }, { status: 201 });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "POST", error });
    console.error("API /api/admin POST error:", error);
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
  }
}

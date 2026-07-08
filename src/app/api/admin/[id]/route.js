import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole, hashPassword } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const admin = await prisma.admin.findUnique({
      where: { id: Number(id) },
      select: { id: true, username: true, role: true, createdAt: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ admin });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { username, password, role } = await request.json();

    if (!username) {
      return NextResponse.json({ error: "Username harus diisi" }, { status: 400 });
    }

    // Check if username already taken by another admin
    const existing = await prisma.admin.findUnique({ where: { username } });
    if (existing && existing.id !== Number(id)) {
      return NextResponse.json({ error: "Username sudah digunakan" }, { status: 409 });
    }

    const updateData = { username, role: role || "ADMIN" };

    // Only hash and update password if a new one is provided
    if (password && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
      }
      updateData.password = await hashPassword(password);
    }

    const admin = await prisma.admin.update({
      where: { id: Number(id) },
      data: updateData,
      select: { id: true, username: true, role: true, createdAt: true },
    });

    return NextResponse.json({ admin });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update admin" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const currentAdmin = await requireAdminRole(request);
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Prevent deleting yourself
    if (currentAdmin.id === Number(id)) {
      return NextResponse.json({ error: "Tidak dapat menghapus akun sendiri" }, { status: 400 });
    }

    // Prevent deleting the last admin
    const adminCount = await prisma.admin.count();
    if (adminCount <= 1) {
      return NextResponse.json({ error: "Tidak dapat menghapus admin terakhir" }, { status: 400 });
    }

    await prisma.admin.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const about = await prisma.about.findUnique({ where: { id: Number(id) } });
    if (!about) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ about });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch about" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    const about = await prisma.about.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json({ about });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update about" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.about.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete about" }, { status: 500 });
  }
}

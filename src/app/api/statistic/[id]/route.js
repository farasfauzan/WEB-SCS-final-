import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const statistic = await prisma.statistic.findUnique({ where: { id: Number(id) } });
    if (!statistic) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ statistic });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch statistic" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const data = await request.json();
    const statistic = await prisma.statistic.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json({ statistic });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update statistic" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await prisma.statistic.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete statistic" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status ? { status } : {};
    const news = await prisma.news.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ news });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const news = await prisma.news.create({ data });
    return NextResponse.json({ news }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}

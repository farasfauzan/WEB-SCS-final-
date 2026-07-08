import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const where = page ? { page } : {};
    const heroes = await prisma.hero.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ heroes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch heroes" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const hero = await prisma.hero.create({ data });
    return NextResponse.json({ hero }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create hero" }, { status: 500 });
  }
}

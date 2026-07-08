import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";

export async function GET() {
  try {
    const abouts = await prisma.about.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ abouts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch abouts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const about = await prisma.about.create({ data });
    return NextResponse.json({ about }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create about" }, { status: 500 });
  }
}

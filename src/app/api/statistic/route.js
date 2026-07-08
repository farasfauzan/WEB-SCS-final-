import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";

export async function GET() {
  try {
    const statistics = await prisma.statistic.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json({ statistics });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    const statistic = await prisma.statistic.create({ data });
    return NextResponse.json({ statistic }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create statistic" }, { status: 500 });
  }
}

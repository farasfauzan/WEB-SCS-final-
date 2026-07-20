import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { saveApiError } from "@/lib/api-error-log";

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ partners });
  } catch (error) {
    await saveApiError({ route: "/api/partners", method: "GET", error });
    console.error("API /api/partners GET error:", error);
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const partner = await prisma.partner.create({ data });
    return NextResponse.json({ partner }, { status: 201 });
  } catch (error) {
    await saveApiError({ route: "/api/partners", method: "POST", error });
    console.error("API /api/partners POST error:", error);
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
  }
}

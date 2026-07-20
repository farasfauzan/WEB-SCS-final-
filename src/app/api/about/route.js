import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { saveApiError } from "@/lib/api-error-log";

export async function GET() {
  try {
    const abouts = await prisma.about.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ abouts });
  } catch (error) {
    await saveApiError({ route: "/api/about", method: "GET", error });
    console.error("API /api/about GET error:", error);
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
    await saveApiError({ route: "/api/about", method: "POST", error });
    console.error("API /api/about POST error:", error);
    return NextResponse.json({ error: "Failed to create about" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { saveApiError } from "@/lib/api-error-log";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json({ contacts });
  } catch (error) {
    await saveApiError({ route: "/api/contact", method: "GET", error });
    console.error("API /api/contact GET error:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const contact = await prisma.contact.create({ data });
    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    await saveApiError({ route: "/api/contact", method: "POST", error });
    console.error("API /api/contact POST error:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}

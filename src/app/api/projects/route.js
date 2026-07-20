import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { saveApiError } from "@/lib/api-error-log";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where = category && category !== "Semua" ? { category } : {};
    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ projects });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "GET", error });
    console.error("API /api/projects GET error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    // Ensure galleryImages is always an array of JSON strings (store url + caption)
    const createData = {
      ...data,
      galleryImages: (data.galleryImages || []).map((item) =>
        typeof item === "string"
          ? item
          : JSON.stringify({ url: item.url || "", caption: item.caption || "" })
      ),
    };
    const project = await prisma.project.create({ data: createData });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "POST", error });
    console.error("API /api/projects POST error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

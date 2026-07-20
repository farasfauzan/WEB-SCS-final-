import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { handleImageChange, deleteCloudinaryImage } from "@/lib/cloudinary-server";
import { decodeId } from "@/lib/encode-id";
import { saveApiError } from "@/lib/api-error-log";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const realId = decodeId(id);
    if (realId === null || realId === 0) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const project = await prisma.project.findUnique({ where: { id: Number(realId) } });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "GET", error });
    console.error("API /api/projects/[id] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const realId = decodeId(id);
    if (realId === null || realId === 0) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const data = await request.json();

    // 🔥 If imageUrl is being updated, delete the old Cloudinary image
    if (data.imageUrl) {
      const existing = await prisma.project.findUnique({ where: { id: Number(realId) } });
      if (existing?.imageUrl) {
        await handleImageChange(existing.imageUrl, data.imageUrl);
      }
    }

    // Ensure galleryImages is always an array of JSON strings (store url + caption)
    const updateData = {
      ...data,
      galleryImages: (data.galleryImages || []).map((item) =>
        typeof item === "string"
          ? item
          : JSON.stringify({ url: item.url || "", caption: item.caption || "" })
      ),
    };

    const project = await prisma.project.update({
      where: { id: Number(realId) },
      data: updateData,
    });
    return NextResponse.json({ project });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "PUT", error });
    console.error("API /api/projects/[id] PUT error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const realId = decodeId(id);
    if (realId === null || realId === 0) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    // 🔥 Delete associated Cloudinary image before deleting the record
    const existing = await prisma.project.findUnique({ where: { id: Number(realId) } });
    if (existing?.imageUrl) {
      await deleteCloudinaryImage(existing.imageUrl);
    }

    await prisma.project.delete({ where: { id: Number(realId) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "DELETE", error });
    console.error("API /api/projects/[id] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

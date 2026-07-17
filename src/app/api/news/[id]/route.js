import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { handleImageChange, deleteCloudinaryImage } from "@/lib/cloudinary-server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const news = await prisma.news.findUnique({ where: { id: Number(id) } });
    if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ news });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // 🔥 If imageUrl is being updated, delete the old Cloudinary image
    if (data.imageUrl) {
      const existing = await prisma.news.findUnique({ where: { id: Number(id) } });
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

    const news = await prisma.news.update({
      where: { id: Number(id) },
      data: updateData,
    });
    return NextResponse.json({ news });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // 🔥 Delete associated Cloudinary image before deleting the record
    const existing = await prisma.news.findUnique({ where: { id: Number(id) } });
    if (existing?.imageUrl) {
      await deleteCloudinaryImage(existing.imageUrl);
    }

    await prisma.news.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}

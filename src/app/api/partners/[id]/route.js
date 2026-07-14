import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { handleImageChange, deleteCloudinaryImage } from "@/lib/cloudinary-server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const partner = await prisma.partner.findUnique({ where: { id: Number(id) } });
    if (!partner) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ partner });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch partner" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const data = await request.json();

    // 🔥 If logoUrl is being updated, delete the old Cloudinary image
    if (data.logoUrl) {
      const existing = await prisma.partner.findUnique({ where: { id: Number(id) } });
      if (existing?.logoUrl) {
        await handleImageChange(existing.logoUrl, data.logoUrl);
      }
    }

    const partner = await prisma.partner.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json({ partner });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    // 🔥 Delete associated Cloudinary image before deleting the record
    const existing = await prisma.partner.findUnique({ where: { id: Number(id) } });
    if (existing?.logoUrl) {
      await deleteCloudinaryImage(existing.logoUrl);
    }

    await prisma.partner.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 });
  }
}


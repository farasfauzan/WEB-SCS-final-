import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";

export async function GET(request) {
  try {
    const auth = await requireAdminRole(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.adminLog.count(),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Logs fetch error:", error);
    return NextResponse.json({ error: "Gagal memuat log" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const auth = await requireAdminRole(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.adminLog.deleteMany({});
    return NextResponse.json({ success: true, message: "Semua log berhasil dihapus" });
  } catch (error) {
    console.error("Logs delete error:", error);
    return NextResponse.json({ error: "Gagal menghapus log" }, { status: 500 });
  }
}

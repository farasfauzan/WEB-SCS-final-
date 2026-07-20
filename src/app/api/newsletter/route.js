import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { saveApiError } from "@/lib/api-error-log";

export async function GET(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscribers = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });

    return NextResponse.json({ subscribers });
  } catch (error) {
    await saveApiError({
      route: new URL(request.url).pathname,
      method: "GET",
      error,
    });
    console.error("API /api/newsletter GET error:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await prisma.subscriber.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    await saveApiError({
      route: new URL(request.url).pathname,
      method: "DELETE",
      error,
    });
    console.error("API /api/newsletter DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}

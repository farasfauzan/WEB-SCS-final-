import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { saveApiError } from "@/lib/api-error-log";

export async function GET(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get("newsId");
    const approved = searchParams.get("approved");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = Math.min(parseInt(searchParams.get("limit")) || 10, 50);
    const skip = (page - 1) * limit;

    const where = {};
    if (newsId) where.newsId = Number(newsId);
    if (approved !== null && approved !== "") where.isApproved = approved === "true";

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "GET", error });
    console.error("API /api/comments GET error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    const comment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { isApproved: true },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "PUT", error });
    console.error("API /api/comments PUT error:", error);
    return NextResponse.json({ error: "Failed to approve comment" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    await prisma.comment.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "DELETE", error });
    console.error("API /api/comments DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}

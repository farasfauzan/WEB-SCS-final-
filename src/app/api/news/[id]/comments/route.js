import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decodeId } from "@/lib/encode-id";
import { saveApiError } from "@/lib/api-error-log";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const realId = decodeId(id);
    if (realId === null || realId === 0) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const comments = await prisma.comment.findMany({
      where: { newsId: Number(realId), isApproved: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ comments });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "GET", error });
    console.error("API /api/news/[id]/comments GET error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const realId = decodeId(id);
    if (realId === null || realId === 0) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const { name, email, content } = await request.json();

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        newsId: Number(realId),
        name,
        email: email || "",
        content,
        isApproved: false,
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "POST", error });
    console.error("API /api/news/[id]/comments POST error:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const news = await prisma.news.findUnique({
      where: { slug },
    });

    if (!news) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Only return published articles to the public
    if (news.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ news });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    // Get visitor IP from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "127.0.0.1";

    // Upsert unique visitor
    const existing = await prisma.uniqueVisitor.findUnique({ where: { ip } });
    const isNewVisitor = !existing;

    await prisma.uniqueVisitor.upsert({
      where: { ip },
      update: { lastVisit: new Date() },
      create: { ip, lastVisit: new Date() },
    });

    // Update visit stats
    const stats = await prisma.visitStats.findFirst();
    if (stats) {
      await prisma.visitStats.update({
        where: { id: stats.id },
        data: {
          totalVisits: { increment: 1 },
          uniqueVisitors: isNewVisitor ? { increment: 1 } : undefined,
        },
      });
    } else {
      await prisma.visitStats.create({
        data: {
          totalVisits: 1,
          uniqueVisitors: 1,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Visitor track error:", error);
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 });
  }
}

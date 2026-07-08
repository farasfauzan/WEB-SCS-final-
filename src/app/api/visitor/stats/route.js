import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!(await verifyToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await prisma.visitStats.findFirst();
    const totalVisits = stats?.totalVisits || 0;
    const uniqueVisitors = stats?.uniqueVisitors || 0;

    // Get today's visitors count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await prisma.uniqueVisitor.count({
      where: { lastVisit: { gte: today } },
    });

    // Get this week's visitors count
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekVisitors = await prisma.uniqueVisitor.count({
      where: { lastVisit: { gte: weekStart } },
    });

    return NextResponse.json({
      stats: {
        totalVisits,
        uniqueVisitors,
        todayVisitors,
        weekVisitors,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch visitor stats" }, { status: 500 });
  }
}

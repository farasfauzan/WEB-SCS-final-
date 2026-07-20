import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveApiError } from "@/lib/api-error-log";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
    }

    const existing = await prisma.subscriber.findFirst({
      where: { email, isActive: true },
    });

    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.create({
      data: { email, isActive: true },
    });

    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (error) {
    await saveApiError({
      route: new URL(request.url).pathname,
      method: "POST",
      error,
    });
    console.error("API /api/newsletter/subscribe POST error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

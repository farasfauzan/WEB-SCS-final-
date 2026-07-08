import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Try raw query to check column existence
    const rawResult = await prisma.$queryRaw`SELECT id, title, "page" FROM "Hero" LIMIT 5`;
    
    // Try enum filter
    let enumResult = null;
    try {
      enumResult = await prisma.hero.findMany({ where: { page: "HOME" } });
    } catch (e) {
      enumResult = { error: e.message, meta: e.meta };
    }
    
    // Try string filter (if page was string)
    let stringResult = null;
    try {
      stringResult = await prisma.hero.findMany({ where: { page: "HOME" } });
    } catch (e) {
      stringResult = { error: e.message };
    }

    return NextResponse.json({ rawResult, enumResult, stringResult });
  } catch (error) {
    return NextResponse.json({ error: error.message, meta: error.meta }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany({ orderBy: { group: "asc" } });
    // Convert to key-value map for easier consumption
    const settingsMap = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
    return NextResponse.json({ settings, settingsMap });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await requireAdminRole(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    const setting = await prisma.setting.upsert({
      where: { key: data.key },
      update: { value: data.value, label: data.label, group: data.group },
      create: { key: data.key, value: data.value, label: data.label, group: data.group },
    });

    // Revalidate website layout so updates display instantly on live site
    revalidatePath("/", "layout");

    return NextResponse.json({ setting }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
  }
}

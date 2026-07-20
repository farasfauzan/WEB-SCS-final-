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
    const model = searchParams.get("model");
    const modelId = searchParams.get("modelId");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    if (!model || !modelId) {
      return NextResponse.json({ error: "Missing required query params: model, modelId" }, { status: 400 });
    }

    const where = {
      model: model,
      modelId: Number(modelId),
    };

    const [revisions, total] = await Promise.all([
      prisma.contentRevision.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contentRevision.count({ where }),
    ]);

    return NextResponse.json({
      revisions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    await saveApiError({ route: new URL(request.url).pathname, method: "GET", error });
    console.error("API /api/revisions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch revisions" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";

async function saveRevision({ model, modelId, data, changedBy }) {
  try {
    await prisma.contentRevision.create({
      data: {
        model,
        modelId: Number(modelId),
        data,
        changedBy,
      },
    });
  } catch (err) {
    console.error("Failed to save revision:", err);
  }
}

async function getRevisions({ model, modelId, page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;

  const [revisions, total] = await Promise.all([
    prisma.contentRevision.findMany({
      where: {
        model,
        modelId: Number(modelId),
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contentRevision.count({
      where: {
        model,
        modelId: Number(modelId),
      },
    }),
  ]);

  return {
    revisions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export { saveRevision, getRevisions };

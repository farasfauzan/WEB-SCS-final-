import { prisma } from "@/lib/prisma";

function getErrorMessage(error) {
  return error?.message || String(error);
}

async function saveApiError({ route, method, error, userAgent, ip }) {
  try {
    const errorMessage = getErrorMessage(error);
    const truncatedMessage =
      errorMessage.length > 2000 ? errorMessage.slice(0, 2000) : errorMessage;

    await prisma.apiErrorLog.create({
      data: {
        route,
        method,
        errorMessage: truncatedMessage,
        userAgent,
        ip,
      },
    });
  } catch (err) {
    console.error("Failed to save API error log:", err);
  }
}

export { saveApiError, getErrorMessage };

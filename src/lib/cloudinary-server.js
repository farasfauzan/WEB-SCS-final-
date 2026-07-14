import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary SDK (server-side only)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extract the Cloudinary public_id from a Cloudinary URL.
 * Example:
 *   "https://res.cloudinary.com/l9ey3yqz/image/upload/v1234/scs-website/abc123.jpg"
 *   → "scs-website/abc123"
 */
export function extractPublicId(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  if (!imageUrl.includes("cloudinary")) return null;

  try {
    // Match the part after /upload/vXXXXX/ or /upload/
    // Cloudinary URL format: /upload/v1234567/folder/public_id.ext
    const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+$/);
    if (match) {
      // Remove any transformation segments
      return match[1].split("/").slice(0, -1).join("/") + "/" + match[1].split("/").pop();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Delete an image from Cloudinary by its URL.
 * Returns { success: true } or { success: false, error: "..." }.
 * This is a no-op silently if the URL is not a Cloudinary URL,
 * so it's safe to call on any image URL.
 */
export async function deleteCloudinaryImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return { success: true };
  if (!imageUrl.includes("cloudinary")) return { success: true };

  // Don't delete static assets (scs-public folder)
  if (imageUrl.includes("scs-public")) return { success: true };

  const publicId = extractPublicId(imageUrl);
  if (!publicId) return { success: true };

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      console.log(`🗑️ Deleted Cloudinary image: ${publicId}`);
      return { success: true };
    }
    // "not found" is not an error — image may have been deleted already
    console.log(`ℹ️ Cloudinary delete result for ${publicId}: ${result.result}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to delete Cloudinary image ${publicId}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Handles Cloudinary deletion when a record's imageUrl changes.
 * Call this before updating a record to delete the old image.
 */
export async function handleImageChange(oldImageUrl, newImageUrl) {
  // Only delete if:
  // 1. Old image exists
  // 2. New image is different from old image
  // 3. Old image is a Cloudinary URL (not a static asset)
  if (
    oldImageUrl &&
    newImageUrl &&
    oldImageUrl !== newImageUrl &&
    oldImageUrl.includes("cloudinary") &&
    !oldImageUrl.includes("scs-public")
  ) {
    await deleteCloudinaryImage(oldImageUrl);
  }
}

export { cloudinary };

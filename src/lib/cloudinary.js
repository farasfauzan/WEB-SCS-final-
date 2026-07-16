/**
 * Convert a local static asset path to its final URL.
 * Since static assets (icons, logos) are served directly from the public folder,
 * this returns the local path as-is. Full URLs (like Cloudinary URLs for
 * user-uploaded images) are returned unchanged.
 *
 * Example:
 *   cldAsset("/logo-scs.svg") → "/logo-scs.svg"
 *   cldAsset("https://res.cloudinary.com/...") → "https://res.cloudinary.com/..."
 */
export function cldAsset(localPath) {
  if (!localPath) return localPath;
  // If it's already a full URL, return as-is
  if (localPath.startsWith("http")) return localPath;
  // If it's a data URI or protocol-relative, return as-is
  if (localPath.startsWith("data:") || localPath.startsWith("//")) return localPath;

  // For local paths, return them directly — they're served from the public/ folder
  return localPath;
}

/**
 * Apply Cloudinary transformations to an existing image URL.
 * This is a pure string manipulation — no SDK required, safe for client components.
 * Falls back to the original URL if it's not a Cloudinary URL.
 */
export function cldImg(imageUrl, options = {}) {
  if (!imageUrl) return "";

  // Only transform Cloudinary URLs; return non-Cloudinary URLs as-is
  if (!imageUrl.includes("cloudinary")) return imageUrl;

  const { width, height, quality = "auto", format = "auto", crop = "fill", dpr = "auto" } = options;

  // Build transformation string like: w_400,h_300,c_fill,q_auto,f_auto,dpr_auto
  const parts = [];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop) parts.push(`c_${crop}`);
  if (quality) parts.push(`q_${quality}`);
  if (format) parts.push(`f_${format}`);
  if (dpr) parts.push(`dpr_${dpr}`);

  const transformStr = parts.join(",");

  // Insert transformations right after /upload/
  return imageUrl.replace("/upload/", `/upload/${transformStr}/`);
}

/**
 * Predefined size presets for different image contexts.
 * These ensure consistent, optimized image sizes across the website.
 * Each preset includes the base size plus responsive derivative widths.
 */
export const IMAGE_SIZES = {
  hero:     { width: 1920, height: 800,  crop: "fill", responsiveWidths: [640, 1024, 1280, 1920] },
  card:     { width: 400,  height: 300,  crop: "fill", responsiveWidths: [200, 400, 600, 800] },
  preview:  { width: 600,  height: 400,  crop: "fill", responsiveWidths: [300, 600, 900, 1200] },
  full:     { width: 1200, height: 800,  crop: "fill", responsiveWidths: [400, 800, 1200, 1600] },
  avatar:   { width: 150,  height: 150,  crop: "fill", responsiveWidths: [75, 150, 300] },
};

/**
 * Generate a responsive srcSet string for a Cloudinary image at multiple widths.
 * Each variant maintains the same aspect ratio as the base dimensions.
 * Includes dpr_auto so retina displays get 2x/3x resolution automatically.
 *
 * @param {string} imageUrl - The base Cloudinary image URL
 * @param {object} options - Transform options (width, height, crop, etc.)
 * @returns {string} A srcSet string like "url1 400w, url2 800w"
 */
export function cldSrcSet(imageUrl, options = {}) {
  if (!imageUrl || !imageUrl.includes("cloudinary")) return "";

  const { width, height, responsiveWidths = [], crop = "fill", quality = "auto", format = "auto", dpr = "auto" } = options;

  if (!width || !height || responsiveWidths.length === 0) return "";

  const aspectRatio = width / height;

  return responsiveWidths
    .map((w) => {
      const h = Math.round(w / aspectRatio);
      const transformedUrl = cldImg(imageUrl, { width: w, height: h, crop, quality, format, dpr });
      return `${transformedUrl} ${w}w`;
    })
    .join(", ");
}

/**
 * Default sizes attribute for responsive images, used with cldSrcSet.
 */
export function defaultSizes(fill = true) {
  return fill
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : "100vw";
}

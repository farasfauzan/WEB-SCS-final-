import Image from "next/image";
import { cldImg, cldAsset, cldSrcSet, defaultSizes } from "@/lib/cloudinary";

/**
 * OptimizedImage — Smart image component for Next.js + Cloudinary
 *
 * Features:
 * - Automatically converts local asset paths to Cloudinary CDN URLs via cldAsset()
 * - Uses Next.js <Image> for non-Cloudinary images (layout stability, lazy loading)
 * - For Cloudinary images: generates a responsive srcSet so the browser picks
 *   the right size for the viewport (desktop gets 1920px, phone gets 400px)
 * - Applies Cloudinary transformations via cldImg() when cldOptions are provided
 * - Falls back to <img> for SVGs (Next.js Image doesn't optimize SVGs)
 */
export default function OptimizedImage({
  src = "",
  alt = "",
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  className = "",
  style,
  quality = 75,
  cldOptions = null, // e.g. IMAGE_SIZES.hero
  ...props
}) {
  // Resolve local paths → Cloudinary CDN URLs (or keep external URLs as-is)
  const cloudSrc = cldAsset(src);

  // If no valid src, render nothing
  if (!cloudSrc) return null;

  // SVGs from Cloudinary/static → use plain <img>
  if (typeof cloudSrc === "string" && (cloudSrc.endsWith(".svg") || src?.endsWith(".svg"))) {
    return (
      <img
        src={cloudSrc}
        alt={alt}
        className={className}
        style={style}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
    );
  }

  // Check if this is a Cloudinary image (non-SVG)
  const isCloudinary = typeof cloudSrc === "string" && cloudSrc.includes("cloudinary");

  // Apply base Cloudinary transformation if options provided
  const finalSrc = cldOptions && isCloudinary
    ? cldImg(cloudSrc, cldOptions) || cloudSrc
    : cloudSrc;

  if (!finalSrc) return null;

  // 🖼️ CLOUDINARY IMAGES — render <img> with responsive srcSet
  // Cloudinary handles optimization, so we skip Next.js Image and use
  // a plain <img> with a generated srcSet for truly responsive delivery.
  if (isCloudinary && cldOptions) {
    // Generate responsive srcSet at multiple widths
    const srcSet = cldSrcSet(cloudSrc, {
      ...cldOptions,
      quality: "auto",
      format: "auto",
    });

    // Generate the base transformed URL for the src attribute
    const srcAttr = cldImg(cloudSrc, {
      ...cldOptions,
      width: cldOptions.responsiveWidths
        ? cldOptions.responsiveWidths[cldOptions.responsiveWidths.length - 1]
        : cldOptions.width,
      height: cldOptions.height,
      quality: "auto",
      format: "auto",
    });

    return (
      <img
        src={srcAttr}
        srcSet={srcSet}
        sizes={sizes || defaultSizes(fill)}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={className}
        style={{
          ...style,
          ...(fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : {}),
        }}
        {...props}
      />
    );
  }

  // 🖼️ NON-CLOUDINARY IMAGES — use Next.js Image
  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes || defaultSizes(fill)}
      quality={quality}
      className={className}
      style={style}
      {...props}
    />
  );
}

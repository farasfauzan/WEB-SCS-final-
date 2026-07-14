"use client";

import { cldAsset } from "@/lib/cloudinary";

/**
 * CldImg — Wrapper around <img> that auto-resolves local static asset paths
 * to their Cloudinary CDN URLs.
 *
 * Drop-in replacement for `<img>` when you want Cloudinary-optimized images.
 * Supports all standard <img> props (src, alt, className, style, etc.).
 *
 * Usage:
 *   <CldImg src="/logo-scs.svg" alt="Logo" className="w-8 h-8" />
 *   // → <img src="https://res.cloudinary.com/.../logo-scs.svg" ... />
 */
export default function CldImg({ src, alt = "", className, style, ...props }) {
  if (!src) return null;

  // Resolve local path → Cloudinary CDN URL (or keep external URLs as-is)
  const cloudSrc = cldAsset(src);

  return (
    <img
      src={cloudSrc}
      alt={alt}
      className={className}
      style={style}
      {...props}
    />
  );
}

"use client";

/**
 * CldImg — Simple wrapper around <img> that renders local static assets
 * directly from the public/ folder.
 *
 * Supports all standard <img> props (src, alt, className, style, etc.).
 *
 * Usage:
 *   <CldImg src="/logo-scs.svg" alt="Logo" className="w-8 h-8" />
 *   // → <img src="/logo-scs.svg" ... />
 */
export default function CldImg({ src, alt = "", className, style, ...props }) {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...props}
    />
  );
}

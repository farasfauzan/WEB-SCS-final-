"use client";

import { useState, useRef } from "react";

export default function ImageUpload({ currentImage = "", onImageChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [urlInput, setUrlInput] = useState(currentImage);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setPreview(data.url);
        setUrlInput(data.url);
        onImageChange(data.url);
      } else {
        alert(data.error || "Upload failed");
        setPreview(currentImage);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again.");
      setPreview(currentImage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrlInput(val);
    setPreview(val);
    onImageChange(val);
  };

  const handleRemove = () => {
    setPreview("");
    setUrlInput("");
    onImageChange("");
  };

  const isCloudinaryUrl = preview && preview.includes("cloudinary");

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>

      {/* Current Preview */}
      {preview && (
        <div className="relative w-full h-44 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "";
              e.target.style.display = "none";
            }}
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent"></div>
                <span className="text-white text-xs font-medium">Optimizing image...</span>
              </div>
            </div>
          )}

          {/* Cloudinary badge */}
          {isCloudinaryUrl && !uploading && (
            <div className="absolute top-2 left-2 bg-[#004282]/80 text-white text-[10px] font-semibold px-2 py-1 rounded-md backdrop-blur-sm flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Cloudinary CDN
            </div>
          )}

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-all shadow-md opacity-0 group-hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload or URL input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <label className="flex-1 cursor-pointer">
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#004282] hover:bg-blue-50 transition-all text-sm text-gray-500 hover:text-[#004282]">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-[#004282] border-t-transparent rounded-full animate-spin"></span>
                Uploading...
              </span>
            ) : (
              "Upload image"
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="hidden sm:inline">or</span>
          <span className="sm:hidden">or paste URL:</span>
        </div>

        <div className="flex-1">
          <input
            type="text"
            value={urlInput}
            onChange={handleUrlChange}
            placeholder="Paste image URL..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm"
          />
        </div>
      </div>

      <p className="text-xs text-gray-400 flex items-center gap-1">
        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Supports: JPEG, PNG, WebP, SVG, GIF (max 10MB). Images will be optimized via Cloudinary CDN.
      </p>
    </div>
  );
}

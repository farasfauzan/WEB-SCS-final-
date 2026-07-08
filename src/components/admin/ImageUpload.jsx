"use client";

import { useState, useRef } from "react";

export default function ImageUpload({ currentImage = "", onImageChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [urlInput, setUrlInput] = useState(currentImage);
  const [mode, setMode] = useState(currentImage ? "url" : "url");
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview
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
      // Reset file input
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

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>

      {/* Current Preview */}
      {preview && (
        <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = "";
              e.target.style.display = "none";
            }}
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-md"
          >
            ×
          </button>
        </div>
      )}

      {/* Mode: Upload from computer */}
      <div className="flex items-center gap-3">
        <label className="flex-1 cursor-pointer">
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#004282] hover:bg-blue-50 transition-all text-sm text-gray-500 hover:text-[#004282]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {uploading ? "Uploading..." : "Upload from computer"}
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

        <span className="text-xs text-gray-400">or</span>

        {/* Mode: URL input */}
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

      <p className="text-xs text-gray-400">
        Supports: JPEG, PNG, WebP, SVG, GIF (max 5MB). You can upload or paste a URL.
      </p>
    </div>
  );
}

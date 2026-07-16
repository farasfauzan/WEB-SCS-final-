"use client";

import { useState, useRef, useCallback } from "react";
import CldImg from "@/components/shared/CldImg"; // Tetap pertahankan untuk jaga-jaga

export default function GalleryUpload({
  images = [],
  onImagesChange,
  label = "Gallery Images",
  maxImages = 10,
}) {
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDragOverFile, setIsDragOverFile] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  // ─── File Upload (from input or drop) ─────────────────────

  const processFiles = async (files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      alert(
        `Maksimal ${maxImages} gambar. Hapus beberapa gambar terlebih dahulu.`,
      );
      return;
    }

    const filesToUpload = fileArray.slice(0, remaining);
    if (fileArray.length > remaining) {
      alert(
        `Hanya ${remaining} gambar lagi yang bisa ditambahkan. Kelebihan akan diabaikan.`,
      );
    }

    setUploading(true);

    try {
      const uploadedUrls = [];

      for (const file of filesToUpload) {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/svg+xml",
          "image/gif",
        ];
        if (!validTypes.includes(file.type)) {
          console.warn(`Skipped ${file.name}: invalid type ${file.type}`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          console.warn(
            `Skipped ${file.name}: too large (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
          );
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.url);
        } else {
          console.error("Upload failed:", data.error);
        }
      }

      if (uploadedUrls.length > 0) {
        const newImages = [...images, ...uploadedUrls];
        onImagesChange(newImages);
      }
    } catch (err) {
      console.error("Gallery upload error:", err);
      alert("Gagal mengupload gambar. Silakan coba lagi.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileInput = async (e) => {
    await processFiles(e.target.files);
  };

  const handlePasteUrl = () => {
    const url = prompt("Masukkan URL gambar:");
    if (url && url.trim()) {
      const newImages = [...images, url.trim()];
      onImagesChange(newImages);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  // ─── Drag & Drop for file upload ─────────────────────────

  const handleFileDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current += 1;
      if (dragIndex === null) {
        setIsDragOverFile(true);
      }
    },
    [dragIndex],
  );

  const handleFileDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleFileDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOverFile(false);
    }
  }, []);

  const handleFileDrop = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragOverFile(false);

      if (dragIndex !== null) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles && droppedFiles.length > 0) {
        await processFiles(droppedFiles);
      }
    },
    [dragIndex, images, maxImages, onImagesChange],
  );

  // ─── Drag & Drop for image reorder ────────────────────────

  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    const el = e.target.closest("[data-draggable]");
    if (el) {
      e.dataTransfer.setDragImage(el, 80, 80);
    }
  }, []);

  const handleDragOver = useCallback(
    (e, index) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragIndex !== null && dragIndex !== index) {
        setDragOverIndex(index);
      }
    },
    [dragIndex],
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e, dropIndex) => {
      e.preventDefault();

      if (dragIndex === null && e.dataTransfer.files?.length > 0) {
        return;
      }

      e.stopPropagation();

      if (dragIndex === null || dragIndex === dropIndex) {
        setDragIndex(null);
        setDragOverIndex(null);
        return;
      }

      const newImages = [...images];
      const [draggedItem] = newImages.splice(dragIndex, 1);
      newImages.splice(dropIndex, 0, draggedItem);
      onImagesChange(newImages);

      setDragIndex(null);
      setDragOverIndex(null);
    },
    [dragIndex, images, onImagesChange],
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
    setIsDragOverFile(false);
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label}{" "}
        <span className="text-gray-400 font-normal">
          ({images.length}/{maxImages})
        </span>
      </label>

      {/* Main gallery area – also serves as file drop zone */}
      <div
        onDragEnter={handleFileDragEnter}
        onDragOver={handleFileDragOver}
        onDragLeave={handleFileDragLeave}
        onDrop={handleFileDrop}
        className="relative"
      >
        {/* Drop zone overlay when files are dragged over */}
        {isDragOverFile && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#004282]/90 backdrop-blur-sm rounded-xl transition-all duration-200">
            <div className="flex flex-col items-center gap-3 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <p className="text-lg font-bold">Lepaskan untuk Upload</p>
              <p className="text-sm text-white/70">
                JPEG, PNG, WebP, SVG, GIF (max 10MB)
              </p>
            </div>
          </div>
        )}

        {/* Drop zone info bar - reorder hint */}
        {images.length > 1 && dragIndex === null && !isDragOverFile && (
          <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-blue-600">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            <span>
              Seret gambar untuk mengurutkan. Seret file dari komputer ke sini
              untuk upload.
            </span>
          </div>
        )}

        {/* Reorder hint - shown only while reordering */}
        {dragIndex !== null && (
          <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700">
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            <span>Lepaskan untuk menempatkan gambar di posisi baru</span>
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, index) => {
              const isDragging = dragIndex === index;
              const isDragOver = dragOverIndex === index && dragIndex !== index;

              return (
                <div
                  key={index}
                  data-draggable
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 
                    transition-all duration-200 cursor-grab active:cursor-grabbing
                    ${
                      isDragging
                        ? "border-[#004282] opacity-50 scale-95 shadow-lg z-10"
                        : isDragOver
                          ? "border-yellow-400 border-dashed scale-105 shadow-md bg-yellow-50"
                          : "border-gray-200 hover:border-[#004282]/40"
                    }
                  `}
                >
                  <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 pointer-events-none">
                    <span className="bg-black/50 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                      {index + 1}
                    </span>
                  </div>

                  {/* KOREKSI: Gunakan img bawaan khusus untuk preview admin karena CDN CldImg bisa delay merender thumbnail */}
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-300 pointer-events-none"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.style.display = "none";
                    }}
                    draggable={false}
                  />

                  <div className="absolute top-1.5 right-1.5 flex gap-0.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-4 h-4 text-white drop-shadow-md"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="8" cy="6" r="1.5" />
                      <circle cx="16" cy="6" r="1.5" />
                      <circle cx="8" cy="12" r="1.5" />
                      <circle cx="16" cy="12" r="1.5" />
                      <circle cx="8" cy="18" r="1.5" />
                      <circle cx="16" cy="18" r="1.5" />
                    </svg>
                  </div>

                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 pointer-events-none hover:pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-lg cursor-pointer"
                      title="Hapus gambar"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {url.includes("cloudinary") && (
                    <div className="absolute bottom-1.5 right-1.5 bg-[#004282]/70 text-white text-[8px] font-semibold px-1.5 py-0.5 rounded pointer-events-none">
                      CDN
                    </div>
                  )}

                  {isDragOver && (
                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {images.length === 0 && !isDragOverFile && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:border-[#004282] hover:bg-blue-50/30 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 bg-gray-100 group-hover:bg-[#004282]/10 rounded-full flex items-center justify-center transition-colors">
              <svg
                className="w-7 h-7 text-gray-400 group-hover:text-[#004282] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600 group-hover:text-[#004282] transition-colors">
                Seret & lepas gambar ke sini
              </p>
              <p className="text-xs text-gray-400 mt-1">
                atau klik untuk memilih file
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <label
          className={`flex-1 cursor-pointer ${images.length >= maxImages ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#004282] hover:bg-blue-50 transition-all text-sm text-gray-500 hover:text-[#004282]">
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-[#004282] border-t-transparent rounded-full animate-spin"></span>
                Uploading...
              </span>
            ) : (
              `Pilih File ${images.length > 0 ? "Lagi" : ""}`
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading || images.length >= maxImages}
            multiple
          />
        </label>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="hidden sm:inline">or</span>
        </div>

        <button
          type="button"
          onClick={handlePasteUrl}
          disabled={images.length >= maxImages}
          className="px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-[#004282] hover:text-[#004282] hover:bg-blue-50 transition-all disabled:opacity-50 cursor-pointer"
        >
          + URL Manual
        </button>
      </div>

      {uploading && (
        <div className="flex items-center gap-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex-1 h-1.5 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#004282] rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
          <span className="text-xs text-blue-600 font-medium shrink-0">
            Upload ke Cloudinary...
          </span>
        </div>
      )}

      <p className="text-xs text-gray-400 flex items-center gap-1">
        <svg
          className="w-3 h-3 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Drag & drop file dari komputer. Gambar dioptimasi via Cloudinary CDN.
      </p>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import CldImg from "@/components/shared/CldImg";

export default function InteractiveGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Deklarasi fungsi di atas useEffect (Mengatasi Error ESLint Hoisting)
  const closeModal = () => {
    setSelectedImage(null);
    setZoomLevel(1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    if (selectedImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);

  const handleWheelZoom = (e) => {
    if (e.deltaY < 0) {
      setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    } else {
      setZoomLevel((prev) => Math.max(prev - 0.25, 1));
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(img)}
            className="group relative aspect-square w-full overflow-hidden rounded-xl cursor-pointer bg-neutral-200 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <CldImg
              src={img.url}
              alt={img.caption || `Galeri foto ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center overflow-hidden"
            onWheel={handleWheelZoom}
          >
            <div
              className="relative w-full h-full transition-transform duration-200 ease-out cursor-zoom-in"
              style={{ transform: `scale(${zoomLevel})` }}
              onClick={() => setZoomLevel((prev) => (prev === 1 ? 2 : 1))}
            >
              <CldImg
                src={selectedImage.url}
                alt={selectedImage.caption || "Gambar diperbesar"}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {selectedImage.caption && (
            <p className="text-white text-lg mt-6 font-medium text-center max-w-3xl px-4">
              {selectedImage.caption}
            </p>
          )}

          <button
            onClick={closeModal}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110"
            aria-label="Tutup galeri"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

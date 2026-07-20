"use client";

import { useState, useRef, useEffect } from "react";

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Sebelum",
  afterAlt = "Sesudah",
}) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const getPercentage = (clientX) => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.min(100, Math.max(0, (x / rect.width) * 100));
  };

  const handleStart = (clientX) => {
    setIsDragging(true);
    setPosition(getPercentage(clientX));
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    setPosition(getPercentage(clientX));
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;

    const onTouchMove = (e) => handleMove(e.touches[0].clientX);
    const onTouchEnd = () => handleEnd();

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-xl shadow-sm aspect-video bg-gray-100"
      onMouseDown={(e) => handleStart(e.clientX)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
    >
      <img
        src={afterSrc}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      <div
        className="absolute inset-0 object-cover pointer-events-none"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <img
          src={beforeSrc}
          alt={beforeAlt}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 12H4m0 0l3-3m-3 3l3 3M16 12h4m0 0l-3-3m3 3l-3 3" />
          </svg>
        </div>
      </div>

      <span className="absolute top-3 left-3 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded">
        {beforeAlt}
      </span>
      <span className="absolute top-3 right-3 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded">
        {afterAlt}
      </span>
    </div>
  );
}

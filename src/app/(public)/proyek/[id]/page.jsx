"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import CldImg from "@/components/shared/CldImg";
import InteractiveGallery from "@/components/ui/InteractiveGallery";

export default function DetailProyekPage({ params }) {
  const { id } = React.use(params);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.project) setProject(data.project);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="min-h-screen bg-zinc-100" />;
  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center font-['Plus_Jakarta_Sans'] text-neutral-500">
        Proyek tidak ditemukan.
      </div>
    );
  }

  // Sanitasi & Pemformatan Data Galeri (support JSON string, object, dan plain URL)
  const rawGallery =
    project.gallery || project.images || project.galleryImages || [];
  const formattedGallery = rawGallery.map((item) => {
    if (typeof item === "string") {
      try {
        const parsed = JSON.parse(item);
        if (parsed && typeof parsed === "object" && parsed.url) {
          return { url: parsed.url, caption: parsed.caption || "" };
        }
      } catch {}
      return { url: item, caption: "" };
    }
    return { url: item.url || "", caption: item.caption || "" };
  });

  const formatYellowText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={index} className="text-[#FFD700]">
            {part.replace(/\*\*/g, "")}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const publishDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "9 Juli 2026";

  return (
    <main className="w-full bg-zinc-100 min-h-screen pt-20 pb-24 px-4 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-[1144px] flex flex-col gap-5">
        <FadeUp delay={0.1}>
          <Link
            href="/proyek"
            className="flex items-center gap-2 text-blue-900 text-[13px] md:text-[14px] font-semibold font-['Plus_Jakarta_Sans'] hover:opacity-80 transition-opacity w-fit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Proyek
          </Link>
        </FadeUp>

        <FadeUp
          delay={0.2}
          className="w-full bg-white rounded-[32px] md:rounded-[48px] px-6 pt-5 pb-6 lg:px-8 lg:pt-6 lg:pb-8 flex flex-col gap-6 md:gap-8 shadow-sm border border-neutral-100"
        >
          <div className="w-full flex flex-col gap-3 md:gap-4">
            <div className="w-full text-left">
              <p className="text-blue-900 text-[12px] md:text-[13px] font-bold font-['Plus_Jakarta_Sans'] tracking-widest uppercase">
                Diterbitkan pada • {publishDate}
              </p>
            </div>

            <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden relative">
              <CldImg
                src={
                  project.imageUrl ||
                  project.coverImage ||
                  project.image ||
                  "/carousel3.svg"
                }
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="w-full text-left text-black text-2xl md:text-3xl font-bold font-['Montserrat'] leading-snug">
            {formatYellowText(project.title)}
          </h1>

          <hr className="border-neutral-100 w-full" />

          <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 md:gap-10 items-start">
            <div className="flex flex-col gap-5">
              <h2 className="text-black text-lg md:text-xl font-bold font-['Montserrat'] mb-1">
                Detail Proyek
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-black text-[15px] font-bold font-['Montserrat']">
                    Kategori
                  </h3>
                  <p className="text-neutral-700 text-[14px] md:text-[15px] font-normal font-['Montserrat'] mt-0.5">
                    {project.category || "-"}
                  </p>
                </div>
                <div>
                  <h3 className="text-black text-[15px] font-bold font-['Montserrat']">
                    Lokasi
                  </h3>
                  <p className="text-neutral-700 text-[14px] md:text-[15px] font-normal font-['Montserrat'] leading-relaxed mt-0.5">
                    {project.location || "-"}
                  </p>
                </div>
                <div>
                  <h3 className="text-black text-[15px] font-bold font-['Montserrat']">
                    Status
                  </h3>
                  <p className="text-neutral-700 text-[14px] md:text-[15px] font-normal font-['Montserrat'] mt-0.5">
                    {project.status || "Completed"}
                  </p>
                </div>

                {project.description && (
                  <div className="mt-2">
                    <h3 className="text-black text-[15px] font-bold font-['Montserrat']">
                      Deskripsi
                    </h3>
                    <p className="text-neutral-700 text-[14px] md:text-[15px] font-normal font-['Montserrat'] leading-relaxed whitespace-pre-line mt-1.5">
                      {project.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[420px] aspect-video md:aspect-auto md:h-[260px] rounded-2xl overflow-hidden relative bg-zinc-200 shadow-inner border border-neutral-100">
              {project.mapsUrl ? (
                <iframe
                  src={project.mapsUrl}
                  className="w-full h-full border-0 absolute inset-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 gap-3">
                  <svg
                    className="w-8 h-8 text-neutral-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-[13px] text-neutral-500 font-medium font-['Montserrat']">
                    Peta tidak tersedia
                  </span>
                </div>
              )}
            </div>
          </div>
        </FadeUp>

        <FadeUp
          delay={0.3}
          className="w-full bg-white rounded-[32px] md:rounded-[48px] px-6 py-6 lg:px-8 lg:py-8 flex flex-col gap-6 md:gap-8 shadow-sm border border-neutral-100"
        >
          <div className="w-full text-left">
            <h2 className="text-black text-2xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
              Galeri
            </h2>
          </div>

          {formattedGallery.length > 0 ? (
            <InteractiveGallery images={formattedGallery} />
          ) : (
            <div className="w-full py-16 flex flex-col items-center justify-center bg-zinc-50 rounded-2xl border-2 border-dashed border-neutral-200">
              <img
                src="/no-picture.svg"
                alt="Tidak ada gambar"
                className="w-16 h-16 mb-4 opacity-40 object-contain"
              />
              <p className="text-neutral-500 text-[14px] md:text-[15px] font-medium font-['Plus_Jakarta_Sans']">
                Belum ada foto galeri yang ditambahkan.
              </p>
            </div>
          )}
        </FadeUp>
      </div>
    </main>
  );
}

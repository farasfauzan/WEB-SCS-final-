"use client";
import React, { useState, useEffect } from "react";
import FadeUp from "@/components/ui/FadeUp";

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

  if (isLoading) return <div className="min-h-screen bg-[#F1F1F1]" />;
  if (!project) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center font-['Plus_Jakarta_Sans'] text-neutral-500">
        Proyek tidak ditemukan.
      </div>
    );
  }

  const galleryImages = project.gallery || project.images || [];

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
    ? new Date(project.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "9 Juli 2026";

  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pt-28 pb-24 px-4 md:px-6 flex flex-col items-center">
      <div className="max-w-5xl w-full flex flex-col gap-8">
        
        <section className="w-full flex flex-col gap-4">
          <FadeUp delay={0.1} className="text-neutral-500 text-xs md:text-sm font-semibold font-['Plus_Jakarta_Sans'] tracking-wide uppercase">
            Diterbitkan pada: {publishDate}
          </FadeUp>

          <FadeUp delay={0.15} className="w-full rounded-4xl overflow-hidden shadow-md border border-neutral-200 bg-neutral-300 relative">
            <img 
              src={project.coverImage || project.image || "/carousel3.svg"} 
              alt={project.title} 
              className="w-full h-auto max-h-[55vh] object-cover"
            />
          </FadeUp>

          <FadeUp delay={0.2} className="mt-2">
            <h1 className="text-[#004282] text-[clamp(2rem,4vw,3rem)] font-extrabold font-['Plus_Jakarta_Sans'] leading-tight">
              {formatYellowText(project.title)}
            </h1>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 w-full items-start mt-2">
            
            <FadeUp delay={0.25} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-200/60 flex flex-col gap-4 h-full justify-between">
              <div>
                <h3 className="text-neutral-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-2">Deskripsi Kerja</h3>
                <p className="text-neutral-600 text-sm md:text-[15px] font-['Plus_Jakarta_Sans'] leading-relaxed whitespace-pre-line">
                  {project.description || project.desc || "Tidak ada deskripsi tambahan untuk proyek ini."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4 mt-4 text-xs md:text-sm">
                <div>
                  <span className="text-neutral-400 block font-['Plus_Jakarta_Sans']">Klien:</span>
                  <span className="text-neutral-800 font-bold font-['Plus_Jakarta_Sans']">{project.client || "-"}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-['Plus_Jakarta_Sans']">Kategori:</span>
                  <span className="text-neutral-800 font-bold font-['Plus_Jakarta_Sans']">{project.category || "-"}</span>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.3} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200/60 flex flex-col gap-4 w-full">
              <h3 className="text-neutral-800 text-lg font-bold font-['Plus_Jakarta_Sans']">Lokasi Proyek</h3>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-400 text-xs font-['Plus_Jakarta_Sans']">Alamat Operasional:</span>
                <p className="text-neutral-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-relaxed">
                  {project.location || "Lokasi tidak spesifik"}
                </p>
              </div>

              <a 
                href={project.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.location || "")}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full h-12 rounded-xl bg-[#004282] hover:bg-blue-900 text-white font-bold text-sm font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-900/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                Buka di Google Maps
              </a>
            </FadeUp>

          </div>
        </section>

        {galleryImages.length > 0 && (
          <section className="w-full border-t border-neutral-300/60 pt-8 mt-4 flex flex-col gap-4">
            
            <FadeUp delay={0.1} className="flex items-center gap-3">
              <h2 className="text-neutral-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans']">
                Galeri Dokumentasi
              </h2>
              <span className="px-3 py-1 rounded-full bg-[#004282]/10 text-[#004282] text-xs font-bold font-['Plus_Jakarta_Sans'] shrink-0">
                {galleryImages.length} Foto
              </span>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {galleryImages.map((img, idx) => (
                <FadeUp key={idx} delay={0.15 + (idx * 0.05)}>
                  <div className="w-full aspect-4/3 bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm group cursor-pointer">
                    <img 
                      src={img} 
                      alt={`Dokumentasi ${project.title} - ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </FadeUp>
              ))}
            </div>

          </section>
        )}

      </div>
    </main>
  );
}
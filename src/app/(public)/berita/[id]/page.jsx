"use client";
import React, { useState, useEffect } from "react";
import FadeUp from "@/components/ui/FadeUp";
import { IMAGE_SIZES } from "@/lib/cloudinary";
import OptimizedImage from "@/components/shared/OptimizedImage";

export default function DetailBeritaPage({ params }) {
  const { id } = React.use(params);
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.news) setNews(data.news);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="min-h-screen bg-[#F1F1F1]" />;
  if (!news) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center font-['Plus_Jakarta_Sans'] text-neutral-500">
        Artikel berita tidak ditemukan.
      </div>
    );
  }

  const galleryImages = news.gallery || [];

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

  const publishDate = news.createdAt 
    ? new Date(news.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "9 Juli 2026";

  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pt-28 pb-24 px-4 md:px-6 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        
        <section className="w-full flex flex-col gap-4">
          <FadeUp delay={0.1} className="text-neutral-600 text-xs md:text-sm font-semibold font-['Plus_Jakarta_Sans'] tracking-wide uppercase">
            Berita Terkini • {publishDate}
          </FadeUp>

          <FadeUp delay={0.15} className="w-full rounded-4xl overflow-hidden shadow-md border border-neutral-200 bg-neutral-300">
            <div className="relative w-full max-h-[55vh] aspect-[3/2]">
              <OptimizedImage
                src={news.imageUrl || news.image || "/carousel1.svg"}
                alt={news.title}
                fill
                priority
                cldOptions={IMAGE_SIZES.full}
                className="object-cover"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.2} className="mt-2">
            <h1 className="text-neutral-900 text-[clamp(2rem,4vw,2.75rem)] font-extrabold font-['Plus_Jakarta_Sans'] leading-tight">
              {formatYellowText(news.title)}
            </h1>
          </FadeUp>

          <FadeUp delay={0.25} className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-neutral-200/60 mt-2">
            <div className="text-neutral-700 text-sm md:text-base font-normal font-['Plus_Jakarta_Sans'] leading-relaxed space-y-4 whitespace-pre-line">
              {formatYellowText(news.content || news.description || news.desc)}
            </div>
          </FadeUp>
        </section>

        {galleryImages.length > 0 && (
          <section className="w-full border-t border-neutral-300/60 pt-8 flex flex-col gap-4">
            
            <FadeUp delay={0.1} className="flex items-center gap-3">
              <h2 className="text-neutral-800 text-xl font-extrabold font-['Plus_Jakarta_Sans']">
                Foto Terkait Berita
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold font-['Plus_Jakarta_Sans']">
                {galleryImages.length} Gambar
              </span>
            </FadeUp>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {galleryImages.map((img, idx) => (
                <FadeUp key={idx} delay={0.15 + (idx * 0.05)}>
                  <div className="relative w-full aspect-4/3 bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
                    <OptimizedImage
                      src={img}
                      alt={`Lampiran berita - Gambar ${idx + 1}`}
                      fill
                      cldOptions={IMAGE_SIZES.preview}
                      className="object-cover hover:scale-105 transition-transform duration-500"
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
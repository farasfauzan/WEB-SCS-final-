"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import CldImg from "@/components/shared/CldImg";
import InteractiveGallery from "@/components/ui/InteractiveGallery";

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

  if (isLoading) return <div className="min-h-screen bg-zinc-100" />;
  if (!news) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center font-['Plus_Jakarta_Sans'] text-neutral-500">
        Artikel berita tidak ditemukan.
      </div>
    );
  }

  // Sanitasi & Pemformatan Data Galeri
  const rawGallery = news.galleryImages || news.gallery || news.images || [];
  const formattedGallery = rawGallery.map((item) => {
    if (typeof item === "string") return { url: item, caption: "" };
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

  const publishDate = news.createdAt
    ? new Date(news.createdAt).toLocaleDateString("id-ID", {
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
            href="/berita"
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
            Kembali ke Berita
          </Link>
        </FadeUp>

        <FadeUp
          delay={0.2}
          className="w-full bg-white rounded-[32px] md:rounded-[48px] px-6 pt-5 pb-6 lg:px-8 lg:pt-6 lg:pb-8 flex flex-col gap-6 md:gap-8 shadow-sm border border-neutral-100"
        >
          <div className="w-full flex flex-col gap-3 md:gap-4">
            <div className="w-full text-left">
              <p className="text-blue-900 text-[12px] md:text-[13px] font-bold font-['Plus_Jakarta_Sans'] tracking-widest uppercase">
                Berita Terkini • {publishDate}
              </p>
            </div>

            <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden relative">
              <CldImg
                src={news.imageUrl || news.image || "/carousel1.svg"}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="w-full text-left text-black text-2xl md:text-3xl font-bold font-['Montserrat'] leading-snug">
            {formatYellowText(news.title)}
          </h1>

          <hr className="border-neutral-100 w-full" />

          <div className="w-full text-neutral-800 text-[14px] md:text-[15px] font-normal font-['Montserrat'] leading-[1.8] whitespace-pre-line text-justify">
            {formatYellowText(news.content || news.description || news.desc)}
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
                Belum ada foto dokumentasi untuk berita ini.
              </p>
            </div>
          )}
        </FadeUp>
      </div>
    </main>
  );
}

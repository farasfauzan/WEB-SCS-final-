"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import CldImg from "@/components/shared/CldImg";
import InteractiveGallery from "@/components/ui/InteractiveGallery";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ShareButtons from "@/components/shared/ShareButtons";

export default function DetailBeritaPage({ params }) {
  const { slug } = React.use(params);
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news/slug/${slug}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.news) {
          setNews(data.news);
        }
        try {
          const newsRes = await fetch("/api/news?status=PUBLISHED");
          const newsData = await newsRes.json();
          const filtered = (newsData.news || []).filter(
            (n) => n.slug !== data.news.slug && n.id !== data.news.id,
          );
          setRelatedNews(filtered.slice(0, 3));
        } catch (err) {
          console.warn("Failed to fetch related news:", err);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch news:", err);
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return <div className="min-h-screen bg-zinc-100" />;
  if (!news) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center font-['Plus_Jakarta_Sans'] text-neutral-500">
        Artikel berita tidak ditemukan.
      </div>
    );
  }

  const rawGallery = news.galleryImages || news.gallery || news.images || [];
  const formattedGallery = rawGallery.map((item) => {
    if (typeof item === "string") {
      if (item.startsWith("{") || item.startsWith("[")) {
        try {
          const parsed = JSON.parse(item);
          if (parsed && typeof parsed === "object" && parsed.url) {
            return { url: parsed.url, caption: parsed.caption || "" };
          }
        } catch {}
      }
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

  const publishDate = news.createdAt
    ? new Date(news.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "9 Juli 2026";

  return (
    <main className="w-full bg-zinc-100 min-h-screen pt-[76px] lg:pt-[88px] pb-20 md:pb-24 px-4 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-[1144px] flex flex-col gap-3">
        {/* Header Group */}
        <div className="w-full flex flex-col gap-1.5 md:gap-2 px-1 md:px-2">
          {news && (
            <Breadcrumbs
              items={[
                { label: "Beranda", href: "/" },
                { label: "Berita", href: "/berita" },
                { label: news?.title || "Detail Berita" },
              ]}
            />
          )}
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
        </div>

        <FadeUp
          delay={0.2}
          className="w-full bg-white rounded-[24px] md:rounded-[48px] px-5 md:px-8 pt-4 pb-6 lg:pt-5 lg:pb-8 flex flex-col gap-4 md:gap-6 shadow-sm border border-neutral-100"
        >
          <div className="w-full flex flex-col gap-2.5 md:gap-3">
            <div className="w-full text-left">
              <p className="text-neutral-500 text-[11px] md:text-[13px] font-bold font-['Plus_Jakarta_Sans'] tracking-widest uppercase">
                Berita Terkini • {publishDate}
              </p>
            </div>

            <div className="w-full h-[220px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-xl md:rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden relative">
              <CldImg
                src={news.imageUrl || news.image || "/carousel1.svg"}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="w-full text-left text-black text-2xl md:text-3xl lg:text-4xl font-bold font-['Montserrat'] leading-snug">
            {formatYellowText(news.title)}
          </h1>

          <hr className="border-neutral-100 w-full" />

          <div className="w-full text-neutral-800 text-[14px] md:text-[15px] font-normal font-['Montserrat'] leading-[1.8] whitespace-pre-line text-justify">
            {formatYellowText(news.content || news.description || news.desc)}
          </div>

          <hr className="border-neutral-100 w-full mt-4" />
          <div className="w-full flex flex-col items-start gap-2">
            <span className="text-black text-[11px] md:text-xs font-semibold tracking-wide uppercase">
              Bagikan Artikel ini:
            </span>
            <ShareButtons
              title={news.title}
              url={`${process.env.NEXT_PUBLIC_APP_URL || "https://sinarcerahsempurna.com"}/berita/${news.slug}`}
              description={
                news.excerpt?.slice(0, 100) || news.content?.slice(0, 100) || ""
              }
            />
          </div>
        </FadeUp>

        <FadeUp
          delay={0.3}
          className="w-full bg-white rounded-[24px] md:rounded-[48px] px-5 md:px-8 py-6 lg:py-8 flex flex-col gap-5 md:gap-8 shadow-sm border border-neutral-100"
        >
          <div className="w-full text-left">
            <h2 className="text-black text-xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
              Galeri
            </h2>
          </div>
          {formattedGallery.length > 0 ? (
            <InteractiveGallery images={formattedGallery} />
          ) : (
            <div className="w-full py-12 md:py-16 flex flex-col items-center justify-center bg-zinc-50 rounded-2xl border-2 border-dashed border-neutral-200">
              <img
                src="/no-picture.svg"
                alt="Tidak ada gambar"
                className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 opacity-40 object-contain"
              />
              <p className="text-neutral-500 text-[13px] md:text-[15px] font-medium font-['Plus_Jakarta_Sans'] text-center px-4">
                Belum ada foto dokumentasi untuk berita ini.
              </p>
            </div>
          )}
        </FadeUp>

        {relatedNews.length > 0 && (
          <FadeUp
            delay={0.4}
            className="mt-6 md:mt-8 w-full bg-white rounded-[24px] md:rounded-[48px] px-5 md:px-8 py-6 lg:py-8 flex flex-col gap-5 md:gap-8 shadow-sm border border-neutral-100"
          >
            <div className="w-full text-left">
              <h2 className="text-black text-xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
                Berita Lainnya
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-[#004282]/30 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                >
                  <div className="aspect-video w-full overflow-hidden bg-zinc-100">
                    <CldImg
                      src={item.imageUrl || "/carousel1.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-neutral-800 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" },
                          )
                        : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </FadeUp>
        )}
      </div>
    </main>
  );
}

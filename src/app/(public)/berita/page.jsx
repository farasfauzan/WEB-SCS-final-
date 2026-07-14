"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FadeUp from "@/components/ui/FadeUp";
import Pagination from "@/components/shared/Pagination";
import NewsList from "@/components/views/berita/NewsList";
import SearchBar from "@/components/views/berita/SearchBar";
import NewsSkeleton from "@/components/ui/NewsSkeleton";
import HeroTitle from "@/components/shared/HeroTitle";
import BoldText from "@/components/shared/BoldText";
import { IMAGE_SIZES } from "@/lib/cloudinary";
import OptimizedImage from "@/components/shared/OptimizedImage";

function BeritaContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q")?.toLowerCase() || "";
  const currentPage = searchParams?.get("page") || "1";
  
  const [heroData, setHeroData] = useState(null);
  const [allNews, setAllNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hero?page=news")
      .then((res) => res.json())
      .then((data) => {
        if (data.heroes?.length > 0) setHeroData(data.heroes[0]);
      })
      .catch(() => {});

    fetch("/api/news?status=PUBLISHED")
      .then((res) => res.json())
      .then((data) => {
        if (data.news?.length > 0) {
          const formatted = data.news.map((n) => ({
            id: n.id,
            title: n.title,
            desc: n.excerpt || n.content,
            imageUrl: n.imageUrl || "",
            image: n.imageUrl || ""
          }));
          setAllNews(formatted);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const heroTitle = heroData?.title || "**Kilas Balik** & **Berita Terkini**";
  const heroDesc = heroData?.description || "Simak perjalanan dan perkembangan terbaru dari proyek-proyek strategis kami. Informasi seputar kemajuan, kolaborasi, dan dedikasi kami dalam menghadirkan solusi konstruksi berkualitas di Indonesia.";

  // Filter pencarian
  const filteredNews = allNews.filter((news) => {
    return (
      news.title?.toLowerCase().includes(query) || 
      news.desc?.toLowerCase().includes(query)
    );
  });

  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pb-24">
      
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center rounded-b-[64px] overflow-hidden bg-[#004282]">
        <div className="absolute inset-0 z-0">
          <OptimizedImage src={heroData?.imageUrl || "/carousel1.svg"} alt="Background Berita" fill priority cldOptions={IMAGE_SIZES.hero} className="object-cover" />
          <div className="absolute inset-0 bg-[#004282]/85"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col gap-5 mt-10">
          <HeroTitle
            text={heroTitle}
            className="text-white text-[clamp(2rem,4vw,3.5rem)] font-extrabold font-['Plus_Jakarta_Sans'] leading-tight"
          />
          <BoldText 
            text={heroDesc} 
            className="text-white/90 text-[clamp(0.9rem,1.5vw,1.1rem)] font-normal font-['Plus_Jakarta_Sans'] leading-relaxed max-w-[800px] mx-auto" 
            as="p" 
          />
        </div>
      </section>

      <section id="daftar-konten" className="relative z-20 -mt-[26px] px-6 flex justify-center">
        <FadeUp delay={0.3} className="w-full max-w-7xl">
          <SearchBar />
        </FadeUp>
      </section>

      <section className="w-full flex justify-center pt-[clamp(3rem,5vh,4rem)] px-6">
        <FadeUp delay={0.4} className="max-w-7xl w-full flex flex-col gap-[clamp(2rem,5vh,3rem)]">
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {Array(6).fill(0).map((_, idx) => <NewsSkeleton key={`news-skel-${idx}`} />)}
            </div>
          ) : filteredNews.length > 0 ? (
            <NewsList newsData={filteredNews} />
          ) : (
            <div className="text-center text-neutral-500 py-16 font-semibold font-['Plus_Jakarta_Sans']">
              Berita dengan kata kunci &quot;{query}&quot; tidak ditemukan.
            </div>
          )}

          {!isLoading && filteredNews.length > 0 && (
            <Pagination 
              totalPages={Math.max(1, Math.ceil(filteredNews.length / 9))} 
              basePath="/berita" 
              scrollId="daftar-konten" 
            />
          )}
          
        </FadeUp>
      </section>
    </main>
  );
}

export default function BeritaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F1F1F1]" />}>
      <BeritaContent />
    </Suspense>
  );
}
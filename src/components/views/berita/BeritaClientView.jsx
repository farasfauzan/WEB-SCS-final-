"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FadeUp from "@/components/ui/FadeUp";
import Pagination from "@/components/shared/Pagination";
import NewsList from "@/components/views/berita/NewsList";
import SearchBar from "@/components/views/berita/SearchBar";
import NewsSkeleton from "@/components/ui/NewsSkeleton";
import HeroTitle from "@/components/shared/HeroTitle";
import BoldText from "@/components/shared/BoldText";
import CldImg from "@/components/shared/CldImg";

function BeritaHero({ heroData }) {
  return (
    <section className="relative w-full h-[50vh] min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center rounded-b-[32px] md:rounded-b-[64px] overflow-hidden bg-[#004282]">
      <div className="absolute inset-0 z-0">
        <CldImg
          src={heroData?.imageUrl || "/carousel1.svg"}
          alt=""
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#004282]/85"></div>
      </div>
      <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col gap-5 mt-10">
        <HeroTitle
          text={heroData?.title || "**Kilas Balik** & **Berita Terkini**"}
          className="text-white text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-tight"
        />
        <BoldText
          text={
            heroData?.description ||
            "Simak perjalanan dan perkembangan terbaru kami."
          }
          className="text-white/90 text-[clamp(0.9rem,1.5vw,1.1rem)] font-normal leading-relaxed max-w-[800px] mx-auto"
          as="p"
        />
      </div>
    </section>
  );
}

function BeritaInteractive({ initialNews }) {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q")?.toLowerCase() || "";
  const currentPage = Number(searchParams?.get("page")) || 1;

  const formattedNews = initialNews.map((n) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    desc: n.excerpt || n.content,
    imageUrl: n.imageUrl || "",
    image: n.imageUrl || "",
  }));

  const filteredNews = formattedNews.filter((news) => {
    return (
      news.title?.toLowerCase().includes(query) ||
      news.desc?.toLowerCase().includes(query)
    );
  });

  const ITEMS_PER_PAGE = 9;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredNews.length / ITEMS_PER_PAGE),
  );

  return (
    <>
      <section
        id="daftar-konten"
        className="relative z-20 -mt-[26px] px-6 flex justify-center"
      >
        <FadeUp delay={0.3} className="w-full max-w-7xl">
          <SearchBar />
        </FadeUp>
      </section>

      <section className="w-full flex justify-center pt-[clamp(3rem,5vh,4rem)] px-6">
        <FadeUp
          delay={0.4}
          className="max-w-7xl w-full flex flex-col gap-[clamp(2rem,5vh,3rem)]"
        >
          {currentNews.length > 0 ? (
            <NewsList newsData={currentNews} />
          ) : (
            <div className="text-center text-neutral-500 py-16 font-semibold">
              Berita dengan kata kunci &quot;{query}&quot; tidak ditemukan.
            </div>
          )}
          {filteredNews.length > ITEMS_PER_PAGE && (
            <Pagination
              totalPages={totalPages}
              basePath="/berita"
              scrollId="daftar-konten"
            />
          )}
        </FadeUp>
      </section>
    </>
  );
}

export default function BeritaClientView({ heroData, initialNews }) {
  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pb-24">
      <BeritaHero heroData={heroData} />

      <Suspense
        fallback={
          <section className="w-full flex justify-center pt-[clamp(3rem,5vh,4rem)] px-6 mt-10">
            {/* PERBAIKAN SKELETON: Harus sinkron dengan NewsList, gap-4 md:gap-8 */}
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {Array(6)
                .fill(0)
                .map((_, idx) => (
                  <NewsSkeleton key={`skel-news-${idx}`} />
                ))}
            </div>
          </section>
        }
      >
        <BeritaInteractive initialNews={initialNews} />
      </Suspense>
    </main>
  );
}

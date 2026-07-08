import { Suspense } from "react";
import FadeUp from "@/components/ui/FadeUp";
import Pagination from "@/components/shared/Pagination";
import NewsList from "@/components/views/berita/NewsList";
import SearchBar from "@/components/views/berita/SearchBar";
import NewsSkeleton from "@/components/ui/NewsSkeleton";

export const metadata = {
  title: "Berita & Pembaruan | PT Sinar Cerah Sempurna",
};

export default async function BeritaPage({ searchParams }) {
  const query = searchParams?.q?.toLowerCase() || "";
  const currentPage = searchParams?.page || "1";
  const suspenseKey = query + currentPage; 

  const allNews = [
    { id: 1, title: "Peresmian Kantor Baru PT Sinar Cerah Sempurna", desc: "Peresmian kantor baru ini tidak hanya menandai bertambahnya fasilitas operasional...", image: "/hero-bg.svg" },
    { id: 2, title: "Penghargaan Kontraktor Terbaik 2026", desc: "SCS berhasil meraih penghargaan nasional berkat komitmen pada standar keselamatan...", image: "" },
    { id: 3, title: "Penerapan Beton Ramah Lingkungan", desc: "Dalam proyek terbaru, kami mulai mengimplementasikan penggunaan material konstruksi hijau...", image: "" },
    { id: 4, title: "Kerja Sama dengan Universitas Diponegoro", desc: "Penandatanganan MoU dengan Fakultas Teknik Universitas Diponegoro untuk program magang mahasiswa.", image: "" },
  ];

  const filteredNews = allNews.filter((news) => {
    return (
      news.title.toLowerCase().includes(query) || 
      news.desc.toLowerCase().includes(query)
    );
  });

  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pb-24">
      
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center rounded-b-[64px] overflow-hidden bg-[#004282]">
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.svg" alt="Background Berita" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#004282]/85"></div>
        </div>
        <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col gap-[clamp(0.75rem,2vh,1.25rem)] mt-10">
          <FadeUp delay={0.1}>
            <h1 className="text-white text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold font-['Plus_Jakarta_Sans'] leading-tight">
              Kilas Balik & Berita Terkini
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-white/90 text-[clamp(0.9rem,1.5vw,1.1rem)] font-normal font-['Plus_Jakarta_Sans'] leading-relaxed max-w-[800px] mx-auto">
              Simak perjalanan dan perkembangan terbaru dari proyek-proyek strategis kami. Informasi seputar kemajuan, kolaborasi, dan dedikasi kami dalam menghadirkan solusi konstruksi berkualitas di Indonesia.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* OVERLAP DIREVISI JADI -mt-[26px] AGAR PAS 50/50 */}
      <section id="daftar-konten" className="relative z-20 -mt-[26px] px-6 flex justify-center">
        <FadeUp delay={0.3} className="w-full max-w-7xl">
          <SearchBar />
        </FadeUp>
      </section>

      <section className="w-full flex justify-center pt-[clamp(3rem,5vh,4rem)] px-6">
        <FadeUp delay={0.4} className="max-w-7xl w-full flex flex-col gap-[clamp(2rem,5vh,3rem)]">
          
          {filteredNews.length > 0 ? (
            <Suspense 
              key={suspenseKey} 
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  {Array(6).fill(0).map((_, idx) => <NewsSkeleton key={`news-skel-${idx}`} />)}
                </div>
              }
            >
              <NewsList newsData={filteredNews} />
            </Suspense>
          ) : (
            <div className="text-center text-neutral-500 py-16 font-semibold font-['Plus_Jakarta_Sans']">
              Berita dengan kata kunci &quot;{query}&quot; tidak ditemukan.
            </div>
          )}

          {filteredNews.length > 0 && <Pagination totalPages={3} basePath="/berita" scrollId="daftar-konten" />}
          
        </FadeUp>
      </section>

    </main>
  );
}
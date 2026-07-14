"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FadeUp from "@/components/ui/FadeUp";
import ProjectCard from "@/components/shared/ProjectCard";
import Pagination from "@/components/shared/Pagination";
import ProjectSkeleton from "@/components/ui/ProjectSkeleton"; 
import HeroTitle from "@/components/shared/HeroTitle";
import BoldText from "@/components/shared/BoldText";
import { IMAGE_SIZES } from "@/lib/cloudinary";
import OptimizedImage from "@/components/shared/OptimizedImage";

function ProyekContent() {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || "1";

  const [activeFilter, setActiveFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [hero, setHero] = useState({
    title: "**Visi** Kami dalam **Karya**",
    desc: "Dedikasi kami tertuang dalam setiap detail proyek. Kami menggabungkan inovasi konstruksi dengan standar kualitas tertinggi untuk menghadirkan bangunan yang bukan sekadar fungsional, namun inspiratif.",
    imageUrl: "/carousel3.svg"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [prevPage, setPrevPage] = useState(currentPage);

  if (currentPage !== prevPage) {
    setPrevPage(currentPage);
    setIsLoading(true);
  }
  
  const categories = ["Semua", "Rumah Sakit", "Gedung Pendidikan", "Pusat Perbelanjaan", "Lainnya"];

  useEffect(() => {
    // 1. Ambil data teks Hero
    fetch("/api/hero?page=projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.heroes?.length > 0) {
          setHero({ 
            title: data.heroes[0].title || "**Visi** Kami dalam **Karya**", 
            desc: data.heroes[0].description || "Dedikasi kami tertuang dalam setiap detail proyek.",
            imageUrl: data.heroes[0].imageUrl || "/carousel3.svg"
          });
        }
      })
      .catch(() => {});

    // 2. Ambil data Proyek
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.projects?.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(() => {})
      .finally(() => {
        // Setelah data selesai diambil, beri jeda sedikit agar animasi skeleton UI-mu terlihat smooth
        setTimeout(() => setIsLoading(false), 600);
      });
  }, []); 

  // Filter logika gabungan: Menyaring data dari database berdasarkan filter & pencarian UI-mu
  const filteredProjects = projects.filter((proj) => {
    const matchCategory = activeFilter === "Semua" || proj.category === activeFilter;
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    // Defensive check (berjaga-jaga jika ada data kosong dari database)
    const title = proj.title?.toLowerCase() || "";
    const location = proj.location?.toLowerCase() || "";
    const client = proj.client?.toLowerCase() || "";

    const matchSearch = 
      title.includes(lowerCaseQuery) ||
      location.includes(lowerCaseQuery) ||
      client.includes(lowerCaseQuery);
      
    return matchCategory && matchSearch;
  });

  const handleFilterChange = (cat) => {
    if (cat === activeFilter) return; 
    setActiveFilter(cat);
    setIsLoading(true);
    // Efek skeleton muncul sebentar saat pindah kategori
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pb-24">
      
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center rounded-b-[64px] overflow-hidden bg-[#004282]">
        <div className="absolute inset-0 z-0">
          <OptimizedImage src={hero.imageUrl} alt="Background Proyek" fill priority cldOptions={IMAGE_SIZES.hero} className="object-cover" />
          <div className="absolute inset-0 bg-[#004282]/85"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center gap-[clamp(0.75rem,2vh,1.25rem)] mt-10">
          <HeroTitle
            text={hero.title}
            className="text-white text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold font-['Plus_Jakarta_Sans'] leading-tight"
          />
          <BoldText 
            text={hero.desc} 
            className="text-white/90 text-[clamp(0.9rem,1.5vw,1.1rem)] font-normal font-['Plus_Jakarta_Sans'] leading-relaxed max-w-[693px]" 
            as="p" 
          />
        </div>
      </section>

      {/* FILTER & CARI */}
      <section id="daftar-konten" className="relative z-20 -mt-[26px] flex justify-center px-6">
        <FadeUp delay={0.3} className="w-full max-w-7xl flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center p-1.5 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-x-auto w-full lg:w-auto scrollbar-hide">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => handleFilterChange(cat)}
                className={`px-6 py-2.5 rounded-full text-[14px] font-semibold font-['Plus_Jakarta_Sans'] transition-all duration-300 whitespace-nowrap ${
                  activeFilter === cat 
                    ? "bg-[#5a67d8] text-white shadow-sm" 
                    : "bg-transparent text-neutral-500 hover:text-[#004282]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white rounded-full pl-6 pr-1.5 py-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full lg:w-[320px] shrink-0">
            <input 
              type="text" 
              placeholder="Cari proyek, lokasi, klien..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-transparent border-none outline-none text-neutral-600 font-['Plus_Jakarta_Sans'] text-[15px]" 
            />
            <button className="w-10 h-10 rounded-full bg-[#5a67d8] flex items-center justify-center hover:scale-105 transition-transform shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </FadeUp>
      </section>

      <section className="w-full flex justify-center pt-[clamp(3rem,5vh,4rem)] px-6">
        <FadeUp delay={0.4} className="max-w-7xl w-full flex flex-col gap-[clamp(2rem,5vh,3rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, idx) => <ProjectSkeleton key={`skeleton-${idx}`} />)
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((proj) => <ProjectCard key={proj.id} project={proj} />)
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-neutral-500 py-16 font-semibold font-['Plus_Jakarta_Sans']">
                Pencarian untuk &quot;{searchQuery}&quot; di kategori {activeFilter} tidak ditemukan.
              </div>
            )}
          </div>
          
          {!isLoading && filteredProjects.length > 0 && (
            <Pagination totalPages={Math.max(1, Math.ceil(filteredProjects.length / 9))} basePath="/proyek" scrollId="daftar-konten" />
          )}
        </FadeUp>
      </section>

    </main>
  );
}

// Mengekspor komponen dengan Suspense sebagai standar keamanan Next.js
export default function ProyekPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F1F1F1]" />}>
      <ProyekContent />
    </Suspense>
  );
}
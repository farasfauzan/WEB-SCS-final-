"use client";
import { useState } from "react";
import FadeUp from "@/components/ui/FadeUp";
import ProjectCard from "@/components/shared/ProjectCard";
import Link from "next/link";

export default function ProjectPreview() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const categories = ["Semua", "Rumah Sakit", "Gedung Pendidikan", "Pusat Perbelanjaan", "Lainnya"];

  const allProjects = [
    { id: 1, title: "Renovasi Eks Kantor menjadi Gedung Paviliun", category: "Rumah Sakit", location: "RSUD Aji Muhammad Parikesit", client: "Pemkab Kutai Kartanegara", image: "" },
    { id: 2, title: "Pembangunan Gedung Rektorat", category: "Gedung Pendidikan", location: "Universitas Diponegoro", client: "Kemenristekdikti", image: "" },
    { id: 3, title: "Ekspansi Mall Central", category: "Pusat Perbelanjaan", location: "Semarang Tengah", client: "PT Retail Indo", image: "" },
    { id: 4, title: "Klinik Utama Sehat", category: "Rumah Sakit", location: "Semarang Selatan", client: "Dinas Kesehatan", image: "" },
    { id: 5, title: "Renovasi Pasar Johar", category: "Pusat Perbelanjaan", location: "Kota Semarang", client: "Pemkot Semarang", image: "" },
  ];

  const filteredProjects = activeCategory === "Semua" 
    ? allProjects.slice(0, 3) 
    : allProjects.filter(p => p.category === activeCategory).slice(0, 3);

  return (
    <section className="w-full bg-[#F1F1F1] py-[clamp(3rem,8vh,6rem)] flex flex-col items-center justify-center px-6">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        
        <FadeUp delay={0.1} className="text-center flex flex-col gap-3 max-w-3xl mb-[clamp(1.5rem,4vh,2.5rem)]">
          <h2 className="text-black text-[clamp(1.75rem,3.5vw,2.25rem)] font-extrabold font-['Plus_Jakarta_Sans']">Visi Kami dalam Karya</h2>
          <p className="text-stone-600 text-sm md:text-base font-normal font-['Plus_Jakarta_Sans'] px-4">
            Dedikasi kami tertuang dalam setiap detail proyek. Kami menggabungkan inovasi konstruksi dengan standar kualitas tertinggi.
          </p>
        </FadeUp>

        <FadeUp delay={0.2} className="mb-8">
          <div className="bg-white rounded-full p-1.5 shadow-sm inline-flex items-center justify-center flex-wrap gap-1">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
                  activeCategory === cat ? "bg-[#6B7AE5] text-white shadow-sm" : "text-neutral-400 hover:text-stone-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mb-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((item, idx) => (
              <FadeUp key={item.id} delay={0.3 + (idx * 0.1)}>
                <ProjectCard project={item} />
              </FadeUp>
            ))
          ) : (
            <div className="col-span-3 text-center text-neutral-400 py-10 font-semibold text-sm">
              Belum ada proyek di kategori ini.
            </div>
          )}
        </div>

        <FadeUp delay={0.6} className="w-full flex justify-end">
          <Link href="/proyek" className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-bold text-xs md:text-sm font-['Plus_Jakarta_Sans'] transition-colors">
            Lihat Semua 
            <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </FadeUp>

      </div>
    </section>
  );
}
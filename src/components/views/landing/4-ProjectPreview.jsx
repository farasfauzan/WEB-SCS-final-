"use client";
import { useState } from "react";
import FadeUp from "@/components/ui/FadeUp";
import ProjectCard from "@/components/shared/ProjectCard";
import Link from "next/link";

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "Renovasi Eks Kantor menjadi Gedung Paviliun",
    category: "Rumah Sakit",
    location: "RSUD Aji Muhammad Parikesit",
    client: "Pemkab Kutai Kartanegara",
    imageUrl: "",
  },
  {
    id: 2,
    title: "Pembangunan Gedung Rektorat",
    category: "Gedung Pendidikan",
    location: "Universitas Diponegoro",
    client: "Kemenristekdikti",
    imageUrl: "",
  },
  {
    id: 3,
    title: "Ekspansi Mall Central",
    category: "Pusat Perbelanjaan",
    location: "Semarang Tengah",
    client: "PT Retail Indo",
    imageUrl: "",
  },
];

export default function ProjectPreview({ data }) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    "Semua",
    "Rumah Sakit",
    "Gedung Pendidikan",
    "Pusat Perbelanjaan",
    "Fasilitas Olahraga",
    "Infrastruktur Publik",
    "Perumahan",
    "Komersial & Perkantoran",
    "Lainnya",
  ];

  const allProjects = data?.length > 0 ? data : FALLBACK_PROJECTS;

  const filteredProjects =
    activeCategory === "Semua"
      ? allProjects.slice(0, 3)
      : allProjects.filter((p) => p.category === activeCategory).slice(0, 3);

  return (
    <section className="w-full bg-[#F1F1F1] pt-[clamp(3rem,8vh,6rem)] pb-8 md:pb-[clamp(3rem,8vh,6rem)] flex flex-col items-center justify-center px-6">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        <FadeUp
          delay={0.1}
          className="text-center flex flex-col gap-3 max-w-3xl mb-[clamp(1.5rem,4vh,2.5rem)]"
        >
          <h2 className="text-black text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold font-['Plus_Jakarta_Sans']">
            Visi Kami dalam Karya
          </h2>
          <p className="text-stone-600 text-[13px] md:text-base font-normal font-['Plus_Jakarta_Sans'] px-4">
            Dedikasi kami tertuang dalam setiap detail proyek. Kami
            menggabungkan inovasi konstruksi dengan standar kualitas tertinggi.
          </p>
        </FadeUp>

        <FadeUp
          delay={0.2}
          className="mb-5 md:mb-8 w-full flex justify-start md:justify-center relative z-20"
        >
          {/* ======================= */}
          {/* DESKTOP VIEW            */}
          {/* ======================= */}
          <div className="hidden md:inline-flex bg-white rounded-full p-1.5 shadow-sm items-center justify-center flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#6B7AE5] text-white shadow-sm" // Disesuaikan menjadi ungu agar seragam
                    : "text-neutral-400 hover:text-stone-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ======================= */}
          {/* MOBILE VIEW (Identik)   */}
          {/* ======================= */}
          <div className="md:hidden relative self-start z-30">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-3 px-5 py-2.5 bg-white rounded-full shadow-md border border-neutral-100 text-[#6B7AE5] text-[14px] font-bold z-20 relative"
            >
              {activeCategory}
              <svg
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            {/* Layer Transparan Penjaga Klik Luar */}
            <div
              className={`fixed inset-0 z-40 ${isDropdownOpen ? "block" : "hidden"}`}
              onClick={() => setIsDropdownOpen(false)}
              aria-hidden="true"
            />

            {/* Dropdown Menu (Animasi scale-y) */}
            <div
              className={`absolute top-[calc(100%+8px)] left-0 w-[220px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-neutral-100 overflow-hidden z-50 flex flex-col py-2 origin-top transition-all duration-300 ${
                isDropdownOpen
                  ? "scale-y-100 opacity-100 pointer-events-auto"
                  : "scale-y-0 opacity-0 pointer-events-none"
              }`}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setIsDropdownOpen(false);
                  }}
                  className={`px-5 py-3 text-left text-[14px] font-semibold transition-colors ${
                    activeCategory === cat
                      ? "bg-[#6B7AE5] text-white"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full mb-4 relative z-10">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((item, idx) => (
              <FadeUp key={item.id} delay={0.3 + idx * 0.1}>
                <ProjectCard project={item} />
              </FadeUp>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center text-neutral-400 py-10 font-semibold text-sm">
              Belum ada proyek di kategori ini.
            </div>
          )}
        </div>

        <FadeUp delay={0.6} className="w-full flex justify-end mt-2 md:mt-0">
          <Link
            href="/proyek"
            className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-bold text-xs md:text-sm font-['Plus_Jakarta_Sans'] transition-colors"
          >
            Lihat Semua
            <svg
              className="w-4 h-4 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

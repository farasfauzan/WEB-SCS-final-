"use client";

import { useState, useEffect } from "react";
import FadeUp from "@/components/ui/FadeUp";
import HeroTitle from "@/components/shared/HeroTitle";
import BoldText from "@/components/shared/BoldText";
import CldImg from "@/components/shared/CldImg";

const FALLBACK = {
  subtitle: "PT SINAR CERAH SEMPURNA",
  title:
    "**Integrity** isn't just a policy—it's the standard we build by. Your **trust** is our greatest structure.",
  description:
    "PT Sinar Cerah Sempurna adalah perusahaan konstruksi dan infrastruktur yang berpengalaman dalam pembangunan gedung, jalan, jembatan, dan berbagai proyek infrastruktur lainnya di Indonesia.",
  imageUrl: "/hero-bg.svg",
};

export default function HeroSection({ data }) {
  const hero = data || FALLBACK;
  const [showArrow, setShowArrow] = useState(true);

  // Memantau scroll untuk menghilangkan panah
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi untuk meluncur ke section berikutnya
  const scrollToNext = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full min-h-[100svh] py-[clamp(4rem,10vh,8rem)] bg-[#004282] overflow-hidden flex items-center rounded-b-[64px]">
      <div className="absolute inset-0 z-0">
        <CldImg
          src={hero.imageUrl}
          alt="Background"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-[#004282]/85"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        <div className="flex flex-col gap-6 md:gap-4">
          <FadeUp delay={0.1}>
            <BoldText
              text={hero.subtitle || FALLBACK.subtitle}
              className="text-white text-xs md:text-sm font-semibold tracking-widest uppercase"
              as="span"
            />
          </FadeUp>

          <FadeUp delay={0.2}>
            <HeroTitle
              text={hero.title || FALLBACK.title}
              className="text-white text-[2.25rem] leading-[1.35] md:text-[clamp(2.5rem,5vw,4rem)] md:leading-[1.05] font-serif tracking-tight"
            />
          </FadeUp>

          <FadeUp delay={0.3}>
            <BoldText
              text={hero.description || FALLBACK.description}
              className="text-white text-[13px] md:text-[15px] font-normal font-['Plus_Jakarta_Sans'] leading-relaxed opacity-90 max-w-lg mt-2"
              as="p"
            />
          </FadeUp>
        </div>

        <FadeUp delay={0.4} className="hidden md:flex gap-5 h-[420px] relative">
          <div className="w-1/2 h-[85%] mt-8 rounded-xl overflow-hidden shadow-2xl border-[3px] border-white/20">
            <CldImg
              src={hero.heroImage2 || "/foto-hero1.svg"}
              alt="Konstruksi 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/2 h-[85%] mb-8 rounded-xl overflow-hidden shadow-2xl border-[3px] border-white/20">
            <CldImg
              src={hero.heroImage3 || "/foto-hero2.svg"}
              alt="Konstruksi 2"
              className="w-full h-full object-cover"
            />
          </div>
        </FadeUp>
      </div>

      {/* Tanda Panah Interaktif */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-500 ${
          showArrow ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={scrollToNext}
          aria-label="Scroll ke konten berikutnya"
          className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:bg-white/30 transition-colors animate-bounce cursor-pointer"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-white opacity-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </button>
      </div>
    </section>
  );
}

"use client";
import { useState, useEffect } from "react";
import FadeUp from "@/components/ui/FadeUp";
import HeroTitle from "@/components/shared/HeroTitle";
import BoldText from "@/components/shared/BoldText";

export default function HeroSection() {
  // State bawaan dengan desain fallback milikmu
  const [hero, setHero] = useState({
    subtitle: "PT SINAR CERAH SEMPURNA",
    title: "**Integrity** isn't just a policy—it's the standard we build by. Your **trust** is our greatest structure.",
    description: "PT Sinar Cerah Sempurna adalah perusahaan konstruksi dan infrastruktur yang berpengalaman dalam pembangunan gedung, jalan, jembatan, dan berbagai proyek infrastruktur lainnya di Indonesia.",
    imageUrl: "/hero-bg.svg"
  });

  // Fetch API secara aman di Client-side (mencegah infinite loop)
  useEffect(() => {
    fetch("/api/hero?page=home")
      .then((res) => res.json())
      .then((data) => {
        if (data.heroes?.length > 0) {
          setHero({
            subtitle: data.heroes[0].subtitle || hero.subtitle,
            title: data.heroes[0].title || hero.title,
            description: data.heroes[0].description || hero.description,
            imageUrl: data.heroes[0].imageUrl || hero.imageUrl
          });
        }
      })
      .catch(() => {});
  }, []); // Array kosong memastikan ini hanya dipanggil 1 kali!

  return (
    <section className="relative w-full min-h-[100svh] py-[clamp(4rem,10vh,8rem)] bg-[#004282] overflow-hidden flex items-center rounded-b-[64px]">
      
      {/* Background & Overlay Biru Transparan */}
      <div className="absolute inset-0 z-0">
        <img src={hero.imageUrl} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#004282]/85"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        
        {/* Kolom Kiri: Teks */}
        <div className="flex flex-col gap-4">
          <FadeUp delay={0.1}>
            <BoldText 
              text={hero.subtitle} 
              className="text-white text-xs md:text-sm font-semibold tracking-widest uppercase" 
              as="span" 
            />
          </FadeUp>
          
          <FadeUp delay={0.2}>
            <HeroTitle
              text={hero.title}
              className="text-white text-[clamp(2.5rem,5vw,4rem)] font-serif leading-[1.05] tracking-tight"
            />
          </FadeUp>
          
          <FadeUp delay={0.3}>
            <BoldText 
              text={hero.description} 
              className="text-white text-[15px] font-normal font-['Plus_Jakarta_Sans'] leading-relaxed opacity-90 max-w-lg mt-2" 
              as="p" 
            />
          </FadeUp>
        </div>

        {/* Kolom Kanan: 2 Foto SVG */}
        <FadeUp delay={0.4} className="hidden md:flex gap-5 h-[420px] relative">
          <div className="w-1/2 h-[85%] mt-8 rounded-xl overflow-hidden shadow-2xl border-[3px] border-white/20">
             <img src="/foto-hero1.svg" alt="Konstruksi 1" className="w-full h-full object-cover" />
          </div>
          <div className="w-1/2 h-[85%] mb-8 rounded-xl overflow-hidden shadow-2xl border-[3px] border-white/20">
             <img src="/foto-hero2.svg" alt="Konstruksi 2" className="w-full h-full object-cover" />
          </div>
        </FadeUp>

      </div>
    </section>
  );
}
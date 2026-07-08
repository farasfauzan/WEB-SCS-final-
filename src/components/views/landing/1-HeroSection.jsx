"use client";
import FadeUp from "@/components/ui/FadeUp";

export default function HeroSection() {
  return (
    // Menggunakan min-h-[100svh] dan py dinamis
    <section className="relative w-full min-h-[100svh] py-[clamp(4rem,10vh,8rem)] bg-[#004282] overflow-hidden flex items-center rounded-b-[64px]">
      
      {/* Background & Overlay Biru Transparan */}
      <div className="absolute inset-0 z-0">
        <img src="/hero-bg.svg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#004282]/85"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        
        {/* Kolom Kiri: Teks */}
        <div className="flex flex-col gap-4">
          <FadeUp delay={0.1}>
            <span className="text-white text-xs md:text-sm font-semibold tracking-widest uppercase">
              PT SINAR CERAH SEMPURNA
            </span>
          </FadeUp>
          
          <FadeUp delay={0.2}>
            {/* Ukuran teks judul menggunakan clamp */}
            <h1 className="text-white text-[clamp(2.5rem,5vw,4rem)] font-serif leading-[1.05] tracking-tight">
              <span className="text-yellow-400 font-bold italic">Integrity</span> isn&apos;t just a policy—it&apos;s the standard we build by. Your <span className="text-yellow-400 font-bold italic">trust</span> is our greatest structure.
            </h1>
          </FadeUp>
          
          <FadeUp delay={0.3}>
            <p className="text-white text-[15px] font-normal font-['Plus_Jakarta_Sans'] leading-relaxed opacity-90 max-w-lg mt-2">
              PT Sinar Cerah Sempurna adalah perusahaan konstruksi dan infrastruktur yang berpengalaman dalam pembangunan gedung, jalan, jembatan, dan berbagai proyek infrastruktur lainnya di Indonesia.
            </p>
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
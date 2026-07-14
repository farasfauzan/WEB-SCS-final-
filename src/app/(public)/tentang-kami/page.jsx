"use client";
import { useState, useEffect } from "react";
import HeroTitle from "@/components/shared/HeroTitle";
import BoldText from "@/components/shared/BoldText";
import FadeUp from "@/components/ui/FadeUp";

export default function TentangKamiPage() {
  const [aboutData, setAboutData] = useState(null);
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    fetch("/api/hero?page=about")
      .then((res) => res.json())
      .then((data) => {
        if (data.heroes?.length > 0) setHeroData(data.heroes[0]);
      })
      .catch(() => {});

    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        if (data.abouts?.length > 0) setAboutData(data.abouts[0]);
      })
      .catch(() => {});
  }, []);

  const heroTitle = heroData?.title || "Membangun dengan **Kepercayaan**, Berkarya dengan **Kualitas**.";
  const heroDesc = heroData?.subtitle || heroData?.description || "Berpegang teguh pada motto \"Memberi Kepuasan Kepada Relasi\", kami terus membangun kepercayaan dalam industri konstruksi melalui dedikasi tinggi. Komitmen ini kami wujudkan dengan konsisten meningkatkan kompetensi Sumber Daya Manusia agar selalu terampil dan profesional.";

  const aboutTitle = aboutData?.title || "Tentang PT Sinar Cerah Sempurna";
  const aboutContent = aboutData?.content || "PT Sinar Cerah Sempurna adalah perusahaan konstruksi dan infrastruktur yang berpengalaman dalam pembangunan gedung, jalan, jembatan, dan berbagai proyek infrastruktur lainnya di Indonesia.";
  const aboutVision = aboutData?.vision || "Menjadi perusahaan konstruksi dan infrastruktur terdepan serta terpercaya di Indonesia, yang diakui karena keunggulan dalam kualitas, keselamatan, dan pembangunan berkelanjutan.";
  
  const aboutMission = aboutData?.mission 
    ? aboutData.mission.split("\n").filter(m => m.trim() !== '') 
    : [
        "Memberikan layanan konstruksi berkualitas tinggi yang melampaui ekspektasi klien dan memenuhi standar internasional.",
        "Menerapkan praktik terbaik dalam pengelolaan kesehatan, keselamatan kerja, dan lingkungan pada setiap proyek.",
        "Mendorong inovasi melalui adopsi teknologi dan metodologi konstruksi mutakhir.",
        "Membangun hubungan jangka panjang dengan klien, mitra, dan pemangku kepentingan berdasarkan kepercayaan dan transparansi.",
        "Mengembangkan kapabilitas profesional tim kami melalui pelatihan berkelanjutan dan pengembangan karir.",
        "Berkontribusi pada pembangunan berkelanjutan infrastruktur dan lingkungan binaan Indonesia."
      ];

  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pb-24">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center rounded-b-[64px] overflow-hidden bg-[#004282]">
        <div className="absolute inset-0 z-0">
          <img src="/bg-hero-tentang-kami.svg" alt="Background Tentang Kami" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[#004282]/85"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center gap-[clamp(0.75rem,2vh,1.25rem)] mt-10">
          <HeroTitle
            text={heroTitle}
            className="text-white text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold font-['Plus_Jakarta_Sans'] leading-tight whitespace-pre-line"
          />
          <BoldText 
            text={heroDesc} 
            className="text-white/90 text-[clamp(0.9rem,1.5vw,1.1rem)] font-normal font-['Plus_Jakarta_Sans'] leading-relaxed max-w-[850px]" 
            as="p" 
          />
        </div>
      </section>

      {/* KONTEN TENTANG KAMI */}
      <section className="flex flex-col items-center justify-start pt-16 md:pt-20 px-6 gap-12 md:gap-16">
         
         <FadeUp delay={0.1} className="max-w-[800px] w-full text-center flex flex-col gap-4">
            <h2 className="text-[#1E1E1E] text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
              {aboutTitle}
            </h2>
            <p className="text-[#757575] text-[15px] font-normal font-['Plus_Jakarta_Sans'] leading-relaxed whitespace-pre-line">
              {aboutContent}
            </p>
         </FadeUp>

         <FadeUp delay={0.2} className="max-w-[1000px] w-full bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-neutral-200">
            <div className="flex flex-col gap-10">
              <div className="text-center flex flex-col gap-3">
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-[#1E1E1E]">Visi</h3>
                <p className="text-[15px] text-[#424242] font-['Plus_Jakarta_Sans'] leading-relaxed max-w-[800px] mx-auto whitespace-pre-line">
                  {aboutVision}
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-[#1E1E1E] text-center mb-2">Misi</h3>
                <ul className="list-disc pl-5 md:pl-10 space-y-3 text-[15px] text-[#424242] font-['Plus_Jakarta_Sans'] leading-relaxed marker:text-neutral-400">
                  {aboutMission.map((item, idx) => (
                    <li key={idx}>{item.replace(/^-\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            </div>
         </FadeUp>
      </section>

      {/* FONDASI UTAMA */}
      <section className="flex flex-col items-center justify-start py-16 md:py-20 px-6 gap-12 md:gap-16">
         <div className="max-w-[1152px] w-full flex flex-col items-center gap-10">
            <FadeUp delay={0.1} className="text-center flex flex-col gap-3">
              <h2 className="text-[#1E1E1E] text-3xl font-extrabold font-['Plus_Jakarta_Sans']">Fondasi Utama Keunggulan Kami</h2>
              <p className="text-[#757575] text-[15px] font-normal font-['Plus_Jakarta_Sans'] max-w-2xl mx-auto leading-relaxed">
                Nilai-nilai ini adalah inti dari setiap keputusan, desain, dan struktur yang kami bangun. Ini adalah prinsip yang memandu langkah kami untuk selalu memberikan yang terbaik.
              </p>
            </FadeUp>

            <FadeUp delay={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[900px]">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center shrink-0 grayscale opacity-80 transition-all duration-300 hover:grayscale-0">
                  <span className="text-xl">🛡️</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-[#1E1E1E] font-['Plus_Jakarta_Sans']">Integritas</h4>
                  <p className="text-sm text-[#757575] font-['Plus_Jakarta_Sans'] leading-relaxed">Kami menjalankan bisnis dengan kejujuran, transparansi, dan tanggung jawab penuh dalam setiap aspek operasional kami.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center shrink-0 grayscale opacity-80 transition-all duration-300 hover:grayscale-0">
                  <span className="text-xl">💎</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-[#1E1E1E] font-['Plus_Jakarta_Sans']">Kualitas</h4>
                  <p className="text-sm text-[#757575] font-['Plus_Jakarta_Sans'] leading-relaxed">Kami berkomitmen pada standar kualitas tertinggi dalam setiap proyek, ensuring hasil yang melampaui ekspektasi klien.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center shrink-0 grayscale opacity-80 transition-all duration-300 hover:grayscale-0">
                  <span className="text-xl">💡</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-[#1E1E1E] font-['Plus_Jakarta_Sans']">Inovasi</h4>
                  <p className="text-sm text-[#757575] font-['Plus_Jakarta_Sans'] leading-relaxed">Kami terus mengeksplorasi teknologi dan metode konstruksi terbaru untuk memberikan solusi yang lebih efisien dan berkelanjutan.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center shrink-0 grayscale opacity-80 transition-all duration-300 hover:grayscale-0">
                  <span className="text-xl">🤝</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-[#1E1E1E] font-['Plus_Jakarta_Sans']">Kerja Sama Tim</h4>
                  <p className="text-sm text-[#757575] font-['Plus_Jakarta_Sans'] leading-relaxed">Kami percaya bahwa kolaborasi yang kuat antar tim adalah kunci keberhasilan setiap proyek yang kami kerjakan.</p>
                </div>
              </div>
            </FadeUp>
         </div>

      </section>
    </main>
  );
}
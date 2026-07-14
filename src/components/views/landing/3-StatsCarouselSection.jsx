"use client";
import { useState, useEffect } from "react";
import FadeUp from "@/components/ui/FadeUp";

export default function StatsCarouselSection() {
  const [stats, setStats] = useState([
    { value: "5+", label: "Proyek Selesai" },
    { value: "50+", label: "Klien Puas" },
    { value: "25+", label: "Tahun Pengalaman" },
    { value: "200+", label: "Tim Profesional" }
  ]);

  useEffect(() => {
    fetch("/api/statistics")
      .then((res) => res.json())
      .then((data) => {
        if (data.statistics?.length > 0) {
          setStats(data.statistics.map((s) => ({ label: s.label, value: s.value })));
        }
      })
      .catch(() => {});
  }, []);

  const carouselImages = [
    "/carousel1.svg", "/carousel2.svg", "/carousel3.svg", 
    "/carousel4.svg", "/carousel5.svg", "/carousel6.svg"
  ];

  return (
    <section className="w-full bg-[#F1F1F1] pt-10 pb-6 flex flex-col items-center overflow-hidden">
      <style>{`
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 90s linear infinite;
          width: max-content;
        }
      `}</style>

      <FadeUp delay={0.1} className="w-full overflow-hidden mb-12 flex">
        <div className="animate-infinite-scroll flex gap-6 px-3 hover:[animation-play-state:paused] cursor-pointer">
          {[...carouselImages, ...carouselImages].map((img, idx) => (
            <div key={idx} className="w-96 h-60 bg-white rounded-xl overflow-hidden shrink-0 border border-neutral-200 shadow-sm">
              <img src={img} alt={`Proyek ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </FadeUp>

      <FadeUp delay={0.3} className="w-full max-w-[1152px] px-6">
        <div className="w-full h-48 bg-[#004282] rounded-3xl relative overflow-hidden flex items-center justify-center shadow-xl">
          <img src="/bg-carousel.svg" alt="Pattern" className="absolute inset-0 w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-[#004282]/85"></div>
          
          <div className="relative z-10 w-full flex justify-center items-center gap-10 md:gap-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-3">
                <span className="text-white text-4xl font-extrabold font-['Plus_Jakarta_Sans']">{stat.value}</span>
                <span className="text-white text-2xl font-semibold font-['Plus_Jakarta_Sans']">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
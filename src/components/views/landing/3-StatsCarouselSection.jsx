"use client";
import { useState, useEffect } from "react";
import FadeUp from "@/components/ui/FadeUp";
import CldImg from "@/components/shared/CldImg";

export default function StatsCarouselSection({ data }) {
  const fallbackStats = [
    { value: "5+", label: "Proyek Selesai", icon: "/icons/briefcase.svg" },
    { value: "50+", label: "Klien Puas", icon: "/icons/users.svg" },
    {
      value: "25+",
      label: "Tahun Pengalaman",
      icon: "/icons/calendar-days.svg",
    },
    { value: "200+", label: "Tim Profesional", icon: "/icons/user-group.svg" },
  ];

  const stats =
    data?.length > 0
      ? data.map((s) => ({
          label: s.label,
          value: s.value,
          icon: s.icon || "/icons/chart.svg",
        }))
      : fallbackStats;

  const carouselImages = [
    "/carousel1.svg",
    "/carousel2.svg",
    "/carousel3.svg",
    "/carousel4.svg",
    "/carousel5.svg",
    "/carousel6.svg",
  ];

  return (
    <section className="w-full bg-[#F1F1F1] pt-10 pb-6 flex flex-col items-center overflow-hidden">
      <style>{`
        @keyframes infinite-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-infinite-scroll { animation: infinite-scroll 90s linear infinite; width: max-content; }
      `}</style>

      <FadeUp delay={0.1} className="w-full overflow-hidden mb-8 md:mb-12 flex">
        <div className="animate-infinite-scroll flex gap-4 md:gap-6 px-3 hover:[animation-play-state:paused] cursor-default">
          {[...carouselImages, ...carouselImages].map((img, idx) => (
            // KOREKSI: Pengecilan ukuran gambar di layar mobile (w-56 h-36)
            <div
              key={idx}
              className="w-56 h-36 md:w-96 md:h-60 bg-white rounded-xl overflow-hidden shrink-0 border border-neutral-200 shadow-sm"
            >
              <CldImg
                src={img}
                alt={`Proyek ${idx}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </FadeUp>

      <FadeUp delay={0.3} className="w-full max-w-[1152px] px-4 md:px-6">
        <div className="w-full h-auto min-h-[12rem] py-6 md:py-0 md:h-48 bg-[#004282] rounded-3xl relative overflow-hidden flex items-center justify-center shadow-xl">
          <CldImg
            src="/bg-carousel.svg"
            alt="Pattern"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-[#004282]/85"></div>

          {/* KOREKSI: Grid 2 kolom di mobile agar rapi, berjejer 4 di desktop */}
          <div className="relative z-10 w-full grid grid-cols-2 md:flex justify-center items-center gap-6 md:gap-20 px-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center gap-2 md:gap-3"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <CldImg
                    src={stat.icon}
                    alt=""
                    className="w-5 h-5 md:w-6 md:h-6 brightness-0 invert"
                  />
                </div>
                <span className="text-white text-2xl md:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-none">
                  {stat.value}
                </span>
                <span className="text-white text-[13px] md:text-2xl font-semibold font-['Plus_Jakarta_Sans']">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

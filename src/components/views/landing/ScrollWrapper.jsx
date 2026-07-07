"use client";

import HeroSection from "./1-HeroSection";
import VisiMisiSection from "./2-VisiMisiSection";
import StatsCarouselSection from "./3-StatsCarouselSection";
import ProjectPreview from "./4-ProjectPreview";
import NewsPreview from "./5-NewsPreview";
import SinergiSection from "./6-SinergiSection";
import ContactCTA from "./7-ContactCTA";

export default function ScrollWrapper() {
  return (
    <div className="w-full flex flex-col bg-[#F1F1F1]">
      
      {/* 6 Section ini akan memaksa layar mengunci secara penuh (h-screen) */}
      <div className="snap-start snap-always h-screen w-full"><HeroSection /></div>
      <div className="snap-start snap-always h-screen w-full"><VisiMisiSection /></div>
      <div className="snap-start snap-always h-screen w-full"><StatsCarouselSection /></div>
      <div className="snap-start snap-always h-screen w-full"><ProjectPreview /></div>
      <div className="snap-start snap-always h-screen w-full"><NewsPreview /></div>
      <div className="snap-start snap-always h-screen w-full"><SinergiSection /></div>
      
      {/* Contact CTA & Footer mengalir natural (tidak mengunci) */}
      <div className="snap-align-none w-full">
        <ContactCTA />
      </div>

    </div>
  );
}
"use client";
import FadeUp from "@/components/ui/FadeUp";
import Link from "next/link";

export default function ContactCTA() {
  return (
    // Padding Atas (pt) diperkecil agar menempel rapi dengan SinergiSection
    <section className="w-full bg-[#F1F1F1] pt-[clamp(1.5rem,4vh,3rem)] pb-[clamp(3rem,10vh,8rem)] flex justify-center px-4 md:px-6">
      <FadeUp delay={0.1} className="w-full max-w-6xl">
        <div className="w-full py-[clamp(3rem,8vh,4rem)] bg-[#004282] rounded-[24px] md:rounded-3xl relative overflow-hidden flex flex-col items-center justify-center shadow-lg">
          
          <img src="/bg-hubungi-kami.svg" alt="Pattern" className="absolute inset-0 w-full h-full object-cover opacity-10" />
          
          <div className="relative z-10 flex flex-col items-center gap-4 md:gap-5 px-6">
            <h2 className="text-white text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold font-['Plus_Jakarta_Sans'] text-center leading-snug">
              Siap Mewujudkan Visi Konstruksi Anda
            </h2>
            <p className="text-white text-sm md:text-[15px] font-normal font-['Plus_Jakarta_Sans'] text-center max-w-[693px] leading-relaxed">
              Apakah Anda memiliki proyek masa depan yang membutuhkan presisi dan kualitas? Hubungi kantor kami hari ini untuk solusi konstruksi yang inovatif dan terpercaya.
            </p>
            
            <Link 
              href="/hubungi-kami"
              className="w-full sm:w-72 h-12 md:h-14 mt-4 rounded-full flex items-center justify-center text-[#004282] text-[15px] md:text-[17px] font-bold font-['Plus_Jakarta_Sans'] bg-[linear-gradient(33deg,#d4d4d8_7%,#ffffff_29%,#d6d3d1_82%)] hover:scale-105 transition-transform shadow-md"
            >
              Hubungi Kami
            </Link>
          </div>
          
        </div>
      </FadeUp>
    </section>
  );
}
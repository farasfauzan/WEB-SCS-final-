"use client";
import Link from "next/link";

export default function BurgerMenu({ isOpen, onClose }) {
  return (
    <div className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}>
      {/* Background Gelap (Backdrop) */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Panel Menu di Kanan */}
      <div className={`absolute top-0 right-0 w-64 md:w-80 h-full bg-white shadow-2xl transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col p-8 pt-32 gap-6">
          
          <a href="https://www.youtube.com/@sinarcerahsempurna8137" target="_blank" rel="noopener noreferrer" onClick={onClose} className="text-[#004282] text-lg font-bold font-['Plus_Jakarta_Sans'] hover:text-sky-600 transition-colors">
            YouTube
          </a>
          
          <div className="w-full h-px bg-neutral-100"></div>
          
          <Link href="/portal-aplikasi" onClick={onClose} className="text-[#004282] text-lg font-bold font-['Plus_Jakarta_Sans'] hover:text-sky-600 transition-colors">
            Portal Aplikasi
          </Link>
          
          <div className="w-full h-px bg-neutral-100"></div>
          
          <Link href="/sop" onClick={onClose} className="text-[#004282] text-lg font-bold font-['Plus_Jakarta_Sans'] hover:text-sky-600 transition-colors">
            SOP
          </Link>
          
          <div className="w-full h-px bg-neutral-100"></div>
          
          <Link href="/anak-perusahaan" onClick={onClose} className="text-[#004282] text-lg font-bold font-['Plus_Jakarta_Sans'] hover:text-sky-600 transition-colors">
            Anak Perusahaan
          </Link>
          
        </div>
      </div>
    </div>
  );
}
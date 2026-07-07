"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFloating(window.scrollY > 50);
      setIsPastHero(window.scrollY > window.innerHeight - 120);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = isPastHero ? "text-[#004282]" : "text-white";
  const burgerLineColor = isPastHero ? "bg-[#004282]" : "bg-white";
  const btnClasses = isPastHero 
    ? "bg-[#004282] text-white hover:bg-blue-900 shadow-md" 
    : "bg-white text-[#004282] hover:bg-zinc-100 shadow-sm";

  let navBg = "bg-transparent border-transparent shadow-none";
  if (isFloating && !isPastHero) {
    navBg = "bg-white/15 backdrop-blur-xl shadow-lg border border-white/30";
  } else if (isPastHero) {
    navBg = "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/60";
  }

  // Data Menu Dropdown menggunakan SVG dari public folder
  const utilityMenu = [
    { name: "YouTube", href: "/youtube", icon: "/menu-youtube.svg" },
    { name: "Portal Aplikasi", href: "/portal-aplikasi", icon: "/menu-aplikasi-scs.svg" },
    { name: "SOP", href: "/sop", icon: "/menu-sop.svg" },
    { name: "Anak Perusahaan", href: "/anak-perusahaan", icon: "/menu-anak-perusahaan.svg" }
  ];

  return (
    <header className="fixed top-4 left-0 w-full z-50 flex justify-center pointer-events-none px-3 md:px-6">
      
      {/* Tinggi sudah diubah menjadi h-12 sesuai kustomisasimu */}
      <nav className={`pointer-events-auto flex items-center justify-between w-full h-12 px-6 md:px-8 rounded-full transition-all duration-500 ease-in-out ${navBg}`}>
        
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <img src="/logo-scs.svg" alt="Logo SCS" className="w-8 h-8 object-contain" />
          <span className={`font-extrabold font-['Plus_Jakarta_Sans'] tracking-wide text-lg md:text-xl transition-colors duration-500 ${textColor}`}>
            Sinar Cerah Sempurna
          </span>
        </Link>

        <div className="flex items-center justify-end gap-5 relative shrink-0">
          
          <div className={`hidden lg:flex items-center gap-7 font-bold font-['Plus_Jakarta_Sans'] text-[14px] transition-colors duration-500 ${textColor}`}>
            <Link href="/" className="hover:opacity-70 transition-opacity">Beranda</Link>
            <Link href="/tentang-kami" className="hover:opacity-70 transition-opacity">Tentang</Link>
            <Link href="/proyek" className="hover:opacity-70 transition-opacity">Proyek</Link>
            <Link href="/berita" className="hover:opacity-70 transition-opacity">Berita</Link>
          </div>

          <Link href="/hubungi-kami" className={`hidden sm:inline-block font-bold font-['Plus_Jakarta_Sans'] px-5 py-2 rounded-full transition-colors duration-500 text-[13px] ${btnClasses}`}>
            Hubungi Kami
          </Link>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative focus:outline-none z-[60] ml-1 w-6 h-4"
            aria-label="Toggle Menu"
          >
            <span className={`absolute left-0 w-full h-[2px] rounded transition-all duration-300 ease-in-out ${burgerLineColor} ${isMenuOpen ? 'top-1.5 rotate-45' : 'top-0'}`}></span>
            <span className={`absolute left-0 top-1.5 w-full h-[2px] rounded transition-all duration-300 ease-in-out ${burgerLineColor} ${isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`}></span>
            <span className={`absolute left-0 w-full h-[2px] rounded transition-all duration-300 ease-in-out ${burgerLineColor} ${isMenuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`}></span>
          </button>

          <div className={`absolute top-[calc(100%+12px)] right-0 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden transition-all duration-300 origin-top-right ${
            isMenuOpen ? "scale-100 opacity-100 pointer-events-auto translate-y-0" : "scale-95 opacity-0 pointer-events-none -translate-y-2"
          }`}>
            <div className="flex flex-col p-2 gap-1">
              {utilityMenu.map((item, idx) => (
                <Link 
                  key={idx} 
                  href={item.href} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="flex items-center gap-3 px-4 py-3 text-[#004282] text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-sky-50 rounded-xl transition-colors group"
                >
                  {/* Memanggil SVG Ikon dari folder public */}
                  <img src={item.icon} alt={item.name} className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity object-contain" />
                  <span className="group-hover:text-sky-700 transition-colors">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </nav>
    </header>
  );
}
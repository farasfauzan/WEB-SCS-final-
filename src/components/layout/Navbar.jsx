"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

export default function Navbar({ settings = {} }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  // Kunci scroll body HANYA saat di mobile
  useEffect(() => {
    if (isMenuOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const isKnownHeroPage =
      pathname === "/" ||
      pathname === "/hubungi-kami" ||
      pathname === "/tentang-kami" ||
      pathname === "/proyek" ||
      pathname === "/berita";

    const handleScroll = () => {
      setIsFloating(window.scrollY > 50);

      if (!isKnownHeroPage) {
        setIsPastHero(true);
        return;
      }

      const isFullScreenHero = pathname === "/" || pathname === "/hubungi-kami";
      const heroHeight = isFullScreenHero
        ? window.innerHeight
        : Math.max(window.innerHeight * 0.5, 400);

      setIsPastHero(window.scrollY > heroHeight - 80);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const textColor = isPastHero ? "text-[#004282]" : "text-white";
  const burgerLineColor = isPastHero ? "bg-[#004282]" : "bg-white";
  const btnClasses = isPastHero
    ? "bg-[#004282] text-white hover:bg-blue-900 shadow-md"
    : "bg-white text-[#004282] hover:bg-zinc-100 shadow-sm";

  let navBg = "bg-transparent border-transparent shadow-none";
  if (isFloating && !isPastHero) {
    navBg = "bg-white/15 backdrop-blur-xl shadow-lg border border-white/30";
  } else if (isPastHero) {
    navBg =
      "bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/60";
  }

  const mainLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "/tentang-kami" },
    { name: "Proyek", href: "/proyek" },
    { name: "Berita", href: "/berita" },
  ];

  const utilityMenu = [
    {
      name: "YouTube",
      href:
        settings.youtube_url ||
        "https://www.youtube.com/@sinarcerahsempurna8137",
      icon: "/menu-youtube.svg",
    },
    {
      name: "Portal Aplikasi",
      href: settings.portal_app_url || "/portal-aplikasi",
      icon: "/menu-aplikasi-scs.svg",
    },
    { name: "SOP", href: settings.sop_url || "/sop", icon: "/menu-sop.svg" },
    {
      name: "Anak Perusahaan",
      href: settings.anak_perusahaan_url || "/anak-perusahaan",
      icon: "/menu-anak-perusahaan.svg",
    },
  ];

  return (
    <>
      {/* 
        BACKDROP TRANSPARAN 
        Ditempatkan di luar <header> agar tidak terkena efek containing block dari backdrop-filter milik Navbar.
        lg:hidden memastikan efek gelap/blur ini HILANG di layar desktop.
      */}
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 45 }}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <header className="fixed top-4 left-0 w-full z-50 flex justify-center pointer-events-none px-3 md:px-6">
        <nav
          className={`pointer-events-auto flex items-center justify-between w-full h-12 px-5 md:px-8 rounded-full transition-all duration-500 ease-in-out ${navBg}`}
        >
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-3 group shrink-0"
          >
            <CldImg
              src="/logo-scs.svg"
              alt="Logo SCS"
              className="w-8 h-8 object-contain"
            />
            <span
              style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
              className={`hidden md:block font-bold tracking-wide text-xl transition-colors duration-500 ${textColor}`}
            >
              {settings.company_name
                ? `PT. ${settings.company_name}`
                : "PT. Sinar Cerah Sempurna"}
            </span>
          </Link>

          <div className="flex items-center justify-end gap-5 relative shrink-0">
            {/* TAMPILAN DESKTOP UTUH */}
            <div
              className={`hidden lg:flex items-center gap-7 font-bold font-['Plus_Jakarta_Sans'] text-[14px] transition-colors duration-500 ${textColor}`}
            >
              {mainLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative hover:opacity-75 transition-opacity"
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_5px_rgba(250,204,21,0.8)]"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/hubungi-kami"
              className={`hidden sm:inline-block font-bold font-['Plus_Jakarta_Sans'] px-5 py-2 rounded-full transition-colors duration-500 text-[13px] ${btnClasses}`}
            >
              Hubungi Kami
            </Link>

            {/* TOMBOL BURGER */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative focus:outline-none z-[60] ml-1 w-6 h-4 scale-90 md:scale-100 origin-right cursor-pointer"
              aria-label="Toggle Menu"
            >
              <span
                className={`absolute left-0 w-full h-[2px] rounded transition-all duration-300 ease-in-out ${burgerLineColor} ${isMenuOpen ? "top-1.5 rotate-45" : "top-0"}`}
              ></span>
              <span
                className={`absolute left-0 top-1.5 w-full h-[2px] rounded transition-all duration-300 ease-in-out ${burgerLineColor} ${isMenuOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}`}
              ></span>
              <span
                className={`absolute left-0 w-full h-[2px] rounded transition-all duration-300 ease-in-out ${burgerLineColor} ${isMenuOpen ? "top-1.5 -rotate-45" : "top-3"}`}
              ></span>
            </button>

            {/* MENU DROPDOWN (Mobile & Desktop) */}
            <div
              className={`absolute top-[calc(100%+16px)] right-0 w-[220px] sm:w-[240px] max-h-[85vh] overflow-y-auto bg-[#F1F1F1] rounded-[20px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] border border-white/80 flex flex-col transition-all duration-300 origin-top-right scrollbar-hide ${
                isMenuOpen
                  ? "scale-100 opacity-100 pointer-events-auto translate-y-0"
                  : "scale-95 opacity-0 pointer-events-none -translate-y-3"
              }`}
              style={{ zIndex: 60 }}
            >
              <div className="flex flex-col p-2.5 gap-3">
                {/* Grup 1: Halaman Utama (Hanya Mobile) */}
                <div className="block lg:hidden">
                  <h3 className="px-3 mb-1.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                    Halaman Utama
                  </h3>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                    {mainLinks.map((link, idx) => {
                      const isActive =
                        link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 text-[13px] font-bold font-['Plus_Jakarta_Sans'] transition-colors ${
                            idx !== mainLinks.length - 1
                              ? "border-b border-neutral-100"
                              : ""
                          } ${
                            isActive
                              ? "text-[#004282] bg-blue-50/40"
                              : "text-neutral-700 hover:bg-neutral-50"
                          }`}
                        >
                          {link.name}
                          <svg
                            className={`w-3.5 h-3.5 ${isActive ? "text-[#004282]" : "text-neutral-300"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                        </Link>
                      );
                    })}

                    {/* Hubungi Kami Khusus Mobile */}
                    <Link
                      href="/hubungi-kami"
                      onClick={() => setIsMenuOpen(false)}
                      className={`sm:hidden flex items-center justify-between px-4 py-3 text-[13px] font-bold font-['Plus_Jakarta_Sans'] transition-colors border-t border-neutral-100 ${
                        pathname === "/hubungi-kami"
                          ? "text-[#004282] bg-blue-50/40"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      Hubungi Kami
                      <svg
                        className={`w-3.5 h-3.5 ${pathname === "/hubungi-kami" ? "text-[#004282]" : "text-neutral-300"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Grup 2: Layanan & Tautan (Mobile & Desktop) */}
                <div>
                  <h3 className="px-3 mb-1.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider font-['Plus_Jakarta_Sans']">
                    Layanan & Bantuan
                  </h3>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100">
                    {utilityMenu.map((item, idx) => {
                      const isExternal = item.href.startsWith("http");
                      const LinkComponent = isExternal ? "a" : Link;
                      return (
                        <LinkComponent
                          key={idx}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                            idx !== utilityMenu.length - 1
                              ? "border-b border-neutral-100"
                              : ""
                          } hover:bg-neutral-50`}
                        >
                          <img
                            src={item.icon}
                            alt={item.name}
                            className="w-[18px] h-[18px] opacity-65 object-contain shrink-0"
                          />
                          <span className="text-[13px] font-bold text-neutral-700 font-['Plus_Jakarta_Sans'] flex-1">
                            {item.name}
                          </span>
                          <svg
                            className="w-3.5 h-3.5 text-neutral-300 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                        </LinkComponent>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

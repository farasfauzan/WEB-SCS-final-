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

  useEffect(() => {
    // KOREKSI: Hapus startsWith("/proyek/") dan startsWith("/berita/")
    // Agar halaman detail langsung memicu isPastHero = true
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
    <header className="fixed top-4 left-0 w-full z-50 flex justify-center pointer-events-none px-3 md:px-6">
      <nav
        className={`pointer-events-auto flex items-center justify-between w-full h-12 px-6 md:px-8 rounded-full transition-all duration-500 ease-in-out ${navBg}`}
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
            className={`font-bold tracking-wide text-lg md:text-xl transition-colors duration-500 ${textColor}`}
          >
            {settings.company_name
              ? `PT. ${settings.company_name}`
              : "PT. Sinar Cerah Sempurna"}
          </span>
        </Link>

        <div className="flex items-center justify-end gap-5 relative shrink-0">
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

          {/* KOREKSI: Tambahan cursor-pointer agar menjadi ikon telunjuk */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative focus:outline-none z-[60] ml-1 w-6 h-4 cursor-pointer"
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

          <div
            className={`absolute top-[calc(100%+12px)] right-0 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-white/50 overflow-hidden transition-all duration-300 origin-top-right ${
              isMenuOpen
                ? "scale-100 opacity-100 pointer-events-auto translate-y-0"
                : "scale-95 opacity-0 pointer-events-none -translate-y-2"
            }`}
          >
            <div className="flex flex-col p-2 gap-1">
              <div className="flex flex-col lg:hidden border-b border-neutral-100 mb-1 pb-1">
                {mainLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[#004282] text-sm font-bold font-['Plus_Jakarta_Sans'] hover:bg-sky-50 rounded-xl transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/hubungi-kami"
                  onClick={() => setIsMenuOpen(false)}
                  className="sm:hidden flex items-center gap-3 px-4 py-3 text-yellow-600 text-sm font-bold font-['Plus_Jakarta_Sans'] hover:bg-yellow-50 rounded-xl transition-colors"
                >
                  Hubungi Kami
                </Link>
              </div>

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
                    className="flex items-center gap-3 px-4 py-3 text-[#004282] text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:bg-sky-50 rounded-xl transition-colors group"
                  >
                    <CldImg
                      src={item.icon}
                      alt={item.name}
                      className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity object-contain"
                    />
                    <span className="group-hover:text-sky-700 transition-colors">
                      {item.name}
                    </span>
                  </LinkComponent>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

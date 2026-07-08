"use client";
import Link from "next/link";

export default function BurgerMenu({ isOpen, onClose, settings = {} }) {
  const youtubeUrl = settings.youtube_url || "https://www.youtube.com/@sinarcerahsempurna8137";
  const portalAppUrl = settings.portal_app_url || "/portal-aplikasi";
  const sopUrl = settings.sop_url || "/sop";
  const anakPerusahaanUrl = settings.anak_perusahaan_url || "/anak-perusahaan";

  const isPortalExternal = portalAppUrl.startsWith("http");
  const PortalLinkComponent = isPortalExternal ? "a" : Link;

  const isSopExternal = sopUrl.startsWith("http");
  const SopLinkComponent = isSopExternal ? "a" : Link;

  const isAnakExternal = anakPerusahaanUrl.startsWith("http");
  const AnakLinkComponent = isAnakExternal ? "a" : Link;

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
          
          <a 
            href={youtubeUrl} 
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose} 
            className="text-[#004282] text-lg font-bold font-['Plus_Jakarta_Sans'] hover:text-sky-600 transition-colors"
          >
            YouTube
          </a>
          
          <div className="w-full h-px bg-neutral-100"></div>
          
          <PortalLinkComponent 
            href={portalAppUrl} 
            target={isPortalExternal ? "_blank" : undefined}
            rel={isPortalExternal ? "noopener noreferrer" : undefined}
            onClick={onClose} 
            className="text-[#004282] text-lg font-bold font-['Plus_Jakarta_Sans'] hover:text-sky-600 transition-colors"
          >
            Portal Aplikasi
          </PortalLinkComponent>
          
          <div className="w-full h-px bg-neutral-100"></div>
          
          <SopLinkComponent 
            href={sopUrl} 
            target={isSopExternal ? "_blank" : undefined}
            rel={isSopExternal ? "noopener noreferrer" : undefined}
            onClick={onClose} 
            className="text-[#004282] text-lg font-bold font-['Plus_Jakarta_Sans'] hover:text-sky-600 transition-colors"
          >
            SOP
          </SopLinkComponent>
          
          <div className="w-full h-px bg-neutral-100"></div>
          
          <AnakLinkComponent 
            href={anakPerusahaanUrl} 
            target={isAnakExternal ? "_blank" : undefined}
            rel={isAnakExternal ? "noopener noreferrer" : undefined}
            onClick={onClose} 
            className="text-[#004282] text-lg font-bold font-['Plus_Jakarta_Sans'] hover:text-sky-600 transition-colors"
          >
            Anak Perusahaan
          </AnakLinkComponent>
          
        </div>
      </div>
    </div>
  );
}
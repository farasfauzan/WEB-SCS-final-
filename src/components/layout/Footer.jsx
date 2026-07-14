import Link from "next/link";
import CldImg from "@/components/shared/CldImg";

export default function Footer({ settings = {} }) {
  const youtubeUrl = settings.youtube_url || "https://www.youtube.com/@sinarcerahsempurna8137";
  const portalAppUrl = settings.portal_app_url || "/portal-aplikasi";
  const sopUrl = settings.sop_url || "/sop";
  const anakPerusahaanUrl = settings.anak_perusahaan_url || "/anak-perusahaan";
  const footerDescription = settings.footer_description || "Perusahaan konstruksi dan infrastruktur terpercaya di Indonesia dengan komitmen tinggi pada kualitas dan inovasi.";
  const footerAddress = settings.footer_address || "Jl. Karangrejo Barat No 09. RT. 02 RW. 02 (Kp. Pentul), Tinjomoyo, Semarang";
  const copyright = settings.footer_copyright || "© 2026 PT. Sinar Cerah Sempurna. All rights reserved.";
  const companyName = settings.company_name || "Sinar Cerah Sempurna";

  const isPortalExternal = portalAppUrl.startsWith("http");
  const PortalLinkComponent = isPortalExternal ? "a" : Link;

  const isSopExternal = sopUrl.startsWith("http");
  const SopLinkComponent = isSopExternal ? "a" : Link;

  const isAnakExternal = anakPerusahaanUrl.startsWith("http");
  const AnakLinkComponent = isAnakExternal ? "a" : Link;

  return (
    // Padding atas dan bawah dikurangi (pt-8, pb-4) agar footer lebih pendek
    <footer className="w-full bg-[#004282] pt-8 pb-4 border-t border-white/10">
      <div className="page-container-wide flex flex-col md:flex-row justify-between gap-10 md:gap-6 mb-4">
        
        <div className="flex flex-col gap-3 max-w-xs">
          <div className="flex items-center gap-3">
            <CldImg src="/logo-scs.svg" alt="Logo SCS" className="w-8 h-8 object-contain" />
            <span 
              style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
              className="text-white text-lg font-bold"
            >
              PT. {companyName}
            </span>
          </div>
          <p className="text-white/80 text-[13px] font-['Plus_Jakarta_Sans'] leading-relaxed">
            {footerDescription}
          </p>
          
          {/* Ikon Menu + YouTube Footer (Berfungsi sebagai tombol link) */}
          <div className="flex gap-4 mt-3">
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity hover:-translate-y-1 transform duration-300">
              <CldImg src="/youtube-footer.svg" alt="YouTube" className="w-6 h-6 object-contain" />
            </a>
            <PortalLinkComponent 
              href={portalAppUrl} 
              target={isPortalExternal ? "_blank" : undefined}
              rel={isPortalExternal ? "noopener noreferrer" : undefined}
              className="hover:opacity-75 transition-opacity hover:-translate-y-1 transform duration-300"
            >
              <CldImg src="/menu-aplikasi-scs.svg" alt="Portal Aplikasi" className="w-6 h-6 object-contain" />
            </PortalLinkComponent>
            <SopLinkComponent 
              href={sopUrl} 
              target={isSopExternal ? "_blank" : undefined}
              rel={isSopExternal ? "noopener noreferrer" : undefined}
              className="hover:opacity-75 transition-opacity hover:-translate-y-1 transform duration-300"
            >
              <CldImg src="/menu-sop.svg" alt="SOP" className="w-6 h-6 object-contain" />
            </SopLinkComponent>
            <AnakLinkComponent 
              href={anakPerusahaanUrl} 
              target={isAnakExternal ? "_blank" : undefined}
              rel={isAnakExternal ? "noopener noreferrer" : undefined}
              className="hover:opacity-75 transition-opacity hover:-translate-y-1 transform duration-300"
            >
              <CldImg src="/menu-anak-perusahaan.svg" alt="Anak Perusahaan" className="w-6 h-6 object-contain" />
            </AnakLinkComponent>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white text-base font-bold font-['Plus_Jakarta_Sans']">Tautan Cepat</h4>
          <div className="flex flex-col gap-2 text-white/80 text-[13px] font-['Plus_Jakarta_Sans']">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <Link href="/tentang-kami" className="hover:text-white transition-colors">Tentang Kami</Link>
            <Link href="/proyek" className="hover:text-white transition-colors">Proyek</Link>
            <Link href="/berita" className="hover:text-white transition-colors">Berita</Link>
            <Link href="/hubungi-kami" className="hover:text-white transition-colors">Kontak</Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 max-w-xs">
          <h4 className="text-white text-base font-bold font-['Plus_Jakarta_Sans']">Lokasi</h4>
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(footerAddress)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/80 hover:text-white text-[13px] font-['Plus_Jakarta_Sans'] leading-relaxed transition-colors hover:underline"
          >
            {footerAddress} 🗺️
          </a>
          <div className="mt-auto pt-4">
            <p className="text-white/60 text-[11px] font-['Plus_Jakarta_Sans']">
              {copyright}
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
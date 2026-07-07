import Link from "next/link";

export default function Footer() {
  return (
    // Padding atas dan bawah dikurangi (pt-8, pb-4) agar footer lebih pendek
    <footer className="w-full bg-[#004282] pt-8 pb-4 px-6 md:px-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-6 mb-4">
        
        <div className="flex flex-col gap-3 max-w-xs">
          <div className="flex items-center gap-3">
            <img src="/logo-scs.svg" alt="Logo SCS" className="w-8 h-8 object-contain" />
            <span className="text-white text-lg font-bold font-['Plus_Jakarta_Sans']">Sinar Cerah Sempurna</span>
          </div>
          <p className="text-white/80 text-[13px] font-['Plus_Jakarta_Sans'] leading-relaxed">
            Perusahaan konstruksi dan infrastruktur terpercaya di Indonesia dengan komitmen tinggi pada kualitas dan inovasi.
          </p>
          
          {/* Ikon Menu + YouTube Footer (Berfungsi sebagai tombol link) */}
          <div className="flex gap-4 mt-3">
            <Link href="/youtube" className="hover:opacity-75 transition-opacity hover:-translate-y-1 transform duration-300">
              <img src="/youtube-footer.svg" alt="YouTube" className="w-6 h-6 object-contain" />
            </Link>
            <Link href="/portal-aplikasi" className="hover:opacity-75 transition-opacity hover:-translate-y-1 transform duration-300">
              <img src="/menu-aplikasi-scs.svg" alt="Portal Aplikasi" className="w-6 h-6 object-contain" />
            </Link>
            <Link href="/sop" className="hover:opacity-75 transition-opacity hover:-translate-y-1 transform duration-300">
              <img src="/menu-sop.svg" alt="SOP" className="w-6 h-6 object-contain" />
            </Link>
            <Link href="/anak-perusahaan" className="hover:opacity-75 transition-opacity hover:-translate-y-1 transform duration-300">
              <img src="/menu-anak-perusahaan.svg" alt="Anak Perusahaan" className="w-6 h-6 object-contain" />
            </Link>
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
          <p className="text-white/80 text-[13px] font-['Plus_Jakarta_Sans'] leading-relaxed">
            Jl. Karangrejo Barat No 09. RT. 02 RW. 02 (Kp. Pentul), Tinjomoyo, Semarang
          </p>
          <div className="mt-auto pt-4">
            <p className="text-white/60 text-[11px] font-['Plus_Jakarta_Sans']">
              © 2026 PT. Sinar Cerah Sempurna. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatbotButton from "@/components/shared/ChatbotButton";
import { getAllSettings } from "@/lib/data";

export default async function NotFound() {
  const settings = await getAllSettings();

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-zinc-50 font-['Plus_Jakarta_Sans']">
      <Navbar settings={settings} />

      <main className="flex-grow flex items-center justify-center pt-32 pb-16 px-6">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6 bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-zinc-200">
          
          {/* Cute Anime Image */}
          <div className="w-56 h-56 relative flex items-center justify-center bg-sky-50 rounded-2xl overflow-hidden p-4">
            <img 
              src="/cute-construction.png" 
              alt="Halaman dalam tahap konstruksi" 
              className="w-full h-full object-contain animate-pulse"
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004282]">
              UNDER CONSTRUCTION
            </span>
            <h1 className="text-zinc-900 text-2xl md:text-3xl font-extrabold leading-tight">
              Halaman Belum Tersedia
            </h1>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
              Ups! Halaman yang Anda cari sedang dalam pembangunan oleh tim developer kami atau belum tersedia saat ini.
            </p>
          </div>

          {/* Button to go home */}
          <Link 
            href="/"
            className="w-full py-3.5 rounded-full flex items-center justify-center text-white text-[15px] font-bold bg-[#004282] hover:bg-blue-900 transition-all shadow-md active:scale-[0.98]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>

      <Footer settings={settings} />
      <ChatbotButton settings={settings} />
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import FadeUp from "@/components/ui/FadeUp";

export default function HubungiKamiPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        if (data.contacts) setContacts(data.contacts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getContact = (type) => contacts.find((c) => c.type === type);
  const address = getContact("address");
  const phone = getContact("phone");
  const email = getContact("email");

  if (loading) {
    return (
      <main className="relative w-full min-h-screen flex items-center justify-center bg-[#004282]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </main>
    );
  }

  return (
    // Background biasa, bukan fixed. Padding atas ditambah (pt-28) agar tidak nabrak navbar.
    <main className="relative w-full min-h-screen flex flex-col items-center justify-center bg-[#004282] pt-28 pb-16 px-6">
      
      {/* Gambar Background tanpa kelas fixed */}
      <div className="absolute inset-0 z-0">
        <img src="/hero-bg.svg" alt="Background Hubungi Kami" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#004282]/85"></div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="relative z-10 w-full max-w-[950px] flex flex-col items-center gap-8">
        
        {/* Animasi untuk Judul dan Sub-judul */}
        <FadeUp delay={0.1} className="text-center flex flex-col gap-2">
          <h1 className="text-white text-4xl font-extrabold font-['Plus_Jakarta_Sans']">
            Hubungi Kami
          </h1>
          <p className="text-white/90 text-sm md:text-[15px] font-normal font-['Plus_Jakarta_Sans']">
            Mari diskusikan proyek masa depan Anda bersama tim ahli kami.
          </p>
        </FadeUp>

        {/* Kontainer Form */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Form Pesan (Muncul kedua) */}
          <FadeUp delay={0.2} className="w-full h-full">
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-xl h-full">
              <h2 className="text-white text-xl font-bold font-['Plus_Jakarta_Sans'] mb-5">Kirimkan Pesan</h2>
              <form className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-[13px] font-['Plus_Jakarta_Sans']">Nama Lengkap <span className="text-yellow-400">*</span></label>
                    <input type="text" className="bg-transparent border border-white/30 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-white transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-[13px] font-['Plus_Jakarta_Sans']">Alamat Email <span className="text-yellow-400">*</span></label>
                    <input type="email" className="bg-transparent border border-white/30 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-white transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-[13px] font-['Plus_Jakarta_Sans']">Nomor Telepon</label>
                    <input type="tel" className="bg-transparent border border-white/30 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-white transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white text-[13px] font-['Plus_Jakarta_Sans']">Subjek</label>
                    <input type="text" className="bg-transparent border border-white/30 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-white transition-colors" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white text-[13px] font-['Plus_Jakarta_Sans']">Pesan</label>
                  <textarea rows="3" className="bg-transparent border border-white/30 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-white transition-colors resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#FFD700] hover:bg-[#F6CA00] text-[#004282] text-sm font-bold font-['Plus_Jakarta_Sans'] py-3 rounded-lg transition-colors mt-2">
                  Kirim Pesan
                </button>
              </form>
            </div>
          </FadeUp>

          {/* Informasi Kontak (Muncul ketiga) */}
          <FadeUp delay={0.3} className="w-full h-full">
            <div className="bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-center gap-6 shadow-xl h-full">
              <h2 className="text-white text-xl font-bold font-['Plus_Jakarta_Sans']">Informasi Kontak</h2>
              
              <div className="flex flex-col gap-1">
                <h3 className="text-white text-[14px] font-bold font-['Plus_Jakarta_Sans']">Alamat</h3>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(address?.value || "Jl. Karangrejo Barat No 09. RT. 02 RW. 02 (Kp. Pentul), Tinjomoyo, Semarang")}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/80 hover:text-white text-[14px] font-['Plus_Jakarta_Sans'] leading-relaxed transition-colors underline"
                >
                  {address?.value || "Jl Karangrejo Barat No 9. Tinjomoyo, KOTA SEMARANG"} 🗺️
                </a>
              </div>
              
              <div className="flex flex-col gap-1">
                <h3 className="text-white text-[14px] font-bold font-['Plus_Jakarta_Sans']">Telepon</h3>
                <a href={`tel:${phone?.value?.replace(/\s/g, "") || "0248502010"}`} className="text-white/80 text-[14px] font-['Plus_Jakarta_Sans'] underline hover:text-white transition-colors">{phone?.value || "024 8502010"}</a>
              </div>
              
              <div className="flex flex-col gap-1">
                <h3 className="text-white text-[14px] font-bold font-['Plus_Jakarta_Sans']">Email</h3>
                <a href={`mailto:${email?.value || "info@ptsinarcerahsempurna.com"}`} className="text-white/80 text-[14px] font-['Plus_Jakarta_Sans'] underline hover:text-white transition-colors">{email?.value || "info@ptsinarcerahsempurna.com"}</a>
              </div>
              
              <div className="flex flex-col gap-1">
                <h3 className="text-white text-[14px] font-bold font-['Plus_Jakarta_Sans']">Jam Operasional</h3>
                <p className="text-white/80 text-[14px] font-['Plus_Jakarta_Sans'] whitespace-pre-line">{getContact("general")?.value || "Senin - Jumat: 08.00 - 17.00 WIB\nSabtu: 08.00 - 12.00 WIB"}</p>
              </div>
            </div>
          </FadeUp>

        </div>
      </div>
    </main>
  );
}
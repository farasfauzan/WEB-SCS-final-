import FadeUp from "@/components/ui/FadeUp";

export const metadata = {
  title: "Tentang Kami | PT Sinar Cerah Sempurna",
};

export default function TentangKamiPage() {
  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pb-24">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center rounded-b-[64px] overflow-hidden bg-[#004282]">
        <div className="absolute inset-0 z-0">
          <img src="/bg-hubungi-kami.svg" alt="Background Tentang Kami" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[#004282]/85"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center gap-[clamp(0.75rem,2vh,1.25rem)] mt-10">
          <FadeUp delay={0.1}>
            <h1 className="text-white text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold font-['Plus_Jakarta_Sans'] leading-tight">
              Membangun dengan Kepercayaan,<br />Berkarya dengan Kualitas.
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-white/90 text-[clamp(0.9rem,1.5vw,1.1rem)] font-normal font-['Plus_Jakarta_Sans'] leading-relaxed max-w-[850px]">
              Berpegang teguh pada motto &quot;Memberi Kepuasan Kepada Relasi&quot;, kami terus membangun kepercayaan dalam industri konstruksi melalui dedikasi tinggi. Komitmen ini kami wujudkan dengan konsisten meningkatkan kompetensi Sumber Daya Manusia agar selalu terampil dan profesional.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* KONTEN TENTANG KAMI - Gap diperkecil (gap-12 md:gap-16) agar padat tapi tetap rapi */}
      <section className="flex flex-col items-center justify-start pt-16 md:pt-20 px-6 gap-12 md:gap-16">
         
         <FadeUp delay={0.1} className="max-w-[800px] w-full text-center flex flex-col gap-4">
            <h2 className="text-[#1E1E1E] text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
              Tentang PT Sinar Cerah Sempurna
            </h2>
            <p className="text-[#757575] text-[15px] font-normal font-['Plus_Jakarta_Sans'] leading-relaxed">
              PT Sinar Cerah Sempurna adalah perusahaan konstruksi dan infrastruktur yang berpengalaman dalam pembangunan gedung, jalan, jembatan, dan berbagai proyek infrastruktur lainnya di Indonesia.
            </p>
         </FadeUp>

         {/* Animasi dipercepat (delay 0.2) */}
         <FadeUp delay={0.2} className="max-w-[1000px] w-full bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-neutral-200">
            <div className="flex flex-col gap-10">
              <div className="text-center flex flex-col gap-3">
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-[#1E1E1E]">Visi</h3>
                <p className="text-[15px] text-[#424242] font-['Plus_Jakarta_Sans'] leading-relaxed max-w-[800px] mx-auto">
                  Menjadi perusahaan konstruksi dan infrastruktur terdepan serta terpercaya di Indonesia, yang diakui karena keunggulan dalam kualitas, keselamatan, dan pembangunan berkelanjutan.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-[#1E1E1E] text-center mb-2">Misi</h3>
                <ul className="list-disc pl-5 md:pl-10 space-y-3 text-[15px] text-[#424242] font-['Plus_Jakarta_Sans'] leading-relaxed marker:text-neutral-400">
                  <li>Memberikan layanan konstruksi berkualitas tinggi yang melampaui ekspektasi klien dan memenuhi standar internasional.</li>
                  <li>Menerapkan praktik terbaik dalam pengelolaan kesehatan, keselamatan kerja, dan lingkungan pada setiap proyek.</li>
                  <li>Mendorong inovasi melalui adopsi teknologi dan metodologi konstruksi mutakhir.</li>
                  <li>Membangun hubungan jangka panjang dengan klien, mitra, dan pemangku kepentingan berdasarkan kepercayaan dan transparansi.</li>
                  <li>Mengembangkan kapabilitas profesional tim kami melalui pelatihan berkelanjutan dan pengembangan karir.</li>
                  <li>Berkontribusi pada pembangunan berkelanjutan infrastruktur dan lingkungan binaan Indonesia.</li>
                </ul>
              </div>
            </div>
         </FadeUp>

         <div className="max-w-[1152px] w-full flex flex-col items-center gap-10">
            <FadeUp delay={0.1} className="text-center flex flex-col gap-3">
              <h2 className="text-[#1E1E1E] text-3xl font-extrabold font-['Plus_Jakarta_Sans']">Fondasi Utama Keunggulan Kami</h2>
              <p className="text-[#757575] text-[15px] font-normal font-['Plus_Jakarta_Sans'] max-w-2xl mx-auto leading-relaxed">
                Nilai-nilai ini adalah inti dari setiap keputusan, desain, dan struktur yang kami bangun. Ini adalah prinsip yang memandu langkah kami untuk selalu memberikan yang terbaik.
              </p>
            </FadeUp>

            <FadeUp delay={0.2} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[900px]">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center shrink-0">
                  <span className="text-xl">🛡️</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-[#1E1E1E] font-['Plus_Jakarta_Sans']">Integritas</h4>
                  <p className="text-sm text-[#757575] font-['Plus_Jakarta_Sans'] leading-relaxed">Kami menjalankan bisnis dengan kejujuran, transparansi, dan tanggung jawab penuh dalam setiap aspek operasional kami.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center shrink-0">
                  <span className="text-xl">💎</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-[#1E1E1E] font-['Plus_Jakarta_Sans']">Kualitas</h4>
                  <p className="text-sm text-[#757575] font-['Plus_Jakarta_Sans'] leading-relaxed">Kami berkomitmen pada standar kualitas tertinggi dalam setiap proyek, memastikan hasil yang melampaui ekspektasi klien.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-[#1E1E1E] font-['Plus_Jakarta_Sans']">Inovasi</h4>
                  <p className="text-sm text-[#757575] font-['Plus_Jakarta_Sans'] leading-relaxed">Kami terus mengeksplorasi teknologi dan metode konstruksi terbaru untuk memberikan solusi yang lebih efisien dan berkelanjutan.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center justify-center shrink-0">
                  <span className="text-xl">🤝</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-bold text-[#1E1E1E] font-['Plus_Jakarta_Sans']">Kerja Sama Tim</h4>
                  <p className="text-sm text-[#757575] font-['Plus_Jakarta_Sans'] leading-relaxed">Kami percaya bahwa kolaborasi yang kuat antar tim adalah kunci keberhasilan setiap proyek yang kami kerjakan.</p>
                </div>
              </div>
            </FadeUp>
         </div>

      </section>
    </main>
  );
}
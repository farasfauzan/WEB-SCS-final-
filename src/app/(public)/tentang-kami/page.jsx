import HeroTitle from "@/components/shared/HeroTitle";
import BoldText from "@/components/shared/BoldText";
import FadeUp from "@/components/ui/FadeUp";
import CldImg from "@/components/shared/CldImg";
import { prisma } from "@/lib/prisma";
import { getAllSettings } from "@/lib/data";

export const revalidate = 3600;

export default async function TentangKamiPage() {
  const [heroes, abouts, settings] = await Promise.all([
    prisma.hero.findMany({ where: { page: "about", isActive: true } }),
    prisma.about.findMany(),
    getAllSettings(),
  ]);

  const heroData = heroes[0] || null;
  const aboutData = abouts[0] || null;

  const heroTitle =
    heroData?.title ||
    "Membangun dengan **Kepercayaan**, Berkarya dengan **Kualitas**.";
  const heroDesc =
    heroData?.subtitle ||
    heroData?.description ||
    'Berpegang teguh pada motto "Memberi Kepuasan Kepada Relasi", kami terus membangun kepercayaan dalam industri konstruksi melalui dedikasi tinggi.';

  const aboutTitle = aboutData?.title || "Tentang PT Sinar Cerah Sempurna";
  const aboutContent =
    aboutData?.content ||
    "PT Sinar Cerah Sempurna adalah perusahaan konstruksi dan infrastruktur yang berpengalaman dalam pembangunan gedung, jalan, jembatan, dan berbagai proyek infrastruktur lainnya di Indonesia.";
  const aboutVision =
    aboutData?.vision ||
    "Menjadi perusahaan konstruksi dan infrastruktur terdepan serta terpercaya di Indonesia, yang diakui karena keunggulan dalam kualitas, keselamatan, dan pembangunan berkelanjutan.";

  const aboutMission = aboutData?.mission
    ? aboutData.mission.split("\n").filter((m) => m.trim() !== "")
    : [
        "Memberikan layanan konstruksi berkualitas tinggi yang melampaui ekspektasi klien dan memenuhi standar internasional.",
        "Menerapkan praktik terbaik dalam pengelolaan kesehatan, keselamatan kerja, dan lingkungan pada setiap proyek.",
        "Mendorong inovasi melalui adopsi teknologi dan metodologi konstruksi mutakhir.",
        "Membangun hubungan jangka panjang dengan klien, mitra, dan pemangku kepentingan berdasarkan kepercayaan dan transparansi.",
        "Mengembangkan kapabilitas profesional tim kami melalui pelatihan berkelanjutan dan pengembangan karir.",
        "Berkontribusi pada pembangunan berkelanjutan infrastruktur dan lingkungan binaan Indonesia.",
      ];

  const dirQuoteTitle =
    settings?.dirQuoteTitle || "Kami adalah perusahaan gg gaming";
  const dirQuoteDesc =
    settings?.dirQuoteDesc ||
    "Kami adalah perusahaan gg gaming Kami adalah perusahaan gg gaming Kami adalah perusahaan gg gaming Kami adalah perusahaan gg gaming Kami adalah perusahaan gg gaming Kami adalah perusahaan gg gaming Kami adalah perusahaan gg gaming Kami adalah perusahaan gg gaming Kami adalah perusahaan gg gaming Kami adalah perusahaan gg gaming Kami adalah perusahaan gg gaming";
  const dirName = settings?.dirName || "Ir. H. Soeharto, MT.";
  const dirRole = settings?.dirRole || "Direktur";

  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pb-24">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[50vh] min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center rounded-b-[32px] md:rounded-b-[64px] overflow-hidden bg-[#004282]">
        <div className="absolute inset-0 z-0">
          <CldImg
            src={heroData?.imageUrl || "/bg-hero-tentang-kami.svg"}
            alt="Background Tentang Kami"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[#004282]/85"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center gap-[clamp(0.75rem,2vh,1.25rem)] mt-10">
          <HeroTitle
            text={heroTitle}
            className="text-white text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-tight whitespace-pre-line"
          />
          <BoldText
            text={heroDesc}
            className="text-white/90 text-[clamp(0.9rem,1.5vw,1.1rem)] font-normal leading-relaxed max-w-[850px] mx-auto"
            as="p"
          />
        </div>
      </section>

      {/* --- VISI & MISI SECTION --- */}
      <section className="flex flex-col items-center justify-start pt-12 md:pt-20 px-4 sm:px-6 gap-10 md:gap-16">
        <FadeUp
          delay={0.1}
          className="max-w-[800px] w-full text-center flex flex-col gap-4"
        >
          <h2 className="text-[#1E1E1E] text-2xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
            {aboutTitle}
          </h2>
          <p className="text-[#757575] text-[14px] md:text-[15px] font-normal leading-relaxed whitespace-pre-line">
            {aboutContent}
          </p>
        </FadeUp>

        <FadeUp
          delay={0.2}
          className="max-w-[1000px] w-full bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-12 shadow-sm border border-neutral-200"
        >
          <div className="flex flex-col gap-8 md:gap-10">
            <article className="text-center flex flex-col gap-3">
              <h3 className="text-xl md:text-2xl font-bold text-[#1E1E1E]">Visi</h3>
              <p className="text-[14px] md:text-[15px] text-[#424242] leading-relaxed max-w-[800px] mx-auto whitespace-pre-line">
                {aboutVision}
              </p>
            </article>
            <article className="flex flex-col gap-3">
              <h3 className="text-xl md:text-2xl font-bold text-[#1E1E1E] text-center mb-2">
                Misi
              </h3>
              <ul className="list-disc pl-5 md:pl-10 space-y-2.5 md:space-y-3 text-[14px] md:text-[15px] text-[#424242] leading-relaxed marker:text-neutral-400">
                {aboutMission.map((item, idx) => (
                  <li key={idx}>{item.replace(/^-\s*/, "")}</li>
                ))}
              </ul>
            </article>
          </div>
        </FadeUp>
      </section>

      {/* --- DIREKTUR SECTION (FLOATING CARD) --- */}
      <section className="relative w-[calc(100%-1.5rem)] md:w-[calc(100%-4rem)] max-w-[1440px] mx-auto overflow-hidden bg-[#004282] mt-12 md:mt-16 rounded-[24px] md:rounded-[48px] shadow-2xl border border-white/10">
        <div className="absolute inset-0 z-0">
          <CldImg
            src={heroData?.imageUrl || "/bg-hero-tentang-kami.svg"}
            alt="Background Direktur"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[#004282]/85"></div>
          {/* Gradient Gelap di dasar card untuk efek lantai */}
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/85 to-transparent pointer-events-none"></div>
        </div>

        <FadeUp
          delay={0.3}
          className="relative z-10 w-full max-w-[1152px] mx-auto flex flex-col md:flex-row items-stretch justify-between px-4 sm:px-6 lg:px-8 gap-6 md:gap-16"
        >
          {/* Kolom Kiri: Foto Direktur & Bayangan (self-end agar rapat ke bawah) */}
          <div className="w-full md:w-5/12 flex flex-col justify-end items-center md:items-start self-end">
            <div className="relative flex flex-col items-center w-full">
              <img
                src="/sir-direkture.svg"
                alt={dirName}
                className="relative z-10 w-full max-w-[260px] md:max-w-[440px] object-contain drop-shadow-2xl"
              />
              {/* Efek bayangan (drop shadow) tepat di bawah kursi/kaki */}
              <div className="absolute bottom-0 w-[75%] h-[16px] md:h-[24px] bg-black/90 blur-[10px] md:blur-[12px] rounded-[100%] translate-y-1/2 z-0"></div>
            </div>
          </div>

          {/* Kolom Kanan: Teks & Quote (justify-between memisah konten atas dan bawah) */}
          <div className="w-full md:w-7/12 flex flex-col justify-between gap-8 md:gap-12 text-white pt-4 md:pt-24 pb-12 md:pb-24">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFD700] flex items-center justify-center shadow-lg shrink-0 rounded-lg">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-[#004282]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <div className="flex flex-col gap-3 md:gap-4">
                <h3 className="text-2xl md:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight drop-shadow-md">
                  {dirQuoteTitle}
                </h3>
                <p className="text-white/90 text-[14px] md:text-[15px] font-normal leading-relaxed text-left drop-shadow-md">
                  {dirQuoteDesc}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1 drop-shadow-lg">
              <span className="text-lg md:text-xl font-bold font-['Plus_Jakarta_Sans'] tracking-wide">
                {dirName}
              </span>
              <span className="text-[#FFD700] text-[14px] md:text-[15px] font-semibold tracking-wider">
                {dirRole}
              </span>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* --- FONDASI SECTION --- */}
      <section className="flex flex-col items-center justify-start py-12 md:py-20 px-4 sm:px-6 gap-10 md:gap-16">
        <div className="max-w-[1152px] w-full flex flex-col items-center gap-8 md:gap-10">
          <FadeUp delay={0.1} className="text-center flex flex-col gap-3">
            <h2 className="text-[#1E1E1E] text-2xl md:text-3xl font-extrabold">
              Fondasi Utama Keunggulan Kami
            </h2>
            <p className="text-[#757575] text-[14px] md:text-[15px] font-normal max-w-2xl mx-auto leading-relaxed">
              Nilai-nilai ini adalah inti dari setiap keputusan, desain, dan
              struktur yang kami bangun.
            </p>
          </FadeUp>

          <FadeUp
            delay={0.2}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-[900px]"
          >
            {[
              {
                titleKey: "nilai_1_title",
                descKey: "nilai_1_desc",
                iconKey: "nilai_1_icon",
                defaultTitle: "Integritas",
                defaultDesc:
                  "Kami menjalankan bisnis dengan kejujuran, transparansi, dan tanggung jawab penuh dalam setiap aspek operasional kami.",
                defaultIcon: "/integritas.svg",
              },
              {
                titleKey: "nilai_2_title",
                descKey: "nilai_2_desc",
                iconKey: "nilai_2_icon",
                defaultTitle: "Kualitas",
                defaultDesc:
                  "Kami berkomitmen pada standar kualitas tertinggi dalam setiap proyek, memastikan hasil yang melampaui ekspektasi klien.",
                defaultIcon: "/kualitas.svg",
              },
              {
                titleKey: "nilai_3_title",
                descKey: "nilai_3_desc",
                iconKey: "nilai_3_icon",
                defaultTitle: "Inovasi",
                defaultDesc:
                  "Kami terus mengeksplorasi teknologi dan metode konstruksi terbaru untuk memberikan solusi yang lebih efisien dan berkelanjutan.",
                defaultIcon: "/inovasi.svg",
              },
              {
                titleKey: "nilai_4_title",
                descKey: "nilai_4_desc",
                iconKey: "nilai_4_icon",
                defaultTitle: "Kerja Sama Tim",
                defaultDesc:
                  "Kami percaya bahwa kolaborasi yang kuat antar tim adalah kunci keberhasilan setiap proyek yang kami kerjakan.",
                defaultIcon: "/kerja-sama-tim.svg",
              },
            ].map((n, idx) => {
              const title = settings[n.titleKey] || n.defaultTitle;
              const desc = settings[n.descKey] || n.defaultDesc;
              const icon = settings[n.iconKey] || n.defaultIcon;
              return (
                <div key={idx} className="flex gap-5">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] border border-neutral-100 flex items-center justify-center shrink-0">
                    <img
                      src={icon}
                      alt={title}
                      className="w-6 h-6 object-contain opacity-80"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-bold text-[#1E1E1E]">
                      {title}
                    </h4>
                    <p className="text-sm text-[#757575] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </FadeUp>
        </div>
      </section>
    </main>
  );
}

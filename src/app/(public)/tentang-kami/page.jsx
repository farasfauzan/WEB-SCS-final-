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
        "Meringankan beban operasional melalui adopsi teknologi konstruksi mutakhir.",
        "Membangun hubungan jangka panjang dengan klien berdasarkan kepercayaan.",
        "Mengembangkan kapabilitas profesional tim kami secara berkelanjutan.",
        "Berkontribusi pada pembangunan berkelanjutan infrastruktur Indonesia.",
      ];

  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pb-24">
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center rounded-b-[64px] overflow-hidden bg-[#004282]">
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

      <section className="flex flex-col items-center justify-start pt-16 md:pt-20 px-6 gap-12 md:gap-16">
        <FadeUp
          delay={0.1}
          className="max-w-[800px] w-full text-center flex flex-col gap-4"
        >
          <h2 className="text-[#1E1E1E] text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
            {aboutTitle}
          </h2>
          <p className="text-[#757575] text-[15px] font-normal leading-relaxed whitespace-pre-line">
            {aboutContent}
          </p>
        </FadeUp>

        <FadeUp
          delay={0.2}
          className="max-w-[1000px] w-full bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-neutral-200"
        >
          <div className="flex flex-col gap-10">
            <article className="text-center flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-[#1E1E1E]">Visi</h3>
              <p className="text-[15px] text-[#424242] leading-relaxed max-w-[800px] mx-auto whitespace-pre-line">
                {aboutVision}
              </p>
            </article>
            <article className="flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-[#1E1E1E] text-center mb-2">
                Misi
              </h3>
              <ul className="list-disc pl-5 md:pl-10 space-y-3 text-[15px] text-[#424242] leading-relaxed marker:text-neutral-400">
                {aboutMission.map((item, idx) => (
                  <li key={idx}>{item.replace(/^-\s*/, "")}</li>
                ))}
              </ul>
            </article>
          </div>
        </FadeUp>
      </section>

      <section className="flex flex-col items-center justify-start py-16 md:py-20 px-6 gap-12 md:gap-16">
        <div className="max-w-[1152px] w-full flex flex-col items-center gap-10">
          <FadeUp delay={0.1} className="text-center flex flex-col gap-3">
            <h2 className="text-[#1E1E1E] text-3xl font-extrabold">
              Fondasi Utama Keunggulan Kami
            </h2>
            <p className="text-[#757575] text-[15px] font-normal max-w-2xl mx-auto leading-relaxed">
              Nilai-nilai ini adalah inti dari setiap keputusan, desain, dan
              struktur yang kami bangun.
            </p>
          </FadeUp>

          <FadeUp
            delay={0.2}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[900px]"
          >
            {[
              { titleKey: "nilai_1_title", descKey: "nilai_1_desc", iconKey: "nilai_1_icon", defaultTitle: "Integritas", defaultDesc: "Kami menjalankan bisnis dengan kejujuran, transparansi, dan tanggung jawab penuh dalam setiap aspek operasional kami.", defaultIcon: "/integritas.svg" },
              { titleKey: "nilai_2_title", descKey: "nilai_2_desc", iconKey: "nilai_2_icon", defaultTitle: "Kualitas", defaultDesc: "Kami berkomitmen pada standar kualitas tertinggi dalam setiap proyek, ensuring hasil yang melampaui ekspektasi klien.", defaultIcon: "/kualitas.svg" },
              { titleKey: "nilai_3_title", descKey: "nilai_3_desc", iconKey: "nilai_3_icon", defaultTitle: "Inovasi", defaultDesc: "Kami terus mengeksplorasi teknologi dan metode konstruksi terbaru untuk memberikan solusi yang lebih efisien dan berkelanjutan.", defaultIcon: "/inovasi.svg" },
              { titleKey: "nilai_4_title", descKey: "nilai_4_desc", iconKey: "nilai_4_icon", defaultTitle: "Kerja Sama Tim", defaultDesc: "Kami percaya bahwa kolaborasi yang kuat antar tim adalah kunci keberhasilan setiap proyek yang kami kerjakan.", defaultIcon: "/kerja-sama-tim.svg" },
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
                    <h4 className="text-lg font-bold text-[#1E1E1E]">{title}</h4>
                    <p className="text-sm text-[#757575] leading-relaxed">{desc}</p>
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

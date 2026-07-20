import FadeUp from "@/components/ui/FadeUp";
import NewsCard from "@/components/shared/NewsCard";
import Link from "next/link";

const FALLBACK_NEWS = [
  {
    id: 1,
    title: "Peresmian Kantor Baru PT Sinar Cerah Sempurna",
    desc: "Peresmian kantor baru ini tidak hanya menandai bertambahnya fasilitas operasional...",
    imageUrl: "",
  },
  {
    id: 2,
    title: "Penghargaan Kontraktor Terbaik 2025",
    desc: "SCS berhasil meraih penghargaan nasional berkat komitmen pada standar keselamatan...",
    imageUrl: "",
  },
  {
    id: 3,
    title: "Penerapan Beton Ramah Lingkungan",
    desc: "Dalam proyek terbaru, kami mulai mengimplementasikan penggunaan material konstruksi hijau...",
    imageUrl: "",
  },
];

export default function NewsPreview({ data }) {
  const previewNews = data?.length > 0 ? data.slice(0, 3) : FALLBACK_NEWS;

  return (
    <section className="w-full bg-[#F1F1F1] pt-4 md:pt-[clamp(3rem,8vh,6rem)] pb-6 md:pb-[clamp(3rem,8vh,6rem)] flex flex-col items-center justify-center px-6">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        <FadeUp
          delay={0.1}
          className="text-center flex flex-col gap-3 max-w-3xl mb-[clamp(2rem,5vh,3rem)]"
        >
          <h2 className="text-black text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold font-['Plus_Jakarta_Sans']">
            Kilas Balik & Berita Terkini
          </h2>
          <p className="text-stone-600 text-[13px] md:text-base font-normal font-['Plus_Jakarta_Sans']">
            Simak perjalanan dan perkembangan terbaru dari proyek-proyek
            strategis kami serta dedikasi kami dalam menghadirkan solusi
            konstruksi berkualitas.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 w-full mb-4">
          {previewNews.map((item, idx) => (
            <FadeUp key={item.id} delay={0.2 + idx * 0.1}>
              <NewsCard news={item} />
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.5} className="w-full flex justify-end mt-2 md:mt-0">
          <Link
            href="/berita"
            className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-bold text-xs md:text-sm font-['Plus_Jakarta_Sans'] transition-colors"
          >
            Lihat Semua
            <svg
              className="w-4 h-4 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

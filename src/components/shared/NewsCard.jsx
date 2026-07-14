import Link from "next/link";
import { IMAGE_SIZES } from "@/lib/cloudinary";
import OptimizedImage from "@/components/shared/OptimizedImage";

export default function NewsCard({ news }) {
  const imgSrc = news?.imageUrl || news?.image || "";
  const desc = news?.desc || news?.excerpt || news?.content || "Deskripsi berita tidak tersedia.";

  return (
    <Link href={`/berita/${news.id}`} className="bg-white rounded-[20px] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all group w-full border border-neutral-100 h-full">
      <div className="w-full h-[160px] bg-neutral-200 relative overflow-hidden shrink-0">
        {imgSrc ? (
          <OptimizedImage
            src={imgSrc}
            alt={news.title}
            fill
            cldOptions={IMAGE_SIZES.card}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm font-medium">Gambar Berita</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow gap-2">
        <h3 className="text-stone-900 text-lg font-bold font-['Plus_Jakarta_Sans'] leading-tight">
          {news?.title || "Judul Berita Terbaru"}
        </h3>
        <p className="text-neutral-500 text-xs font-normal font-['Plus_Jakarta_Sans'] line-clamp-3 leading-relaxed mt-1">
          {desc}
        </p>
      </div>
    </Link>
  );
}
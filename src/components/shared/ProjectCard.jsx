import Link from "next/link";
import { IMAGE_SIZES } from "@/lib/cloudinary";
import OptimizedImage from "@/components/shared/OptimizedImage";

export default function ProjectCard({ project }) {
  const imgSrc = project?.imageUrl || project?.image || "";

  return (
    <Link href={`/proyek/${project.id}`} className="bg-white rounded-[20px] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all group w-full border border-neutral-100 h-full">
      <div className="w-full h-[160px] bg-neutral-200 relative overflow-hidden shrink-0">
        {imgSrc ? (
          <OptimizedImage
            src={imgSrc}
            alt={project.title}
            fill
            cldOptions={IMAGE_SIZES.card}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm font-medium">Gambar Proyek</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-blue-700 text-xs font-bold font-['Plus_Jakarta_Sans'] mb-1.5">{project?.category || project?.kategori || "Kategori"}</span>
        <h3 className="text-stone-900 text-lg font-bold font-['Plus_Jakarta_Sans'] leading-tight mb-4">
          {project?.title || project?.name || "Judul Proyek Konstruksi"}
        </h3>
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center gap-2 text-neutral-500">
            <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span className="text-[11px] font-semibold font-['Plus_Jakarta_Sans'] line-clamp-1">{project?.location || "Lokasi Proyek"}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            <span className="text-[11px] font-semibold font-['Plus_Jakarta_Sans'] line-clamp-1">{project?.client || "Nama Klien"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
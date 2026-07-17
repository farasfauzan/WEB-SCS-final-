"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [term, setTerm] = useState(searchParams.get("q")?.toString() || "");

  useEffect(() => {
    // 1. Ambil nilai query 'q' dari URL saat ini
    const currentQuery = searchParams.get("q") || "";

    // 2. GUARD CLAUSE (KUNCI PERBAIKAN):
    // Hentikan eksekusi jika input state 'term' sudah sama dengan parameter URL.
    if (term === currentQuery) return;

    // 3. Jalankan Debounce jika ada perbedaan
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }

      replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [term, pathname, replace, searchParams]);

  return (
    <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2 w-full max-w-7xl border border-neutral-100 flex">
      <input
        type="text"
        placeholder="Cari Berita (Judul atau Isi)..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="bg-transparent pl-6 pr-6 py-2.5 w-full text-base font-['Plus_Jakarta_Sans'] text-neutral-600 focus:outline-none placeholder:text-neutral-400"
      />
      <button className="cursor-pointer w-11 h-11 rounded-full bg-[#5a67d8] flex items-center justify-center hover:scale-105 transition-transform shrink-0 ml-auto">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
}

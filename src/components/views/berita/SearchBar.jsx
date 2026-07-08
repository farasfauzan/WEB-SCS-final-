"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Mengambil nilai awal dari URL jika pengguna melakukan refresh halaman
  const [term, setTerm] = useState(searchParams.get("q")?.toString() || "");

  useEffect(() => {
    // Debounce: Tunggu 300ms setelah selesai mengetik sebelum mengubah URL
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("q", term); // Setel query parameternya, ex: ?q=beton
      } else {
        params.delete("q"); // Hapus jika input kosong
      }
      
      // Update URL tanpa reload halaman (scroll: false agar tidak melompat ke atas)
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
      <button className="w-11 h-11 rounded-full bg-[#5a67d8] flex items-center justify-center hover:scale-105 transition-transform shrink-0 ml-auto">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </button>
    </div>
  );
}
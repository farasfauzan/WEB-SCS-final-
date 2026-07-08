"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({ totalPages, basePath, scrollId = "daftar-konten" }) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  // Layar HANYA akan scroll jika fungsi ini dipicu oleh klik
  const handleScroll = () => {
    const targetElement = document.getElementById(scrollId);
    if (targetElement) {
      const yOffset = targetElement.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: yOffset, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Link
        href={`${basePath}?page=1`}
        scroll={false} 
        onClick={handleScroll}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
          currentPage === 1 
            ? "bg-neutral-200 text-neutral-400 pointer-events-none" 
            : "bg-sky-900 text-white hover:bg-sky-950"
        }`}
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/></svg>
      </Link>

      <Link
        href={`${basePath}?page=${Math.max(1, currentPage - 1)}`}
        scroll={false}
        onClick={handleScroll}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
          currentPage === 1 
            ? "bg-neutral-200 text-neutral-400 pointer-events-none" 
            : "bg-sky-900 text-white hover:bg-sky-950"
        }`}
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
      </Link>

      {getPageNumbers().map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          scroll={false}
          onClick={handleScroll}
          className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-colors ${
            currentPage === page
              ? "bg-yellow-400 text-sky-950"
              : "bg-neutral-200 text-stone-700 hover:bg-neutral-300"
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`}
        scroll={false}
        onClick={handleScroll}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
          currentPage === totalPages 
            ? "bg-neutral-200 text-neutral-400 pointer-events-none" 
            : "bg-sky-900 text-white hover:bg-sky-950"
        }`}
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
      </Link>

      <Link
        href={`${basePath}?page=${totalPages}`}
        scroll={false}
        onClick={handleScroll}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
          currentPage === totalPages 
            ? "bg-neutral-200 text-neutral-400 pointer-events-none" 
            : "bg-sky-900 text-white hover:bg-sky-950"
        }`}
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/></svg>
      </Link>
    </div>
  );
}
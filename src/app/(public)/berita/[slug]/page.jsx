"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import FadeUp from "@/components/ui/FadeUp";
import CldImg from "@/components/shared/CldImg";
import InteractiveGallery from "@/components/ui/InteractiveGallery";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import ShareButtons from "@/components/shared/ShareButtons";

export default function DetailBeritaPage({ params }) {
  const { slug } = React.use(params);
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", content: "" });
  const [commentError, setCommentError] = useState("");
  const [commentSuccess, setCommentSuccess] = useState(false);

   useEffect(() => {
    fetch(`/api/news/slug/${slug}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.news) {
          setNews(data.news);
          // Fetch comments
          try {
            const commentsRes = await fetch(`/api/news/${data.news.slug}/comments`);
            const commentsData = await commentsRes.json();
            setComments(commentsData.comments || []);
          } catch (err) {
            console.warn("Failed to fetch comments:", err);
          }
        }

        // Fetch related news
        try {
          const newsRes = await fetch("/api/news?status=PUBLISHED");
          const newsData = await newsRes.json();
          const filtered = (newsData.news || []).filter(n => n.slug !== data.news.slug && n.id !== data.news.id);
          setRelatedNews(filtered.slice(0, 3));
        } catch (err) {
          console.warn("Failed to fetch related news:", err);
        }
      })
      .catch((err) => { console.warn("Failed to fetch news:", err); })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return <div className="min-h-screen bg-zinc-100" />;
  if (!news) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center font-['Plus_Jakarta_Sans'] text-neutral-500">
        Artikel berita tidak ditemukan.
      </div>
    );
  }

  // Sanitasi & Pemformatan Data Galeri (support JSON string, object, dan plain URL)
  const rawGallery = news.galleryImages || news.gallery || news.images || [];
  const formattedGallery = rawGallery.map((item) => {
    if (typeof item === "string") {
      try {
        const parsed = JSON.parse(item);
        if (parsed && typeof parsed === "object" && parsed.url) {
          return { url: parsed.url, caption: parsed.caption || "" };
        }
      } catch (err) { console.warn("Failed to parse gallery item:", err); }
      return { url: item, caption: "" };
    }
    return { url: item.url || "", caption: item.caption || "" };
  });

  const formatYellowText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={index} className="text-[#FFD700]">
            {part.replace(/\*\*/g, "")}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

   const publishDate = news.createdAt
     ? new Date(news.createdAt).toLocaleDateString("id-ID", {
         day: "numeric",
         month: "long",
         year: "numeric",
       })
     : "9 Juli 2026";

   const handleCommentSubmit = async (e) => {
     e.preventDefault();
     setCommentError("");
     if (!commentForm.name.trim() || !commentForm.email.trim() || !commentForm.content.trim()) {
       setCommentError("Semua field harus diisi.");
       return;
     }
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(commentForm.email)) {
       setCommentError("Format email tidak valid.");
       return;
     }
     try {
       const res = await fetch(`/api/news/${news.slug}/comments`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(commentForm),
       });
       if (!res.ok) throw new Error((await res.json()).error || "Gagal mengirim komentar.");
       setCommentForm({ name: "", email: "", content: "" });
       setCommentSuccess(true);
       setTimeout(() => setCommentSuccess(false), 3000);
     } catch (err) {
       setCommentError(err.message);
     }
   };

   return (
    <main className="w-full bg-zinc-100 min-h-screen pt-16 md:pt-20 pb-20 md:pb-24 px-3 md:px-4 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-[1144px] flex flex-col gap-4 md:gap-5">
        {news && (
          <Breadcrumbs
            items={[
              { label: "Beranda", href: "/" },
              { label: "Berita", href: "/berita" },
              { label: news?.title || "Detail Berita" },
            ]}
          />
        )}
        <FadeUp delay={0.1}>
          <Link
            href="/berita"
            className="flex items-center gap-2 text-blue-900 text-[13px] md:text-[14px] font-semibold font-['Plus_Jakarta_Sans'] hover:opacity-80 transition-opacity w-fit"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Berita
          </Link>
        </FadeUp>

        <FadeUp
          delay={0.2}
          className="w-full bg-white rounded-[24px] md:rounded-[48px] px-4 md:px-6 pt-4 pb-5 lg:px-8 lg:pt-6 lg:pb-8 flex flex-col gap-4 md:gap-8 shadow-sm border border-neutral-100"
        >
          <div className="w-full flex flex-col gap-3 md:gap-4">
            <div className="w-full text-left">
              <p className="text-blue-900 text-[11px] md:text-[13px] font-bold font-['Plus_Jakarta_Sans'] tracking-widest uppercase">
                Berita Terkini • {publishDate}
              </p>
            </div>

            <div className="w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-xl md:rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden relative">
              <CldImg
                src={news.imageUrl || news.image || "/carousel1.svg"}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="w-full text-left text-black text-xl md:text-3xl font-bold font-['Montserrat'] leading-snug">
            {formatYellowText(news.title)}
          </h1>

          <div className="flex items-center gap-3 mt-2">
            <ShareButtons
              title={news.title}
              url={`${process.env.NEXT_PUBLIC_APP_URL || "https://sinarcerahsempurna.com"}/berita/${news.slug}`}
              description={news.excerpt?.slice(0, 100) || news.content?.slice(0, 100) || ""}
            />
          </div>

          <hr className="border-neutral-100 w-full" />

          <div className="w-full text-neutral-800 text-[13px] md:text-[15px] font-normal font-['Montserrat'] leading-[1.7] md:leading-[1.8] whitespace-pre-line text-justify">
            {formatYellowText(news.content || news.description || news.desc)}
          </div>
        </FadeUp>

        <FadeUp
          delay={0.3}
          className="w-full bg-white rounded-[24px] md:rounded-[48px] px-4 md:px-6 py-5 md:py-6 lg:px-8 lg:py-8 flex flex-col gap-4 md:gap-8 shadow-sm border border-neutral-100"
        >
          <div className="w-full text-left">
            <h2 className="text-black text-xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
              Galeri
            </h2>
          </div>

          {formattedGallery.length > 0 ? (
            <InteractiveGallery images={formattedGallery} />
          ) : (
            <div className="w-full py-12 md:py-16 flex flex-col items-center justify-center bg-zinc-50 rounded-2xl border-2 border-dashed border-neutral-200">
              <img
                src="/no-picture.svg"
                alt="Tidak ada gambar"
                className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 opacity-40 object-contain"
              />
              <p className="text-neutral-500 text-[13px] md:text-[15px] font-medium font-['Plus_Jakarta_Sans'] text-center px-4">
                Belum ada foto dokumentasi untuk berita ini.
              </p>
            </div>
          )}
        </FadeUp>

        {relatedNews.length > 0 && (
          <FadeUp delay={0.4} className="w-full bg-white rounded-[24px] md:rounded-[48px] px-4 md:px-6 py-5 md:py-6 lg:px-8 lg:py-8 flex flex-col gap-4 md:gap-8 shadow-sm border border-neutral-100">
            <div className="w-full text-left">
              <h2 className="text-black text-xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
                Berita Lainnya
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug}`}
                  className="group bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-[#004282]/30 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                >
                  <div className="aspect-video w-full overflow-hidden bg-zinc-100">
                    <CldImg
                      src={item.imageUrl || "/carousel1.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-neutral-800 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </FadeUp>
         )}

         <FadeUp delay={0.5} className="w-full bg-white rounded-[24px] md:rounded-[48px] px-4 md:px-6 py-5 md:py-6 lg:px-8 lg:py-8 flex flex-col gap-4 md:gap-8 shadow-sm border border-neutral-100">
           <div className="w-full text-left">
             <h2 className="text-black text-xl md:text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
               Komentar ({comments.length})
             </h2>
           </div>

           {/* Comment Form */}
           <form onSubmit={handleCommentSubmit} className="space-y-4">
             {commentError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">{commentError}</div>}
             {commentSuccess && <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg">Komentar berhasil dikirim! Menunggu moderasi.</div>}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Nama *</label>
                 <input type="text" value={commentForm.name} onChange={(e) => setCommentForm((prev) => ({ ...prev, name: e.target.value }))} required
                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                 <input type="email" value={commentForm.email} onChange={(e) => setCommentForm((prev) => ({ ...prev, email: e.target.value }))} required
                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm" />
               </div>
             </div>
             <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">Komentar *</label>
               <textarea value={commentForm.content} onChange={(e) => setCommentForm((prev) => ({ ...prev, content: e.target.value }))} rows={3} required
                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004282] text-sm resize-none" />
             </div>
             <button type="submit" className="bg-[#004282] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-900 transition-colors">
               Kirim Komentar
             </button>
           </form>

           {/* Comments List */}
           <div className="space-y-4 mt-4">
             {comments.length === 0 ? (
               <p className="text-sm text-gray-500 text-center py-8">Belum ada komentar. Jadilah yang pertama!</p>
             ) : (
               comments.map((comment) => (
                 <div key={comment.id} className="border border-gray-100 rounded-xl p-4">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-8 h-8 rounded-full bg-[#004282]/10 flex items-center justify-center text-[#004282] font-bold text-xs">
                       {comment.name?.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <p className="text-sm font-semibold text-gray-800">{comment.name}</p>
                       <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                     </div>
                   </div>
                   <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                 </div>
               ))
             )}
           </div>
         </FadeUp>
       </div>
     </main>
  );
}

import NewsCard from "@/components/shared/NewsCard";

export default function NewsList({ newsData }) {
  if (!newsData || newsData.length === 0) {
    return (
      <div className="text-center text-neutral-500 py-10">
        Tidak ada berita yang ditemukan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full">
      {newsData.map((news) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  );
}

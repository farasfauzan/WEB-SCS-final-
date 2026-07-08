import NewsSkeleton from "@/components/ui/NewsSkeleton";

export default function Loading() {
  return (
    <main className="w-full bg-[#F1F1F1] min-h-screen pb-24">
      
      {/* Skeleton Hero Section */}
      <section className="relative w-full min-h-[100svh] py-32 flex flex-col items-center justify-center rounded-b-[64px] bg-neutral-300 animate-pulse">
        <div className="w-3/4 max-w-2xl h-12 bg-neutral-400/50 rounded-md mb-6"></div>
        <div className="w-1/2 max-w-lg h-6 bg-neutral-400/50 rounded-md"></div>
      </section>

      {/* Skeleton Search Bar */}
      <section className="relative z-20 -mt-8 px-6 flex justify-center">
        <div className="bg-white rounded-full shadow-md p-2 w-full max-w-7xl h-16 animate-pulse"></div>
      </section>

      {/* Skeleton Grid Berita */}
      <section className="w-full flex justify-center pt-[clamp(3rem,6vh,5rem)] px-6">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {/* Render 6 Skeleton secara bersamaan */}
            {Array(6).fill(0).map((_, idx) => (
              <NewsSkeleton key={idx} />
            ))}
          </div>
        </div>
      </section>
      
    </main>
  );
}
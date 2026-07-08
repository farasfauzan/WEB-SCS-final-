export default function ProjectSkeleton() {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden flex flex-col shadow-sm w-full border border-neutral-100 animate-pulse h-full">
      <div className="w-full h-[160px] bg-neutral-200 shrink-0"></div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="w-20 h-3 bg-neutral-200 rounded mb-2.5"></div>
        <div className="w-full h-5 bg-neutral-200 rounded mb-2"></div>
        <div className="w-3/4 h-5 bg-neutral-200 rounded mb-4"></div>
        
        <div className="flex flex-col gap-2 mt-auto">
          <div className="w-1/2 h-3 bg-neutral-200 rounded"></div>
          <div className="w-2/3 h-3 bg-neutral-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
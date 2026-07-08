export default function NewsSkeleton() {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden flex flex-col shadow-sm w-full border border-neutral-100 animate-pulse h-full">
      <div className="w-full h-[160px] bg-neutral-200 shrink-0"></div>
      
      <div className="p-4 flex flex-col flex-grow gap-2">
        <div className="w-full h-5 bg-neutral-200 rounded"></div>
        <div className="w-4/5 h-5 bg-neutral-200 rounded"></div>
        <div className="w-full h-3 bg-neutral-200 rounded mt-2"></div>
        <div className="w-2/3 h-3 bg-neutral-200 rounded"></div>
      </div>
    </div>
  );
}
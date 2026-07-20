import Link from "next/link";

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-[12px] md:text-sm text-neutral-500 w-full"
    >
      <ol className="flex items-center flex-wrap gap-1.5 md:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5 md:gap-2">
              {!isLast && item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-neutral-800 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-800 font-semibold truncate max-w-[180px] sm:max-w-[300px] md:max-w-full block">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="select-none text-neutral-400">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

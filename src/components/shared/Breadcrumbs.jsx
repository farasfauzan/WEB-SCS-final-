import Link from "next/link";

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {!isLast && item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-gray-800 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-800 font-semibold">
                  {item.label}
                </span>
              )}
              {!isLast && <span className="select-none">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

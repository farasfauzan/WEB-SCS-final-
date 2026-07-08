// Parses **bold** markers and renders them as yellow bold italic spans
export default function BoldText({ text, className = "", as = "span" }) {
  if (!text) return null;

  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const Tag = as;

  return (
    <Tag className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} className="text-yellow-400 font-bold italic">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </Tag>
  );
}
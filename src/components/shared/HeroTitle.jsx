import BoldText from "./BoldText";

// Renders hero title with **bold** markers parsed as yellow bold italic spans
export default function HeroTitle({ text, className = "" }) {
  return <BoldText text={text} className={className} as="h1" />;
}
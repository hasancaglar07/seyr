import { splitParagraphs } from "@/lib/content";
import { cn } from "@/lib/utils";

export function RichTextContent({
  text,
  fallback,
  className,
}: {
  text?: string | null;
  fallback: string;
  className?: string;
}) {
  const paragraphs = splitParagraphs(text);
  const resolved = paragraphs.length > 0 ? paragraphs : [fallback];

  return (
    <div className={cn("prose-seyr", className)}>
      {resolved.map((paragraph, index) => (
        <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
}

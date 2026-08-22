import type { ReactNode } from "react";

interface SummaryItem {
  label: string;
  value: string;
}

interface ProtocolSummaryProps {
  items?: SummaryItem[];
  itemsJson?: string;
  caption?: ReactNode;
}

/**
 * The "what I actually do" block that opens a protocol, above the reasoning.
 * A reader who only wants the current instructions should be able to stop here.
 */
export function ProtocolSummary({
  items,
  itemsJson,
  caption,
}: ProtocolSummaryProps) {
  const data: SummaryItem[] = itemsJson ? JSON.parse(itemsJson) : (items ?? []);
  if (data.length === 0) return null;

  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-white/15 bg-white/[0.03]">
      <dl className="divide-y divide-white/5">
        {data.map((item) => (
          <div
            key={item.label}
            className="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"
          >
            <dt className="text-sm font-medium text-white/50">{item.label}</dt>
            <dd className="text-sm leading-relaxed text-white/90">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      {caption && (
        <figcaption className="border-t border-white/5 px-5 py-2 text-xs text-white/50">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

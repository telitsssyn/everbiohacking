import type { ReactNode } from "react";

interface CalloutProps {
  title?: string;
  children: ReactNode;
}

export function Callout({ title, children }: CalloutProps) {
  return (
    <aside className="my-8 rounded-lg border border-white/10 bg-white/[0.02] p-5">
      {title && (
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/60">
          {title}
        </div>
      )}
      <div className="text-base leading-relaxed text-white/90">{children}</div>
    </aside>
  );
}

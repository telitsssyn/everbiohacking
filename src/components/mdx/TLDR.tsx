import type { ReactNode } from "react";

export function TLDR({ children }: { children: ReactNode }) {
  return (
    <aside className="my-8 rounded-lg border-l-2 border-white/40 bg-white/[0.03] px-5 py-4">
      <div className="mb-1 text-xs font-medium uppercase tracking-widest text-white/50">
      </div>
      <div className="text-base leading-relaxed text-white/90">{children}</div>
    </aside>
  );
}

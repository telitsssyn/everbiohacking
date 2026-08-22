"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Protocol } from "@/lib/types";
import { ProtocolCard } from "./ProtocolCard";

type Tab = "updated" | "popular";

interface FilterTabsProps {
  protocols: Protocol[];
}

export function FilterTabs({ protocols }: FilterTabsProps) {
  const t = useTranslations("protocols.tabs");
  const tc = useTranslations("common");
  const [tab, setTab] = useState<Tab>("updated");
  // null = not fetched yet, which is also what "loading" means here.
  const [popularSlugs, setPopularSlugs] = useState<string[] | null>(null);
  const popularLoading = tab === "popular" && popularSlugs === null;

  useEffect(() => {
    if (tab !== "popular" || popularSlugs !== null) return;
    let cancelled = false;
    fetch("/api/views")
      .then((res) => res.json())
      .then((slugs: string[]) => {
        if (!cancelled) setPopularSlugs(slugs);
      })
      // On failure, fall back to the default order rather than spinning forever.
      .catch(() => {
        if (!cancelled) setPopularSlugs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [tab, popularSlugs]);

  const filtered = [...protocols];

  if (tab === "popular" && popularSlugs && popularSlugs.length > 0) {
    filtered.sort((a, b) => {
      const idxA = popularSlugs.indexOf(a.slug);
      const idxB = popularSlugs.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0; // if neither is in popular list, keep original (updated) order
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-6 border-b border-white/10 pb-3 text-sm">
        <TabButton active={tab === "updated"} onClick={() => setTab("updated")}>
          {t("recentlyUpdated")}
        </TabButton>
        <TabButton active={tab === "popular"} onClick={() => setTab("popular")}>
          {t("mostPopular")}
        </TabButton>
      </div>

      <div className="mt-8 space-y-12">
        {popularLoading ? (
          <p className="text-sm text-white/50">{tc("loading")}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-white/50">{tc("noProtocols")}</p>
        ) : (
          filtered.map((p) => <ProtocolCard key={p.slug} protocol={p} />)
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative pb-3 transition-colors ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {children}
      {active && (
        <span className="absolute -bottom-[1px] left-0 right-0 h-px bg-white" />
      )}
    </button>
  );
}

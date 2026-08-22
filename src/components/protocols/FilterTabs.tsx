"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Article } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";

type Tab = "recent" | "popular" | "articles" | "videos";

interface FilterTabsProps {
  articles: Article[];
}

export function FilterTabs({ articles }: FilterTabsProps) {
  const t = useTranslations("articles.tabs");
  const tc = useTranslations("common");
  const [tab, setTab] = useState<Tab>("recent");
  const [popularSlugs, setPopularSlugs] = useState<string[]>([]);
  const [popularLoading, setPopularLoading] = useState(false);

  useEffect(() => {
    if (tab === "popular" && popularSlugs.length === 0) {
      fetch("/api/views")
        .then((res) => res.json())
        .then((slugs) => setPopularSlugs(slugs))
        .catch(() => {}) // fallback to standard sort if API fails
        .finally(() => setPopularLoading(false));
    }
  }, [tab, popularSlugs.length]);

  const filtered = [...articles].filter((a) => {
    if (tab === "articles") return a.type === "article";
    if (tab === "videos") return a.type === "video";
    return true;
  });

  if (tab === "popular" && popularSlugs.length > 0) {
    filtered.sort((a, b) => {
      const idxA = popularSlugs.indexOf(a.slug);
      const idxB = popularSlugs.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0; // if neither is in popular list, keep original (recent) order
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-6 border-b border-white/10 pb-3 text-sm">
        <TabButton active={tab === "recent"} onClick={() => setTab("recent")}>
          {t("mostRecent")}
        </TabButton>
        <TabButton active={tab === "popular"} onClick={() => setTab("popular")}>
          {t("mostPopular")}
        </TabButton>
        <TabButton
          active={tab === "articles"}
          onClick={() => setTab("articles")}
        >
          {t("articlesOnly")}
        </TabButton>
        <TabButton active={tab === "videos"} onClick={() => setTab("videos")}>
          {t("videosOnly")}
        </TabButton>
      </div>

      <div className="mt-8 space-y-12">
        {popularLoading ? (
          <p className="text-sm text-white/50">{tc("loading")}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-white/50">{tc("noArticles")}</p>
        ) : (
          filtered.map((a) => <ArticleCard key={a.slug} article={a} />)
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

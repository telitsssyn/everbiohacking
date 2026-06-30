import { setRequestLocale } from "next-intl/server";
import {
  getBySection,
  getRecent,
  getSectionCounts,
} from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ForBeginners } from "@/components/home/ForBeginners";
import { RecentArticles } from "@/components/home/RecentArticles";
import { TopicsGrid } from "@/components/home/TopicsGrid";
import type { Locale } from "@/lib/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [beginner, recent, counts] = await Promise.all([
    getBySection(locale as Locale, "basics"),
    getRecent(locale as Locale, 3),
    getSectionCounts(locale as Locale),
  ]);

  return (
    <>
      <Hero />
      <AboutPreview />
      <ForBeginners articles={beginner} />
      <RecentArticles articles={recent} />
      <TopicsGrid counts={counts} />
    </>
  );
}

import { setRequestLocale } from "next-intl/server";
import {
  getBySection,
  getRecentlyUpdated,
  getSectionCounts,
} from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { AboutPreview } from "@/components/home/AboutPreview";
import { ForBeginners } from "@/components/home/ForBeginners";
import { RecentlyUpdated } from "@/components/home/RecentlyUpdated";
import { TopicsGrid } from "@/components/home/TopicsGrid";
import type { Locale } from "@/lib/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [beginner, recentlyUpdated, counts] = await Promise.all([
    getBySection(locale as Locale, "basics"),
    getRecentlyUpdated(locale as Locale, 3),
    getSectionCounts(locale as Locale),
  ]);

  return (
    <>
      <Hero />
      <AboutPreview />
      <ForBeginners protocols={beginner} />
      <RecentlyUpdated protocols={recentlyUpdated} />
      <TopicsGrid counts={counts} />
    </>
  );
}

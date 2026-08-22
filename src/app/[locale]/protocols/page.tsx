import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAllArticles } from "@/lib/content";
import { SectionSidebar } from "@/components/articles/SectionSidebar";
import { FilterTabs } from "@/components/articles/FilterTabs";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  return { title: t("title") };
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = await getAllArticles(locale as Locale);

  const t = await getTranslations({ locale, namespace: "articles" });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <h1 className="font-serif text-4xl text-white sm:text-5xl">
        {t("title")}
      </h1>
      <div className="mt-10 grid gap-12 md:grid-cols-[220px_1fr]">
        <SectionSidebar />
        <FilterTabs articles={articles} />
      </div>
    </div>
  );
}

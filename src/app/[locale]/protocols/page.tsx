import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAllProtocols } from "@/lib/content";
import { SectionSidebar } from "@/components/protocols/SectionSidebar";
import { FilterTabs } from "@/components/protocols/FilterTabs";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "protocols" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ProtocolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const protocols = await getAllProtocols(locale as Locale);

  const t = await getTranslations({ locale, namespace: "protocols" });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <h1 className="font-serif text-4xl text-white sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-white/60">{t("subtitle")}</p>
      <div className="mt-10 grid gap-12 md:grid-cols-[220px_1fr]">
        <SectionSidebar />
        <FilterTabs protocols={protocols} />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getBySection } from "@/lib/content";
import { isSection, SECTIONS } from "@/lib/sections";
import { SectionSidebar } from "@/components/protocols/SectionSidebar";
import { ProtocolCard } from "@/components/protocols/ProtocolCard";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/types";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SECTIONS.map((section) => ({ locale, section })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  if (!isSection(section)) return {};
  const tSections = await getTranslations({ locale, namespace: "sections" });
  const tDesc = await getTranslations({
    locale,
    namespace: "sectionDescriptions",
  });
  return { title: tSections(section), description: tDesc(section) };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  if (!isSection(section)) notFound();
  setRequestLocale(locale);

  const protocols = await getBySection(locale as Locale, section);
  const tSections = await getTranslations({ locale, namespace: "sections" });
  const tDesc = await getTranslations({
    locale,
    namespace: "sectionDescriptions",
  });
  const tc = await getTranslations({ locale, namespace: "common" });
  const t = await getTranslations({ locale, namespace: "protocols" });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      <div className="text-sm uppercase tracking-widest text-white/50">
        {t("title")}
      </div>
      <h1 className="mt-2 font-serif text-4xl text-white sm:text-5xl">
        {tSections(section)}
      </h1>
      <p className="mt-3 max-w-2xl text-white/60">{tDesc(section)}</p>

      <div className="mt-10 grid gap-12 md:grid-cols-[220px_1fr]">
        <SectionSidebar activeSection={section} />
        <div className="space-y-12">
          {protocols.length === 0 ? (
            <p className="text-sm text-white/50">{tc("noProtocols")}</p>
          ) : (
            protocols.map((p) => <ProtocolCard key={p.slug} protocol={p} />)
          )}
        </div>
      </div>
    </div>
  );
}

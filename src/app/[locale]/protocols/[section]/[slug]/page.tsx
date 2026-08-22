import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import {
  getProtocolBySlug,
  getAllProtocols,
  getMappedSlug,
} from "@/lib/content";
import { isSection } from "@/lib/sections";
import { ProtocolHeader } from "@/components/protocols/ProtocolHeader";
import { MedicalDisclaimer } from "@/components/mdx/MedicalDisclaimer";
import { YouTube } from "@/components/mdx/YouTube";
import { mdxComponents } from "@/components/mdx/mdxComponents";
import { ViewCounter } from "@/components/protocols/ViewCounter";
import { routing } from "@/i18n/routing";
import { redirect } from "@/i18n/navigation";
import { LanguageAlternate } from "@/components/layout/LanguageAlternate";
import type { Locale } from "@/lib/types";

export async function generateStaticParams() {
  const params: { locale: string; section: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const protocols = await getAllProtocols(locale as Locale);
    for (const p of protocols) {
      params.push({ locale, section: p.section, slug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string; slug: string }>;
}) {
  const { locale, section, slug } = await params;
  if (!isSection(section)) return {};
  const protocol = await getProtocolBySlug(locale as Locale, section, slug);
  if (!protocol) return {};
  return {
    title: protocol.title,
    description: protocol.excerpt,
    // A protocol's identity is its current state, so the modified date is the
    // one that matters for crawlers, not the original publication date.
    other: { "article:modified_time": protocol.updated },
  };
}

export default async function ProtocolPage({
  params,
}: {
  params: Promise<{ locale: string; section: string; slug: string }>;
}) {
  const { locale, section, slug } = await params;
  if (!isSection(section)) notFound();
  setRequestLocale(locale);

  const protocol = await getProtocolBySlug(locale as Locale, section, slug);
  if (!protocol) {
    const mappedSlug = await getMappedSlug(slug, locale as Locale, section);
    if (mappedSlug) {
      redirect({ href: `/protocols/${section}/${mappedSlug}`, locale });
    }
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "protocol" });

  const otherLocale = locale === "en" ? "ru" : "en";
  const alternateSlug = await getMappedSlug(
    slug,
    otherLocale as Locale,
    section,
  );

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <LanguageAlternate slug={alternateSlug} />
      <ViewCounter slug={protocol.slug} />
      <ProtocolHeader protocol={protocol} />
      <MedicalDisclaimer />

      {protocol.heroImage && (
        <div className="relative my-8 aspect-[21/9] w-full overflow-hidden rounded-xl border border-white/10">
          <Image
            src={protocol.heroImage}
            alt={protocol.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose-invert">
        <MDXRemote source={protocol.content} components={mdxComponents} />
      </div>

      {/* Video is a channel for the protocol, not a separate kind of content. */}
      {protocol.videoUrl && (
        <section className="mt-16 border-t border-white/10 pt-8">
          <h2 className="font-serif text-2xl text-white">
            {t("companionVideo")}
          </h2>
          <YouTube url={protocol.videoUrl} title={protocol.title} />
        </section>
      )}
    </article>
  );
}

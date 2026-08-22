import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { getArticleBySlug, getAllArticles, getMappedSlug } from "@/lib/content";
import { isSection } from "@/lib/sections";
import { ArticleHeader } from "@/components/articles/ArticleHeader";
import { MedicalDisclaimer } from "@/components/mdx/MedicalDisclaimer";
import { YouTube } from "@/components/mdx/YouTube";
import { mdxComponents } from "@/components/mdx/mdxComponents";
import { ViewCounter } from "@/components/articles/ViewCounter";
import { routing } from "@/i18n/routing";
import { redirect } from "@/i18n/navigation";
import { LanguageAlternate } from "@/components/layout/LanguageAlternate";
import type { Locale } from "@/lib/types";

export async function generateStaticParams() {
  const params: { locale: string; section: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const articles = await getAllArticles(locale as Locale);
    for (const a of articles) {
      params.push({ locale, section: a.section, slug: a.slug });
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
  const article = await getArticleBySlug(locale as Locale, section, slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; section: string; slug: string }>;
}) {
  const { locale, section, slug } = await params;
  if (!isSection(section)) notFound();
  setRequestLocale(locale);

  const article = await getArticleBySlug(locale as Locale, section, slug);
  if (!article) {
    const mappedSlug = await getMappedSlug(slug, locale as Locale, section);
    if (mappedSlug) {
      redirect({ href: `/articles/${section}/${mappedSlug}`, locale });
    }
    notFound();
  }

  

  const otherLocale = locale === "en" ? "ru" : "en";
  const alternateSlug = await getMappedSlug(slug, otherLocale as Locale, section);

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <LanguageAlternate slug={alternateSlug} />
      <ViewCounter slug={article.slug} />
      <ArticleHeader article={article} />
      <MedicalDisclaimer />

      {article.type === "video" && article.videoUrl && (
        <YouTube url={article.videoUrl} title={article.title} />
      )}

      {article.heroImage && article.type === "article" && (
        <div className="relative my-8 aspect-[21/9] w-full overflow-hidden rounded-xl border border-white/10">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose-invert">
        <MDXRemote source={article.content} components={mdxComponents} />
      </div>
    </article>
  );
}

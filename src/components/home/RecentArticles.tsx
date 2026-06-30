import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Article, Locale } from "@/lib/types";
import { formatDate } from "@/lib/formatDate";

interface RecentArticlesProps {
  articles: Article[];
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-2xl text-white sm:text-3xl">
          {t("recentArticles")}
        </h2>
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          {t("moreArticles")} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {articles.length === 0 ? (
          <p className="text-sm text-white/50 md:col-span-3">{tc("noArticles")}</p>
        ) : (
          articles.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.section}/${a.slug}`}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20"
            >
              <div className="relative aspect-[4/3] w-full bg-white/[0.04]">
                {a.heroImage && (
                  <Image
                    src={a.heroImage}
                    alt={a.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="font-serif text-base text-white">
                  {a.title}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-white/60">
                  {a.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-white/40">
                  <span>{formatDate(a.date, locale)}</span>
                  <span>·</span>
                  <span>{tc("minRead", { minutes: a.readingTime })}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article, Locale } from "@/lib/types";
import { formatDate } from "@/lib/formatDate";

export function ArticleCard({ article }: { article: Article }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("articles");
  const metaKey = article.type === "video" ? "videoMeta" : "articleMeta";
  return (
    <Link
      href={`/articles/${article.section}/${article.slug}`}
      className="group block"
    >
      {article.heroImage && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-white/[0.04]">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            quality={100}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <h3 className="mt-4 font-serif text-2xl text-white group-hover:text-white/90">
        {article.title}
      </h3>
      <div className="mt-2 text-sm text-white/50">
        {formatDate(article.date, locale)} · {t(metaKey, { minutes: article.readingTime })}
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70">
        {article.excerpt}
      </p>
    </Link>
  );
}

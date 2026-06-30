import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Article, Locale } from "@/lib/types";
import { formatDate } from "@/lib/formatDate";
import { ShareButton } from "./ShareButton";

export function ArticleHeader({ article }: { article: Article }) {
  const t = useTranslations("articles");
  const tSections = useTranslations("sections");
  const locale = useLocale() as Locale;

  return (
    <header>
      <nav className="text-sm text-white/50">
        <Link href="/articles" className="hover:text-white">
          {t("title")}
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/articles/${article.section}`} className="hover:text-white">
          {tSections(article.section)}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-white/70">{article.title}</span>
      </nav>

      <h1 className="mt-4 font-serif text-3xl font-medium leading-tight text-white sm:text-4xl">
        {article.title}
      </h1>

      <div className="mt-6 flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/[0.06]">
            <Image
              src="/images/pavel-sm.webp"
              alt="Pavel Telitsyn"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="text-sm">
            <div className="text-white">Pavel Telitsyn</div>
            <div className="text-white/50 flex items-center gap-1.5">
              <span>{formatDate(article.date, locale)}</span>
              <span>&middot;</span>
              <span>{t("articleMeta", { minutes: article.readingTime })}</span>
            </div>
          </div>
        </div>
        <ShareButton title={article.title} />
      </div>
    </header>
  );
}

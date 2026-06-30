import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/lib/types";

interface ForBeginnersProps {
  articles: Article[];
}

export function ForBeginners({ articles }: ForBeginnersProps) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-2xl text-white sm:text-3xl">
          {t("forBeginners")}
        </h2>
        <Link
          href="/articles/basics"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          {t("moreArticles")} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {articles.length === 0 ? (
          <PlaceholderCards />
        ) : (
          articles.map((a, i) => (
            <Link
              key={a.slug}
              href={`/articles/${a.section}/${a.slug}`}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="font-serif text-2xl text-white/40">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-4 font-serif text-lg text-white">
                {a.title}
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-white/60">
                {a.excerpt}
              </p>
              <div className="mt-6 text-xs text-white/40">
                {tc("minRead", { minutes: a.readingTime })}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

function PlaceholderCards() {
  const tc = useTranslations("common");
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-white/[0.02] p-6"
        >
          <div className="font-serif text-2xl text-white/40">
            {String(i).padStart(2, "0")}
          </div>
          <div className="mt-4 font-serif text-lg text-white/70">
            {tc("comingSoon")}
          </div>
          <p className="mt-2 text-sm text-white/40">
            {tc("comingSoonBody")}
          </p>
        </div>
      ))}
    </>
  );
}

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale, Protocol } from "@/lib/types";
import { formatDate } from "@/lib/formatDate";

interface RecentlyUpdatedProps {
  protocols: Protocol[];
}

export function RecentlyUpdated({ protocols }: RecentlyUpdatedProps) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const tp = useTranslations("protocols");
  const locale = useLocale() as Locale;
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-2xl text-white sm:text-3xl">
          {t("recentlyUpdated")}
        </h2>
        <Link
          href="/protocols"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          {t("moreProtocols")} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {protocols.length === 0 ? (
          <p className="text-sm text-white/50 md:col-span-3">
            {tc("noProtocols")}
          </p>
        ) : (
          protocols.map((p) => (
            <Link
              key={p.slug}
              href={`/protocols/${p.section}/${p.slug}`}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20"
            >
              <div className="relative aspect-[4/3] w-full bg-white/[0.04]">
                {p.heroImage && (
                  <Image
                    src={p.heroImage}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="font-serif text-base text-white">
                  {p.title}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-white/60">
                  {p.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-white/40">
                  <span>
                    {tp("updatedOn", { date: formatDate(p.updated, locale) })}
                  </span>
                  <span>·</span>
                  <span>{tc("minRead", { minutes: p.readingTime })}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

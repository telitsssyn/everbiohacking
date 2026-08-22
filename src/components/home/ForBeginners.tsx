import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Protocol } from "@/lib/types";

interface ForBeginnersProps {
  protocols: Protocol[];
}

export function ForBeginners({ protocols }: ForBeginnersProps) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-2xl text-white sm:text-3xl">
          {t("forBeginners")}
        </h2>
        <Link
          href="/protocols/basics"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          {t("moreProtocols")} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {protocols.length === 0 ? (
          <PlaceholderCards />
        ) : (
          protocols.map((p, i) => (
            <Link
              key={p.slug}
              href={`/protocols/${p.section}/${p.slug}`}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="font-serif text-2xl text-white/40">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-4 font-serif text-lg text-white">
                {p.title}
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-white/60">
                {p.excerpt}
              </p>
              <div className="mt-6 text-xs text-white/40">
                {tc("minRead", { minutes: p.readingTime })}
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

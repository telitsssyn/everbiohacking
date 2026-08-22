import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale, Protocol } from "@/lib/types";
import { formatDate } from "@/lib/formatDate";

export function ProtocolCard({ protocol }: { protocol: Protocol }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("protocols");
  return (
    <Link
      href={`/protocols/${protocol.section}/${protocol.slug}`}
      className="group block"
    >
      {protocol.heroImage && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-white/[0.04]">
          <Image
            src={protocol.heroImage}
            alt={protocol.title}
            fill
            quality={100}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <h3 className="mt-4 font-serif text-2xl text-white group-hover:text-white/90">
        {protocol.title}
      </h3>
      <div className="mt-2 text-sm text-white/50">
        {t("updatedOn", { date: formatDate(protocol.updated, locale) })} ·{" "}
        {t("meta", { minutes: protocol.readingTime })}
      </div>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70">
        {protocol.excerpt}
      </p>
    </Link>
  );
}

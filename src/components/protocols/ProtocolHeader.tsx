import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale, Protocol } from "@/lib/types";
import { formatDate } from "@/lib/formatDate";
import { ShareButton } from "./ShareButton";

export function ProtocolHeader({ protocol }: { protocol: Protocol }) {
  const t = useTranslations("protocols");
  const tSections = useTranslations("sections");
  const locale = useLocale() as Locale;

  return (
    <header>
      <nav className="text-sm text-white/50">
        <Link href="/protocols" className="hover:text-white">
          {t("title")}
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/protocols/${protocol.section}`}
          className="hover:text-white"
        >
          {tSections(protocol.section)}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-white/70">{protocol.title}</span>
      </nav>

      <h1 className="mt-5 font-serif text-3xl font-medium leading-tight text-white sm:text-4xl">
        {protocol.title}
      </h1>

      {/* `updated` carries the promise the protocol makes: this is current. */}
      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div>
          <dt className="text-white/40">{t("updatedLabel")}</dt>
          <dd className="text-white/80">
            {formatDate(protocol.updated, locale)}
          </dd>
        </div>
        <div>
          <dt className="text-white/40">{t("publishedLabel")}</dt>
          <dd className="text-white/80">{formatDate(protocol.date, locale)}</dd>
        </div>
      </dl>

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
            <div className="text-white/50">
              {t("meta", { minutes: protocol.readingTime })}
            </div>
          </div>
        </div>
        <ShareButton title={protocol.title} />
      </div>
    </header>
  );
}

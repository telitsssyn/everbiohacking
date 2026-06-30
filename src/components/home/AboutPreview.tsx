import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function AboutPreview() {
  const t = useTranslations("home");
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-14">
        <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-white/[0.04]">
          <Image
            src="/images/pavel.webp"
            alt="Pavel"
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover"
            priority
          />
        </div>
        <div>
          <div className="text-sm uppercase tracking-widest text-white/50">
            {t("aboutKicker")}
          </div>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-white sm:text-4xl">
            {t("aboutHeading")}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-white/70">
            <p>{t("aboutBody")}</p>
            <p>{t("aboutBody2")}</p>
            <p>{t("aboutBody3")}</p>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 text-sm">
            <span className="text-white/60">{t("aboutSignature")}</span>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white"
            >
              {t("readFullStory")}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

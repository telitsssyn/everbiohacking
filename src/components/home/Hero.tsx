import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations();
  return (
    <section className="mx-auto max-w-3xl px-6 pt-24 pb-16 text-center sm:pt-32">
      <h1 className="font-serif text-4xl leading-tight tracking-tight text-white sm:text-5xl">
        {t("site.tagline")}
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70">
        {t("site.description")}
      </p>
      <div className="mt-8">
        <Link
          href="/protocols"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
        >
          {t("home.ctaGetStarted")}
        </Link>
      </div>
    </section>
  );
}

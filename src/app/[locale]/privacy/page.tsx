import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/" className="text-sm text-white/50 hover:text-white">
        ← {locale === "ru" ? "На главную" : "Go home"}
      </Link>
      
      <h1 className="mt-8 font-serif text-3xl text-white">{t("heading")}</h1>
      <p className="mt-6 text-white/70 leading-relaxed">{t("intro")}</p>

      <section className="mt-12 space-y-4">
        <h2 className="font-serif text-xl text-white">{t("dataHeading")}</h2>
        <p className="text-white/70 leading-relaxed">{t("dataBody")}</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-serif text-xl text-white">{t("analyticsHeading")}</h2>
        <p className="text-white/70 leading-relaxed">{t("analyticsBody")}</p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-serif text-xl text-white">{t("contactHeading")}</h2>
        <p className="text-white/70 leading-relaxed">{t("contactBody")}</p>
      </section>
    </div>
  );
}

import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-serif text-4xl text-white sm:text-5xl">
        {t("heading")}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-white/80">{t("intro")}</p>

      <h2 className="mt-12 font-serif text-2xl text-white">
        {t("philosophyHeading")}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-white/70">
        {t("philosophyBody")}
      </p>

      <h2 className="mt-12 font-serif text-2xl text-white">
        {t("contactHeading")}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-white/70">
        {t("contactBody")}
      </p>
    </div>
  );
}

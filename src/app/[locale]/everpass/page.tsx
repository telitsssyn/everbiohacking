import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "everpass" });
  return { title: t("title") };
}

export default async function EverPassPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "everpass" });

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="text-sm uppercase tracking-widest text-white/50">
        {t("kicker")}
      </div>
      <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-6 text-base leading-relaxed text-white/70">{t("body")}</p>
    </div>
  );
}

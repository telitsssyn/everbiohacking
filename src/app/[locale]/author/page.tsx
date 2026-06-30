import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "author" });
  return { title: t("title") };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "author" });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
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
            {t("title")}
          </div>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-white sm:text-4xl">
            {t("heading")}
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-white/70">
            <p>{t("body")}</p>
            <p>{t("body2")}</p>
            <p>{t("body3")}</p>
          </div>
          <div className="mt-8 border-t border-white/10 pt-5 text-sm">
            <span className="text-white/60">{t("signature")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

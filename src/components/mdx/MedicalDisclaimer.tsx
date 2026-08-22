import { useTranslations } from "next-intl";

export function MedicalDisclaimer() {
  const t = useTranslations("protocol");
  return (
    <p className="my-6 border-l-2 border-white/20 pl-4 text-sm italic leading-relaxed text-white/60">
      {t("disclaimer")}
    </p>
  );
}

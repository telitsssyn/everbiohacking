import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SECTIONS } from "@/lib/types";

interface SectionSidebarProps {
  activeSection?: string;
}

export function SectionSidebar({ activeSection }: SectionSidebarProps) {
  const t = useTranslations("protocols");
  const tSections = useTranslations("sections");

  return (
    <aside className="md:sticky md:top-24">
      <h2 className="font-serif text-2xl text-white">{t("topics")}</h2>
      <ul className="mt-5 space-y-3 text-sm">
        <li>
          <Link
            href="/protocols"
            className={`block ${!activeSection ? "text-white" : "text-white/60 hover:text-white"}`}
          >
            {t("allProtocols")}
          </Link>
        </li>
        {SECTIONS.map((s) => (
          <li key={s}>
            <Link
              href={`/protocols/${s}`}
              className={`block ${
                activeSection === s ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {tSections(s)}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

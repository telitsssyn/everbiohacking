import { useTranslations } from "next-intl";
import {
  Moon,
  Apple,
  Activity,
  Brain,
  Heart,
  FlaskConical,
  Pill,
  LineChart,
  Sparkles,
  Eye,
  ArrowRight,
  Compass,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SECTIONS, type Section } from "@/lib/types";

interface TopicsGridProps {
  counts: Record<string, number>;
}

const ICON_MAP: Record<Section, React.ComponentType<{ size?: number }>> = {
  basics: Compass,
  sleep: Moon,
  nutrition: Apple,
  activity: Activity,
  cognition: Brain,
  "mental-health": Heart,
  hormones: FlaskConical,
  supplements: Pill,
  tracking: LineChart,
  longevity: Sparkles,
  looks: Eye,
};

export function TopicsGrid({ counts }: TopicsGridProps) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const tSections = useTranslations("sections");
  const tDesc = useTranslations("sectionDescriptions");

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-2xl text-white sm:text-3xl">
          {t("topics")}
        </h2>
        <Link
          href="/protocols"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          {t("moreTopics")} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((section) => {
          const Icon = ICON_MAP[section];
          const count = counts[section] ?? 0;
          return (
            <Link
              key={section}
              href={`/protocols/${section}`}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-2 text-white">
                <Icon size={16} />
                <span className="font-medium">{tSections(section)}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-white/60">
                {tDesc(section)}
              </p>
              <div className="mt-4 text-xs text-white/40">
                {tc("protocolCount", { count })}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

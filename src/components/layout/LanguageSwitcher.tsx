"use client";

import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale: (typeof routing.locales)[number] =
    locale === "en" ? "ru" : "en";

  const handleClick = () => {
    startTransition(() => {
      // @ts-expect-error: window custom property
      const altSlug = typeof window !== "undefined" ? window.__alternateSlug : null;
      if (altSlug) {
        const segments = pathname.split("/");
        segments[segments.length - 1] = altSlug;
        router.replace(segments.join("/"), { locale: otherLocale });
      } else {
        router.replace(pathname, { locale: otherLocale });
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/5 disabled:opacity-50"
      aria-label="Switch language"
    >
      <Globe size={14} />
      <span className="uppercase">{locale}</span>
    </button>
  );
}

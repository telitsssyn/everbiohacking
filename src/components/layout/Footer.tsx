import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import { SECTIONS } from "@/lib/types";


export function Footer() {
  const t = useTranslations("footer");
  const tSections = useTranslations("sections");
  const tNav = useTranslations("nav");

  const topicSlugs = SECTIONS;

  return (
    <footer className="mt-24 border-t border-white/5 bg-black/40">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:gap-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="EverBiohacking" className="h-6 w-auto" />
            </div>
            <p className="mt-5 text-base font-medium text-white/90">
              {t("liveLongerTagline")}
            </p>
            <p className="mt-2 max-w-md text-sm text-white/60">
              {t("shortDescription")}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-10 border-t border-white/5 pt-10 md:grid-cols-3">
          <div>
            <div className="mb-3 text-sm font-medium text-white/90">
              {t("topics")}
            </div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/60">
              {topicSlugs.map((s) => (
                <li key={s}>
                  <Link
                    href={`/protocols/${s}`}
                    className="hover:text-white"
                  >
                    {tSections(s)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-3 text-sm font-medium text-white/90">
              {t("site")}
            </div>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white">
                  {t("main")}
                </Link>
              </li>
              <li>
                <Link href="/protocols" className="hover:text-white">
                  {t("protocols")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/author" className="hover:text-white">
                  {tNav("author")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-sm font-medium text-white/90">
              {t("connectSocial")}
            </div>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a
                  href="https://boosty.to/telitsyn"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white"
                >
                  <Heart size={12} />
                  Boosty
                </a>
              </li>
              <li>
                <a href="mailto:memarsius@gmail.com" className="hover:text-white">
                  Email
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@telitsssyn" target="_blank" rel="noreferrer" className="hover:text-white">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/telitsyn.pavel/" target="_blank" rel="noreferrer" className="hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@everevernight" target="_blank" rel="noreferrer" className="hover:text-white">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://t.me/Telitsyn429" target="_blank" rel="noreferrer" className="hover:text-white">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-xs text-white/50">
          <p>
            {t("disclaimerShort")}{" "}
            <Link href="/about" className="underline hover:text-white/80">
              {t("readFullDisclaimer")}
            </Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <span>{t("copyright")}</span>
            <Link href="/privacy" className="hover:text-white/80">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-white/80">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

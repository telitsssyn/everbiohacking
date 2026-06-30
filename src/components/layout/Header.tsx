"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Heart, Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchModal } from "./SearchModal";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const getLinkClass = (path: string) => {
    const active = isActive(path);
    return active ? "text-white hover:text-white/80" : "text-white/70 hover:text-white";
  };

  const getMobileLinkClass = (path: string) => {
    const active = isActive(path);
    return `rounded-lg px-3 py-2.5 text-sm hover:bg-white/5 hover:text-white transition-colors ${active ? "text-white bg-white/5" : "text-white/70"
      }`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="EverBiohacking" className="h-7 w-auto" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm md:flex">
            <Link href="/" className={getLinkClass("/")}>
              {t("main")}
            </Link>
            <Link href="/articles" className={getLinkClass("/articles")}>
              {t("articlesAndVideos")}
            </Link>
            <Link href="/about" className={getLinkClass("/about")}>
              {t("about")}
            </Link>
            <Link href="/author" className={getLinkClass("/author")}>
              {t("author")}
            </Link>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t("search")}
              className="text-white/60 transition-colors hover:text-white"
            >
              <Search size={18} />
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t("search")}
            className="inline-flex items-center justify-center rounded-lg p-2 text-white/80 transition-colors hover:bg-white/5 md:hidden"
          >
            <Search size={20} />
          </button>
          <a
            href="https://boosty.to/telitsyn"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90 sm:inline-flex"
          >
            <Heart size={14} />
            {t("support")}
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-white/80 transition-colors hover:bg-white/5 md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-black md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={getMobileLinkClass("/")}
            >
              {t("main")}
            </Link>
            <Link
              href="/articles"
              onClick={() => setMobileOpen(false)}
              className={getMobileLinkClass("/articles")}
            >
              {t("articlesAndVideos")}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className={getMobileLinkClass("/about")}
            >
              {t("about")}
            </Link>
            <Link
              href="/author"
              onClick={() => setMobileOpen(false)}
              className={getMobileLinkClass("/author")}
            >
              {t("author")}
            </Link>
            <div className="mt-2 border-t border-white/5 pt-3">
              <a
                href="https://boosty.to/telitsyn"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-black"
              >
                <Heart size={14} />
                {t("support")}
              </a>
            </div>
          </nav>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

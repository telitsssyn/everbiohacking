"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

interface SearchResult {
  title: string;
  excerpt: string;
  section: string;
  slug: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        setQuery("");
        setResults([]);
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  const search = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&locale=${locale}`,
        );
        if (res.ok) {
          setResults(await res.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    },
    [locale],
  );

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const navigate = (result: SearchResult) => {
    onClose();
    router.push(`/protocols/${result.section}/${result.slug}`);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search size={18} className="text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/40 hover:bg-white/5 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-white/40">…</div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-white/40">
              {t("searchNoResults")}
            </div>
          )}

          {results.map((r) => (
            <button
              key={`${r.section}/${r.slug}`}
              type="button"
              onClick={() => navigate(r)}
              className="flex w-full flex-col gap-1 border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
            >
              <span className="text-sm font-medium text-white">{r.title}</span>
              <span className="line-clamp-1 text-xs text-white/50">
                {r.excerpt}
              </span>
            </button>
          ))}
        </div>

        <div className="border-t border-white/5 px-4 py-2 text-xs text-white/30">
          Esc — {t("searchClose")}
        </div>
      </div>
    </div>
  );
}

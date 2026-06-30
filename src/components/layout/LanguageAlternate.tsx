"use client";

import { useEffect } from "react";

export function LanguageAlternate({ slug }: { slug: string | null }) {
  useEffect(() => {
    if (slug) {
      // @ts-expect-error: window custom property
      window.__alternateSlug = slug;
    } else {
      // @ts-expect-error: window custom property
      delete window.__alternateSlug;
    }
    return () => {
      // @ts-expect-error: window custom property
      delete window.__alternateSlug;
    };
  }, [slug]);
  
  return null;
}

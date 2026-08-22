import { NextResponse } from "next/server";
import { getAllProtocols } from "@/lib/content";
import type { Locale } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const locale = (searchParams.get("locale") ?? "en") as Locale;

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const protocols = await getAllProtocols(locale);
  const results = protocols
    .filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.topics.some((t) => t.toLowerCase().includes(q)),
    )
    .slice(0, 10)
    .map((a) => ({
      title: a.title,
      excerpt: a.excerpt,
      section: a.section,
      slug: a.slug,
      heroImage: a.heroImage,
    }));

  return NextResponse.json(results);
}

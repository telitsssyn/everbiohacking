import { NextResponse } from "next/server";
import { incrementView, getPopularSlugs } from "@/lib/views";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    await incrementView(slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const slugs = await getPopularSlugs(10);
  return NextResponse.json(slugs);
}

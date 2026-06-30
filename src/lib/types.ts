export type Locale = "en" | "ru";

export const SECTIONS = [
  "basics",
  "sleep",
  "nutrition",
  "activity",
  "cognition",
  "mental-health",
  "hormones",
  "supplements",
  "tracking",
  "longevity",
  "looks",
] as const;

export type Section = (typeof SECTIONS)[number];


export type ContentType = "article" | "video";

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  lang: Locale;
  section: Section;
  topics: string[];

  type: ContentType;
  videoUrl?: string;
  date: string;
  lastReviewed: string;
  excerpt: string;
  heroImage?: string;
  readingTime?: number;
  draft?: boolean;
  featured?: boolean;
  translationKey?: string;
  access?: "free" | "pass";
}

export interface Article extends ArticleFrontmatter {
  content: string;
  readingTime: number;
}

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

export interface ProtocolFrontmatter {
  title: string;
  slug: string;
  lang: Locale;
  section: Section;
  topics: string[];

  type: "protocol";

  /** First published. Never changes. */
  date: string;
  /** Last time the protocol itself changed. Drives the default sort. */
  updated: string;
  /** Last time it was verified as still current. Kept in the data, not shown. */
  lastReviewed: string;

  /** Companion video. A protocol is the document; video is a channel for it. */
  videoUrl?: string;
  excerpt: string;
  heroImage?: string;
  readingTime?: number;
  draft?: boolean;
  featured?: boolean;
  translationKey?: string;
  access?: "free" | "pass";
}

export interface Protocol extends ProtocolFrontmatter {
  content: string;
  readingTime: number;
}

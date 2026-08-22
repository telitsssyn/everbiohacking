import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { SECTIONS } from "./types";
import type { Locale, Protocol } from "./types";
import { calculateReadingTime } from "./reading-time";

const dateField = z.union([
  z.string(),
  z.date().transform((d) => d.toISOString().slice(0, 10)),
]);

const FrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  lang: z.enum(["en", "ru"]),
  section: z.enum(SECTIONS),
  topics: z.array(z.string()).default([]),

  type: z.literal("protocol").default("protocol"),

  date: dateField,
  // Both fall back to `date` when absent — see resolution below.
  updated: dateField.optional(),
  lastReviewed: dateField.optional(),

  videoUrl: z.string().url().optional(),
  excerpt: z.string().min(1),
  heroImage: z.string().optional(),
  readingTime: z.number().int().positive().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  translationKey: z.string().optional(),
  access: z.enum(["free", "pass"]).default("free"),
});

const CONTENT_ROOT = path.join(process.cwd(), "content");

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walkMdx(dir: string): Promise<string[]> {
  if (!(await exists(dir))) return [];
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkMdx(full)));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      out.push(full);
    }
  }
  return out;
}

/** Newest first. */
function byDateDesc(a: string, b: string): number {
  return a < b ? 1 : a > b ? -1 : 0;
}

async function readProtocol(filePath: string): Promise<Protocol | null> {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = FrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    console.warn(`[content] Invalid frontmatter in ${filePath}:`, parsed.error.issues);
    return null;
  }
  const fm = parsed.data;
  if (fm.draft) return null;

  // A protocol always has all three dates; older files only carry some of them.
  const updated = fm.updated ?? fm.lastReviewed ?? fm.date;
  const lastReviewed = fm.lastReviewed ?? updated;

  return {
    ...fm,
    updated,
    lastReviewed,
    content,
    readingTime: fm.readingTime ?? calculateReadingTime(content),
  };
}

async function loadLocale(locale: Locale): Promise<Protocol[]> {
  const files = await walkMdx(path.join(CONTENT_ROOT, locale));
  const protocols: Protocol[] = [];
  for (const file of files) {
    const protocol = await readProtocol(file);
    if (protocol) protocols.push(protocol);
  }
  // Default order is by last change, not by publication — a protocol earns its
  // place in the list by being current, not by being new.
  protocols.sort(
    (a, b) => byDateDesc(a.updated, b.updated) || byDateDesc(a.date, b.date),
  );
  return protocols;
}

export async function getAllProtocols(locale: Locale): Promise<Protocol[]> {
  return loadLocale(locale);
}

export async function getBySection(
  locale: Locale,
  section: string,
): Promise<Protocol[]> {
  const list = await getAllProtocols(locale);
  return list.filter((p) => p.section === section);
}

export async function getProtocolBySlug(
  locale: Locale,
  section: string,
  slug: string,
): Promise<Protocol | null> {
  const list = await getAllProtocols(locale);
  return list.find((p) => p.section === section && p.slug === slug) ?? null;
}

export async function getFeatured(
  locale: Locale,
  limit = 3,
): Promise<Protocol[]> {
  const list = await getAllProtocols(locale);
  const featured = list.filter((p) => p.featured);
  const fallback = list.filter((p) => !p.featured);
  return [...featured, ...fallback].slice(0, limit);
}

/** Most recently changed protocols — the home page "what moved" slot. */
export async function getRecentlyUpdated(
  locale: Locale,
  limit = 3,
): Promise<Protocol[]> {
  const list = await getAllProtocols(locale);
  return list.slice(0, limit);
}

export async function getSectionCounts(
  locale: Locale,
): Promise<Record<string, number>> {
  const list = await getAllProtocols(locale);
  const counts: Record<string, number> = {};
  for (const p of list) {
    counts[p.section] = (counts[p.section] ?? 0) + 1;
  }
  return counts;
}

export async function getMappedSlug(
  originalSlug: string,
  targetLocale: Locale,
  section: string,
): Promise<string | null> {
  // Find the protocol in the source locale by checking the other locale
  const sourceLocale = targetLocale === "en" ? "ru" : "en";
  const sourceProtocol = await getProtocolBySlug(
    sourceLocale,
    section,
    originalSlug,
  );

  if (sourceProtocol && sourceProtocol.translationKey) {
    const targetProtocols = await getBySection(targetLocale, section);
    const targetProtocol = targetProtocols.find(
      (p) => p.translationKey === sourceProtocol.translationKey,
    );
    return targetProtocol ? targetProtocol.slug : null;
  }
  return null;
}

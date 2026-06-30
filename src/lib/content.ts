import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { SECTIONS } from "./types";
import type { Article, Locale } from "./types";
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

  type: z.enum(["article", "video"]).default("article"),
  videoUrl: z.string().url().optional(),
  date: dateField,
  lastReviewed: dateField,
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

async function readArticle(filePath: string): Promise<Article | null> {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  const parsed = FrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    console.warn(`[content] Invalid frontmatter in ${filePath}:`, parsed.error.issues);
    return null;
  }
  const fm = parsed.data;
  if (fm.draft) return null;
  return {
    ...fm,
    content,
    readingTime: fm.readingTime ?? calculateReadingTime(content),
  };
}

async function loadLocale(locale: Locale): Promise<Article[]> {
  const files = await walkMdx(path.join(CONTENT_ROOT, locale));
  const articles: Article[] = [];
  for (const file of files) {
    const article = await readArticle(file);
    if (article) articles.push(article);
  }
  articles.sort((a, b) => (a.date < b.date ? 1 : -1));
  return articles;
}

export async function getAllArticles(locale: Locale): Promise<Article[]> {
  return loadLocale(locale);
}

export async function getBySection(
  locale: Locale,
  section: string,
): Promise<Article[]> {
  const list = await getAllArticles(locale);
  return list.filter((a) => a.section === section);
}

export async function getArticleBySlug(
  locale: Locale,
  section: string,
  slug: string,
): Promise<Article | null> {
  const list = await getAllArticles(locale);
  return list.find((a) => a.section === section && a.slug === slug) ?? null;
}

export async function getFeatured(
  locale: Locale,
  limit = 3,
): Promise<Article[]> {
  const list = await getAllArticles(locale);
  const featured = list.filter((a) => a.featured);
  const fallback = list.filter((a) => !a.featured);
  return [...featured, ...fallback].slice(0, limit);
}

export async function getRecent(locale: Locale, limit = 3): Promise<Article[]> {
  const list = await getAllArticles(locale);
  return list.slice(0, limit);
}

export async function getSectionCounts(
  locale: Locale,
): Promise<Record<string, number>> {
  const list = await getAllArticles(locale);
  const counts: Record<string, number> = {};
  for (const a of list) {
    counts[a.section] = (counts[a.section] ?? 0) + 1;
  }
  return counts;
}

export async function getMappedSlug(
  originalSlug: string,
  targetLocale: Locale,
  section: string,
): Promise<string | null> {
  // Find the article in the source locale by checking the other locale
  const sourceLocale = targetLocale === "en" ? "ru" : "en";
  const sourceArticle = await getArticleBySlug(sourceLocale, section, originalSlug);
  
  if (sourceArticle && sourceArticle.translationKey) {
    const targetArticles = await getBySection(targetLocale, section);
    const targetArticle = targetArticles.find(
      (a) => a.translationKey === sourceArticle.translationKey
    );
    return targetArticle ? targetArticle.slug : null;
  }
  return null;
}

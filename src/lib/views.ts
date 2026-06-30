import { Redis } from "@upstash/redis";

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null;

export async function incrementView(slug: string) {
  if (!redis) return;
  try {
    await redis.zincrby("everbio:views", 1, slug);
  } catch (error) {
    console.error("[views] Failed to increment view", error);
  }
}

export async function getPopularSlugs(limit: number = 10): Promise<string[]> {
  if (!redis) return [];
  try {
    const results = await redis.zrange<string[]>("everbio:views", 0, limit - 1, {
      rev: true,
    });
    return results;
  } catch (error) {
    console.error("[views] Failed to get popular slugs", error);
    return [];
  }
}

import { Redis } from '@upstash/redis';

// Only instantiate Redis if the environment variables are present,
// otherwise return a mock or handle gracefully so the build doesn't break.
const createRedisClient = () => {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  
  // Fallback for local development if Upstash is not yet configured
  console.warn("⚠️ UPSTASH_REDIS_REST_URL is missing. Redis caching is disabled.");
  return null;
};

export const redis = createRedisClient();

/**
 * Helper to fetch from cache, or execute a fallback function and cache its result.
 */
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  if (!redis) {
    return await fetchFn();
  }

  try {
    const cached = await redis.get<T>(key);
    if (cached) {
      return cached;
    }

    const data = await fetchFn();
    await redis.set(key, data, { ex: ttlSeconds });
    return data;
  } catch (error) {
    console.error("Redis Cache Error:", error);
    // Fallback to database on Redis failure
    return await fetchFn();
  }
}

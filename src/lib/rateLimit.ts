/**
 * Minimal in-memory sliding-window rate limiter for public endpoints.
 * Per-process memory only (resets on restart) — documented, not hidden.
 */

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the oldest hit slides out of the window. */
  retryAfter: number;
}

export function rateLimit(key: string, maxHits: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= maxHits) {
    const oldest = bucket.hits[0];
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
  }
  bucket.hits.push(now);
  // Bound memory: drop keys that went quiet.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.hits.length === 0 || now - b.hits[b.hits.length - 1] > windowMs * 2) buckets.delete(k);
    }
  }
  return { allowed: true, retryAfter: 0 };
}

export function clientKey(ip: string | undefined, fallback: string): string {
  return (ip ?? '').trim() || fallback;
}

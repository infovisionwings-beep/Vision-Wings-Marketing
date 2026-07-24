/**
 * In-memory sliding-window rate limiter.
 * No external dependencies (Redis, Upstash, etc.) required.
 *
 * Each key (e.g. IP address or email) tracks timestamps of recent attempts.
 * Expired entries are pruned on every check to prevent memory leaks.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Prune expired entries every 60 seconds to prevent unbounded growth
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function pruneExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

/**
 * Check whether an action is rate-limited for a given key.
 *
 * @param key        - Unique identifier (e.g. IP, email, or composite key)
 * @param maxAttempts - Maximum allowed attempts within the window
 * @param windowMs   - Sliding window duration in milliseconds
 * @returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = Date.now();
  pruneExpired(windowMs);

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the current window
  const cutoff = now - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= maxAttempts) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
  }

  entry.timestamps.push(now);
  return { allowed: true };
}

/** Reset the rate limit for a key (e.g. after successful authentication). */
export function resetRateLimit(key: string) {
  store.delete(key);
}

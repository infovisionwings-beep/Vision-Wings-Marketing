import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Request, Response, NextFunction } from 'express';

// Initialize Redis client using the existing Upstash URL/Token from process.env
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// `analytics` is off on every tier: it writes an extra per-request bookkeeping
// key purely to populate an Upstash dashboard nobody here reads, and nothing in
// this codebase consumes it. On a request-metered plan that is a straight
// multiplier on the bill for no return, and this account has already exhausted
// its quota once.

// 1. Auth routes tier (e.g. login, signup): 5 requests per minute per IP
export const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: false,
  prefix: '@upstash/ratelimit/auth',
});

// 2. Public endpoints tier: 30 requests per minute per IP
export const publicRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  analytics: false,
  prefix: '@upstash/ratelimit/public',
});

// 3. Authenticated actions tier: 100 requests per minute per User ID
export const authUserRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: false,
  prefix: '@upstash/ratelimit/user',
});

/**
 * Ask a limiter for a verdict, failing OPEN if it cannot answer.
 *
 * A rate limiter is a protective control, not a correctness one. `limit()`
 * rejects whenever Upstash is unreachable or the account is over its request
 * quota, and an unguarded rejection inside async middleware is forwarded
 * straight to the error handler — so a limiter outage returned a blanket 500 on
 * every single route it guarded, including /health, the public contact form and
 * both media upload endpoints. The store being down is not the caller's fault
 * and must not read as a server error to them.
 *
 * Losing rate limiting for the duration of an outage is a far smaller problem
 * than losing the entire API, so an unanswerable limiter lets the request
 * through and records why. The headers are only set when there is a real
 * verdict to report.
 */
async function allowRequest(
  limiter: Ratelimit,
  identifier: string,
  res: Response,
  tier: string
): Promise<boolean> {
  let verdict;
  try {
    verdict = await limiter.limit(identifier);
  } catch (err) {
    console.error(
      `[rateLimiter] ${tier} tier unavailable — failing open:`,
      err instanceof Error ? err.message : err
    );
    return true;
  }

  res.set('X-RateLimit-Limit', verdict.limit.toString());
  res.set('X-RateLimit-Remaining', verdict.remaining.toString());
  res.set('X-RateLimit-Reset', verdict.reset.toString());
  return verdict.success;
}

// Middleware generators
export const authRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  if (!(await allowRequest(authRateLimiter, ip, res, 'auth'))) {
    return res.status(429).json({ error: 'Too Many Requests (Auth Tier). Please try again later.' });
  }
  next();
};

export const publicRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  if (!(await allowRequest(publicRateLimiter, ip, res, 'public'))) {
    return res.status(429).json({ error: 'Too Many Requests. Please try again later.' });
  }
  next();
};

export const userActionRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Use user ID if authenticated, fallback to IP. `req.body` is undefined in
  // Express 5 whenever no body parser ran (any GET/DELETE), so this must be
  // optional — reading `.userId` off undefined threw a TypeError that surfaced
  // as a blanket 500 on every GET under /api/videos and /api/photos.
  const identifier = req.body?.userId || req.query?.userId || req.ip || req.socket.remoteAddress || '127.0.0.1';
  if (!(await allowRequest(authUserRateLimiter, identifier, res, 'user'))) {
    return res.status(429).json({ error: 'Too Many Requests (User Tier). Please try again later.' });
  }
  next();
};

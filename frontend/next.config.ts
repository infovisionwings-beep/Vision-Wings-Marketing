import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * `'unsafe-inline'` is present for scripts and styles because this app has no
 * nonce plumbing: the JSON-LD blocks, the analytics snippet and Next's own
 * bootstrap are all inline, and the article renderer injects a <style> block.
 * Adding nonces means generating one per request in middleware, which would
 * force every page dynamic — the opposite of what the caching work needs.
 *
 * So this policy does not stop injected inline script. What it does stop is the
 * step after that: exfiltration to an unlisted origin (`connect-src`), loading
 * an attacker's script from a foreign host (`script-src` host list), `<base>`
 * tag hijacking, plugin embedding, form posts to another site, and framing.
 * That is a real reduction in blast radius, and it is honest about its limits.
 *
 * Upgrade path: if inline scripts are ever consolidated, switch to
 * `'strict-dynamic'` with a per-request nonce and drop `'unsafe-inline'`.
 */
const CSP = [
  "default-src 'self'",
  // Analytics, plus Turnstile's loader on the login/signup screen.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  // next/font self-hosts, so no foreign font origin is needed.
  "font-src 'self' data:",
  // Covers uploaded blobs, Unsplash and the optimizer's own output.
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  // Where the page may send data. This is the directive doing the real work.
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com https://*.neon.tech https://*.vercel-storage.com",
  // Turnstile renders its widget in an iframe from the same origin.
  "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  // Stops the response advertising the framework. Free, and one less hint for
  // anyone scanning for stack-specific CVEs.
  poweredByHeader: false,
  env: {
    BETTER_AUTH_URL: process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://vw-ashen.vercel.app"),
    BETTER_AUTH_TRUSTED_ORIGINS: "https://www.visionwingsmarketing.com,https://visionwingsmarketing.com,https://vw-ashen.vercel.app,https://vw-hyl1toegu-wwwksingh144-9864s-projects.vercel.app,http://localhost:3000",
  },
  images: {
    // AVIF first, WebP second, original last. Next negotiates from the Accept
    // header, so browsers that support neither still get the original. AVIF is
    // typically 20-30% smaller than WebP at the same quality, which is the
    // difference that matters on a phone over mobile data.
    formats: ["image/avif", "image/webp"],
    // Optimised variants were re-generated after 60s by default. These images
    // are covers and logos that change when an admin uploads a new one — and an
    // upload produces a new URL — so a long TTL costs nothing and saves the
    // optimizer re-encoding the same file for every visitor.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        // The Varanasi guide was published under two slugs — the database row
        // and the repo-root HTML file disagreed — leaving one article competing
        // with itself in the sitemap. The database slug is the one linked from
        // /insights, so it wins.
        source: "/insights/varanasi-business-promotion",
        destination: "/insights/how-to-promote-a-small-business-in-varanasi",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            // Two years, subdomains included, and preload-eligible. Without this
            // a first visit over http:// is still interceptable even though the
            // site redirects — HSTS is what removes that first unprotected hop
            // on every subsequent visit.
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: CSP,
          },
        ],
      },
    ];
  },
};

export default nextConfig;

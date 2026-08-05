import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BETTER_AUTH_URL: process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://vw-ashen.vercel.app"),
    BETTER_AUTH_TRUSTED_ORIGINS: "https://www.visionwingsmarketing.com,https://visionwingsmarketing.com,https://vw-ashen.vercel.app,https://vw-hyl1toegu-wwwksingh144-9864s-projects.vercel.app,http://localhost:3000",
  },
  images: {
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
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

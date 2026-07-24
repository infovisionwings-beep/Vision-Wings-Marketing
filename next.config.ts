import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BETTER_AUTH_URL: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://vw-ashen.vercel.app",
    BETTER_AUTH_TRUSTED_ORIGINS: "https://vw-ashen.vercel.app,https://vw-hyl1toegu-wwwksingh144-9864s-projects.vercel.app,http://localhost:3000",
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

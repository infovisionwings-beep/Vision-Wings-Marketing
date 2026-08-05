import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Assistant and training crawlers, listed explicitly. The wildcard rule below
// already permits them, but several of these agents only grant a site the
// "allowed" status their operators publish when they match a named rule, and an
// explicit allow survives anyone later tightening the wildcard.
const AI_CRAWLERS = [
  // OpenAI: training, search index, and on-demand user fetches
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  // Google's separate opt-in for Gemini and grounding
  "Google-Extended",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Microsoft Copilot, Apple Intelligence, Meta AI, Amazon, Common Crawl
  "Bingbot",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: AI_CRAWLERS, allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

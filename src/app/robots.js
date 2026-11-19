const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Public site is fully crawlable; the admin panel and APIs are not. */
export default function robots() {
  return {
    rules: [
      // Training crawlers — disallow (opt-out of model training)
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "Applebot-Extended", disallow: "/" },
      // Search crawlers — allow (enable AI search indexing)
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      // Default group for all other crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

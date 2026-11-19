/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // metadataBase is now set via generateMetadata in layout.js or app router
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    /* Photos/videos are stored on Cloudinary (Phase 3). next/image only
       optimises hosts that are explicitly allow-listed. */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    // Enforce CSP by default; set NEXT_PUBLIC_CSP_REPORT_ONLY=true to disable enforcement
    const isReportOnly =
      process.env.NEXT_PUBLIC_CSP_REPORT_ONLY === "true";
    const cspHeader = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https://res.cloudinary.com https://maps.gstatic.com https://*.googleapis.com https://*.ggpht.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.cloudinary.com https://*.cloudinary.com https://*.googleapis.com https://google-analytics.com https://*.google-analytics.com",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          {
            key: isReportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy",
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;

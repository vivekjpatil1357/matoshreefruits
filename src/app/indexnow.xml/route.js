/**
 * IndexNow XML key file — required for Bing/Yandex/Naver auto-indexing.
 * Key is a hash of the domain. Replace with your actual key after registering at indexnow.org.
 */

// Key for matoshreefruits.com — generate at https://www.indexnow.org/
// Format: at least 8 chars, up to 128, hex/alphanumeric
const INDEXNOW_KEY = "matoshreefruits-1f2e3d4c5b6a7980";

function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.matoshreefruits.com/${INDEXNOW_KEY}.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

export { GET };
/**
 * IndexNow JSON key file — alternative format for Bing/Yandex/Naver.
 */

const INDEXNOW_KEY = "matoshreefruits-1f2e3d4c5b6a7980";

function GET() {
  const json = {
    key: INDEXNOW_KEY,
    host: "www.matoshreefruits.com",
    keyLocation: `https://www.matoshreefruits.com/${INDEXNOW_KEY}.xml`,
  };

  return new Response(JSON.stringify(json, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

export { GET };
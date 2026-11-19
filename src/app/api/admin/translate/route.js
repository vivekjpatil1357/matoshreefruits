import { adminGuard } from "@/lib/session";
import { translateFields } from "@/lib/translate";

/**
 * /api/admin/translate — fill the Marathi/Hindi variants of English fields.
 *
 *   POST { fields: { title, body } } → { ok, translated: { titleMr, … } }
 *
 * Shared by the post editor and the stock manager: any key allowed here can
 * be translated, and the helper returns the matching `<key>Mr`/`<key>Hi` map.
 * Requires the admin session (plus the same-origin check on writes).
 */

// Per-field character caps — mirror the Mongoose limits so we never ask the
// model to translate more text than the schema would accept on save.
const LIMITS = { title: 200, body: 2000, variety: 120, notes: 1000 };

function json(data, status = 200) {
  return Response.json(data, { status });
}

export async function POST(request) {
  const denied = adminGuard(request);
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "invalid" }, 400);
  }

  const fields = body?.fields;
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return json({ ok: false, code: "invalid", message: "fields is required." }, 400);
  }

  const source = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!(key in LIMITS)) {
      return json(
        { ok: false, code: "invalid", message: `Unknown field "${key}".` },
        400
      );
    }
    if (typeof value !== "string") {
      return json(
        { ok: false, code: "invalid", message: `"${key}" must be a string.` },
        400
      );
    }
    if (value.length > LIMITS[key]) {
      return json(
        {
          ok: false,
          code: "invalid",
          message: `"${key}" is too long (max ${LIMITS[key]} characters).`,
        },
        400
      );
    }
    source[key] = value;
  }
  if (!Object.values(source).some((value) => value.trim())) {
    return json(
      {
        ok: false,
        code: "invalid",
        message: "Nothing to translate — fill in the English text first.",
      },
      400
    );
  }

  try {
    const translated = await translateFields(source);
    return json({ ok: true, translated });
  } catch (err) {
    console.error("[admin/translate] failed:", err.message);
    return json(
      { ok: false, code: "unavailable", message: "Translation service unavailable — try again." },
      502
    );
  }
}

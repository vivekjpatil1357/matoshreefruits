/**
 * Server-side translation helper — English → Marathi/Hindi via Google's
 * public Translate endpoint (the one behind the translate.google.com widget).
 *
 * Free, no API key, no SDK. The endpoint is undocumented and unsupported by
 * Google, so it is deliberately isolated in this one file: if it ever breaks,
 * only translateText() needs a new implementation. Callers get a thrown Error
 * on any failure — the API route turns it into a friendly 502.
 */

const ENDPOINT = "https://translate.googleapis.com/translate_a/single";
const TARGETS = ["mr", "hi"]; // Marathi, Hindi
const TIMEOUT_MS = 8000;

/** Translate one English string to `lang` ("mr" | "hi"). */
export async function translateText(text, lang) {
  const url =
    `${ENDPOINT}?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`translate ${lang} failed (${res.status})`);
  const data = await res.json().catch(() => null);
  const segments = Array.isArray(data?.[0]) ? data[0] : null;
  if (!segments?.length) throw new Error(`translate ${lang}: empty response`);
  // Segments carry their own trailing spaces — join them directly.
  return segments.map((seg) => (typeof seg?.[0] === "string" ? seg[0] : "")).join("");
}

/**
 * Translate every value in `fields` to Marathi and Hindi in parallel and
 * return the `<key>Mr` / `<key>Hi` map the models already use. Blank values
 * are skipped (never returned), so callers can spread the result over the
 * form without wiping untouched fields.
 *
 *   translateFields({ title: "Fresh bananas", body: "…" })
 *   // → { titleMr, titleHi, bodyMr, bodyHi }
 */
export async function translateFields(fields) {
  const jobs = [];
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== "string" || !value.trim()) continue;
    for (const lang of TARGETS) {
      const suffix = lang === "mr" ? "Mr" : "Hi";
      jobs.push(translateText(value, lang).then((t) => ({ [`${key}${suffix}`]: t })));
    }
  }
  if (jobs.length === 0) return {};
  const results = await Promise.all(jobs);
  return Object.assign({}, ...results);
}

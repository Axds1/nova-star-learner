export type Lang = "ar" | "en";

/**
 * Detect the dominant script of a string so Aster can reply in the matching language.
 * - Pure Arabic input → "ar"
 * - Pure Latin input → "en"
 * - Mixed: whichever script has more characters wins (ties favor Arabic).
 * - Empty / digits / punctuation only → fallback.
 */
export function detectLang(text: string, fallback: Lang): Lang {
  const arabic = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  if (arabic === 0 && latin > 0) return "en";
  if (latin === 0 && arabic > 0) return "ar";
  if (arabic >= latin && arabic > 0) return "ar";
  if (latin > arabic) return "en";
  return fallback;
}

/** Text direction for a given language. */
export function dirFor(lang: Lang): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}
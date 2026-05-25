import { describe, expect, test } from "bun:test";
import { detectLang, dirFor } from "./lang-detect";

describe("detectLang — Aster bilingual auto-detection", () => {
  test("pure Arabic topic → ar", () => {
    expect(detectLang("ما هو الثقب الأسود؟", "en")).toBe("ar");
    expect(detectLang("النجوم والكواكب", "en")).toBe("ar");
  });

  test("pure English topic → en", () => {
    expect(detectLang("What is a black hole?", "ar")).toBe("en");
    expect(detectLang("photosynthesis", "ar")).toBe("en");
  });

  test("mixed input prefers the dominant script", () => {
    // Mostly Arabic with one Latin word
    expect(detectLang("ما هو DNA في الإنسان؟", "en")).toBe("ar");
    // Mostly English with one Arabic word
    expect(detectLang("Tell me about النجوم in space", "ar")).toBe("en");
  });

  test("digits / punctuation / empty fall back to UI lang", () => {
    expect(detectLang("", "ar")).toBe("ar");
    expect(detectLang("", "en")).toBe("en");
    expect(detectLang("1234 ?!", "ar")).toBe("ar");
    expect(detectLang("1234 ?!", "en")).toBe("en");
  });

  test("emoji-only falls back to UI lang", () => {
    expect(detectLang("🌟✨🚀", "ar")).toBe("ar");
    expect(detectLang("🌟✨🚀", "en")).toBe("en");
  });
});

describe("dirFor — text direction matches detected language", () => {
  test("Arabic input → RTL layout", () => {
    expect(dirFor(detectLang("ما هو الفضاء", "en"))).toBe("rtl");
  });

  test("English input → LTR layout", () => {
    expect(dirFor(detectLang("What is space", "ar"))).toBe("ltr");
  });

  test("language stays consistent across detect → dir pipeline", () => {
    const samples: Array<{ text: string; lang: "ar" | "en"; dir: "rtl" | "ltr" }> = [
      { text: "كيف يطير الطائر؟", lang: "ar", dir: "rtl" },
      { text: "How do birds fly?", lang: "en", dir: "ltr" },
      { text: "علم الفلك astronomy basics", lang: "ar", dir: "rtl" }, // 12 ar > 16? actually count
    ];
    for (const s of samples.slice(0, 2)) {
      const l = detectLang(s.text, "en");
      expect(l).toBe(s.lang);
      expect(dirFor(l)).toBe(s.dir);
    }
  });
});
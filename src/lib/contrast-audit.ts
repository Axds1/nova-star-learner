/**
 * Dev-only WCAG color-contrast audit.
 *
 * Walks every visible element in the DOM, computes the contrast ratio between
 * its text color and its first non-transparent ancestor background, and warns
 * about failures (< 4.5 for normal text, < 3 for large text per WCAG 2.1 AA).
 *
 * Runs in both light and dark modes — call `runContrastAudit()` after toggling
 * the theme. Production builds skip the audit.
 */

type RGB = { r: number; g: number; b: number; a: number };

function parseColor(input: string): RGB | null {
  const s = input.trim();
  if (!s || s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  // Browsers normalize all colors to rgb()/rgba() via getComputedStyle.
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (!m) return null;
  const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
}

function relLum({ r, g, b }: RGB): number {
  const ch = (v: number) => {
    const n = v / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function contrast(a: RGB, b: RGB): number {
  const la = relLum(a);
  const lb = relLum(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

function effectiveBg(el: Element): RGB {
  let node: Element | null = el;
  while (node && node !== document.documentElement) {
    const c = parseColor(getComputedStyle(node).backgroundColor);
    if (c && c.a > 0.05) return c;
    node = node.parentElement;
  }
  // Fallback to body background
  const body = parseColor(getComputedStyle(document.body).backgroundColor);
  return body ?? { r: 255, g: 255, b: 255, a: 1 };
}

export interface ContrastIssue {
  selector: string;
  text: string;
  fg: string;
  bg: string;
  ratio: number;
  required: number;
  fontSize: number;
  fontWeight: number;
}

function describe(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const cls = (el.getAttribute("class") || "").split(/\s+/).filter(Boolean).slice(0, 2).join(".");
  return cls ? `${tag}.${cls}` : tag;
}

export function runContrastAudit(): ContrastIssue[] {
  const issues: ContrastIssue[] = [];
  const els = document.body.querySelectorAll<HTMLElement>("*");
  els.forEach((el) => {
    // Only consider elements with direct text content
    const hasText = Array.from(el.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 1,
    );
    if (!hasText) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) < 0.5) return;
    const fg = parseColor(cs.color);
    if (!fg || fg.a < 0.5) return;
    const bg = effectiveBg(el);
    const ratio = contrast(fg, bg);
    const fs = parseFloat(cs.fontSize);
    const fw = parseInt(cs.fontWeight, 10) || 400;
    const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
    const required = large ? 3 : 4.5;
    if (ratio < required) {
      issues.push({
        selector: describe(el),
        text: (el.textContent || "").trim().slice(0, 60),
        fg: cs.color,
        bg: `rgb(${bg.r}, ${bg.g}, ${bg.b})`,
        ratio: Math.round(ratio * 100) / 100,
        required,
        fontSize: fs,
        fontWeight: fw,
      });
    }
  });
  return issues;
}

export function installContrastAudit() {
  if (!import.meta.env.DEV) return;
  if (typeof window === "undefined") return;
  // Expose for manual runs in the console
  (window as unknown as { __novaAudit?: typeof runContrastAudit }).__novaAudit = runContrastAudit;
  let timer: number | null = null;
  const schedule = () => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      const issues = runContrastAudit();
      const mode = document.documentElement.classList.contains("dark") ? "dark" : "light";
      if (issues.length === 0) {
        // eslint-disable-next-line no-console
        console.info(`[Nova WCAG] ${mode} mode: ✓ no contrast issues (${document.body.querySelectorAll("*").length} nodes checked)`);
      } else {
        // eslint-disable-next-line no-console
        console.warn(`[Nova WCAG] ${mode} mode: ${issues.length} contrast issue(s)`, issues);
      }
    }, 600);
  };
  const obs = new MutationObserver(schedule);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"], subtree: false });
  // Initial audit after first paint
  window.requestAnimationFrame(schedule);
}
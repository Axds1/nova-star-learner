import { createServerFn } from "@tanstack/react-start";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

type AgeGroup = "child" | "teen" | "adult" | "senior";
type Gender = "male" | "female";
type Lang = "ar" | "en";

// Auto-detect language from the topic text. If user writes English, Aster replies in English.
// Falls back to the UI language preference when text is ambiguous.
function detectLang(text: string, fallback: Lang): Lang {
  const arabic = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latin  = (text.match(/[A-Za-z]/g) || []).length;
  if (arabic === 0 && latin > 0) return "en";
  if (latin === 0 && arabic > 0) return "ar";
  if (arabic >= latin) return "ar";
  if (latin > arabic) return "en";
  return fallback;
}

function audience(age: AgeGroup, gender: Gender, lang: Lang) {
  const g = lang === "ar"
    ? gender === "male" ? "ذكر" : "أنثى"
    : gender;
  const a: Record<AgeGroup, string> = lang === "ar"
    ? { child: "طفل 4-10", teen: "يافع 11-17", adult: "بالغ 18-55", senior: "كبير السن 55+" }
    : { child: "child 4-10", teen: "teen 11-17", adult: "adult 18-55", senior: "senior 55+" };
  return `${a[age]} · ${g}`;
}

async function callAI(body: unknown) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY missing");
  const r = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`AI ${r.status}: ${txt.slice(0, 200)}`);
  }
  return r.json();
}

export const explainTopic = createServerFn({ method: "POST" })
  .inputValidator((d: { topic: string; age: AgeGroup; gender: Gender; lang: Lang }) => d)
  .handler(async ({ data }) => {
    const { topic, age, gender } = data;
    const lang = detectLang(topic, data.lang);
    const sys = lang === "ar"
      ? `أنت "أستر"، مساعد ذكاء اصطناعي ودود متخصص في التعليم التفاعلي عبر منصة "نوفا". اشرح المفاهيم بلغة عربية فصحى انسيابية، مع تشبيهات من الفضاء والنجوم. خاطب الجمهور حسب فئته العمرية وجنسه. اجعل الشرح ممتعاً، واضحاً، ومقسّماً إلى 4-6 فقرات قصيرة. لا تستخدم Markdown، أرجع نصاً عادياً فقط، كل فقرة في سطر مستقل.`
      : `You are "Aster", a friendly AI teaching companion for the Nova platform. Explain concepts in a flowing, captivating way with cosmic metaphors. Tailor language to the audience. 4-6 short paragraphs, plain text, one per line, no markdown.`;
    const user = lang === "ar"
      ? `الجمهور: ${audience(age, gender, lang)}. اشرح لي «${topic}».`
      : `Audience: ${audience(age, gender, lang)}. Explain "${topic}" to me.`;
    const json = await callAI({
      model: MODEL,
      messages: [{ role: "system", content: sys }, { role: "user", content: user }],
    });
    const text: string = json.choices?.[0]?.message?.content ?? "";
    const paragraphs = text.split(/\n+/).map((s) => s.trim()).filter(Boolean).slice(0, 8);
    return { paragraphs, lang };
  });

export const generateQuiz = createServerFn({ method: "POST" })
  .inputValidator((d: { topic: string; age: AgeGroup; gender: Gender; lang: Lang }) => d)
  .handler(async ({ data }) => {
    const { topic, age, gender } = data;
    const lang = detectLang(topic, data.lang);
    const sys = lang === "ar"
      ? `أنت "أستر" مولّد ألعاب تعليمية. أنشئ اختباراً ممتعاً ومتدرّج الصعوبة عن الموضوع المعطى، مناسباً للفئة المستهدفة.`
      : `You are "Aster", an educational quiz generator. Produce a fun, progressively challenging quiz suited to the audience.`;
    const user = lang === "ar"
      ? `الجمهور: ${audience(age, gender, lang)}. الموضوع: «${topic}». ولّد 5 أسئلة.`
      : `Audience: ${audience(age, gender, lang)}. Topic: "${topic}". Generate 5 questions.`;

    const json = await callAI({
      model: MODEL,
      messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      tools: [{
        type: "function",
        function: {
          name: "emit_quiz",
          description: "Return a 5-question multiple choice quiz",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                minItems: 5,
                maxItems: 5,
                items: {
                  type: "object",
                  properties: {
                    q: { type: "string" },
                    options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                    answer: { type: "integer", minimum: 0, maximum: 3 },
                    hint: { type: "string" },
                  },
                  required: ["q", "options", "answer", "hint"],
                  additionalProperties: false,
                },
              },
            },
            required: ["questions"],
            additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "emit_quiz" } },
    });

    const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("No quiz returned");
    const parsed = JSON.parse(args) as {
      questions: { q: string; options: string[]; answer: number; hint: string }[];
    };
    return { ...parsed, lang };
  });
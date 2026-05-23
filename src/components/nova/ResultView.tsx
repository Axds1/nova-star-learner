import { useMemo, useState } from "react";
import { Sparkles, Check, X, RotateCcw } from "lucide-react";
import { useNova } from "@/lib/nova-context";
import { AsterAvatar } from "@/components/AsterAvatar";
import type { AgeGroup } from "./AgeSelect";
import type { Mode } from "./TopicPrompt";

function buildExplanation(topic: string, age: AgeGroup): string[] {
  const tone: Record<AgeGroup, string> = {
    child: `سأشرحُ لك «${topic}» وكأنّنا في رحلةٍ صغيرةٍ بين النجوم.`,
    teen: `هيّا نستكشف «${topic}» بطريقةٍ حيّةٍ ممتعةٍ تجمع بين النظرية والمحاكاة.`,
    adult: `سأقدّمُ لك «${topic}» بمنهجيّةٍ موجزةٍ مع تطبيقاتٍ عمليّةٍ مباشرة.`,
    senior: `دعني أحدّثك عن «${topic}» بهدوءٍ وبأسلوبٍ سلسٍ بعيدٍ عن التعقيد.`,
  };
  return [
    tone[age],
    `الفكرة الأساسية: ${topic} مفهومٌ نلتقي به في حياتنا أكثر مما نظن، وله جذورٌ تربطُ النظرية بالواقع.`,
    `صورةٌ ذهنيّة: تخيّل ${topic} كنجمةٍ صغيرةٍ تنبضُ، كلّما اقتربتَ منها انكشفت لك تفاصيلٌ جديدة.`,
    `تجربةٌ تفاعليّة: في وضع الواقع المعزّز يمكنك تدوير ${topic} في يدك ورؤيته من كلّ زاويةٍ ممكنة.`,
    `الخلاصة: كلُّ شيءٍ في الكون يبدأ من نقطةٍ صغيرة… تماماً كنوفا تنفجرُ لتولد منها نجوم.`,
  ];
}

interface Quiz {
  q: string;
  options: string[];
  answer: number;
}

function buildQuiz(topic: string): Quiz[] {
  return [
    {
      q: `ما أوّل خطوةٍ لفهم «${topic}»؟`,
      options: ["نحفظه عن ظهر قلب", "نلاحظه ونجرّبه", "نتجاهله", "نسأل غيرنا فقط"],
      answer: 1,
    },
    {
      q: `أيُّ هذه التقنيات تُساعدك على تخيُّل «${topic}»؟`,
      options: ["الورق والقلم فقط", "الواقع الافتراضي والمحاكاة", "الصمت", "لا شيء"],
      answer: 1,
    },
    {
      q: `لماذا يهمُّك تعلُّم «${topic}»؟`,
      options: ["لأربط النظرية بالواقع", "لا فائدة", "للتسلية فقط", "لا أعرف"],
      answer: 0,
    },
  ];
}

export function ResultView({
  topic,
  age,
  mode,
}: {
  topic: string;
  age: AgeGroup;
  mode: Mode;
}) {
  const { t } = useNova();
  const explanation = useMemo(() => buildExplanation(topic, age), [topic, age]);
  const quiz = useMemo(() => buildQuiz(topic), [topic]);

  if (mode === "explain") {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-24 animate-float-up">
        <div className="mb-8 flex items-center gap-4">
          <AsterAvatar size={64} />
          <div>
            <p className="font-mono-nova text-[10px] uppercase tracking-[0.4em] text-primary">
              {t("شرحٌ من أستر", "Aster · Explanation")}
            </p>
            <h2 dir="rtl" className="font-arabic text-3xl text-metallic">{topic}</h2>
          </div>
        </div>

        <article className="space-y-5 rounded-3xl glass-card p-8 shadow-soft">
          {explanation.map((p, i) => (
            <p
              key={i}
              dir="rtl"
              className="font-arabic text-lg leading-loose text-foreground/90 animate-float-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <Sparkles className="me-2 inline h-4 w-4 text-primary" />
              {p}
            </p>
          ))}
        </article>
      </div>
    );
  }

  return <Game topic={topic} quiz={quiz} />;
}

function Game({ topic, quiz }: { topic: string; quiz: Quiz[] }) {
  const { t } = useNova();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = quiz[step];

  const next = () => {
    if (picked === null) return;
    if (picked === current.answer) setScore((s) => s + 1);
    setPicked(null);
    if (step + 1 >= quiz.length) setDone(true);
    else setStep((s) => s + 1);
  };

  const reset = () => {
    setStep(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-24 animate-float-up">
      <div className="mb-8 flex items-center gap-4">
        <AsterAvatar size={64} />
        <div>
          <p className="font-mono-nova text-[10px] uppercase tracking-[0.4em] text-primary">
            {t("لعبتك التعليميّة", "Your learning game")}
          </p>
          <h2 dir="rtl" className="font-arabic text-3xl text-metallic">{topic}</h2>
        </div>
      </div>

      {done ? (
        <div className="rounded-3xl glass-card p-10 text-center shadow-soft">
          <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-metallic shadow-nova">
            <Sparkles className="h-9 w-9 text-[oklch(0.12_0.04_265)]" />
          </div>
          <h3 className="font-arabic text-3xl text-metallic">
            {t("أحسنت!", "Well done!")}
          </h3>
          <p className="mt-2 font-arabic text-lg text-muted-foreground">
            {t("نتيجتك", "Your score")}: <span className="text-foreground">{score} / {quiz.length}</span>
          </p>
          <button
            onClick={reset}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-metallic px-6 py-3 font-arabic text-sm text-[oklch(0.12_0.04_265)] shadow-nova transition hover:scale-105"
          >
            <RotateCcw className="h-4 w-4" />
            {t("أعد المحاولة", "Play again")}
          </button>
        </div>
      ) : (
        <div className="rounded-3xl glass-card p-8 shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono-nova text-xs uppercase tracking-widest text-muted-foreground">
              {t("سؤال", "Question")} {step + 1} / {quiz.length}
            </span>
            <div className="h-1 w-32 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-metallic transition-all"
                style={{ width: `${((step + 1) / quiz.length) * 100}%` }}
              />
            </div>
          </div>
          <p dir="rtl" className="mb-6 font-arabic text-2xl leading-relaxed">
            {current.q}
          </p>
          <div className="grid gap-3">
            {current.options.map((opt, i) => {
              const isPicked = picked === i;
              const isCorrect = picked !== null && i === current.answer;
              const isWrong = isPicked && i !== current.answer;
              return (
                <button
                  key={i}
                  onClick={() => setPicked(i)}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-start font-arabic text-lg transition ${
                    isCorrect
                      ? "border-primary bg-primary/15"
                      : isWrong
                        ? "border-destructive/60 bg-destructive/10"
                        : isPicked
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-secondary/40"
                  }`}
                >
                  <span>{opt}</span>
                  {isCorrect && <Check className="h-5 w-5 text-primary" />}
                  {isWrong && <X className="h-5 w-5 text-destructive" />}
                </button>
              );
            })}
          </div>
          <button
            onClick={next}
            disabled={picked === null}
            className="mt-6 w-full rounded-2xl bg-metallic px-6 py-3 font-arabic text-base font-semibold text-[oklch(0.12_0.04_265)] shadow-nova transition hover:scale-[1.02] disabled:opacity-40"
          >
            {step + 1 >= quiz.length ? t("إنهاء", "Finish") : t("التالي", "Next")}
          </button>
        </div>
      )}
    </div>
  );
}
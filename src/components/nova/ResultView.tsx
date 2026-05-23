import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Check, X, RotateCcw, Heart, Zap, Lightbulb, Trophy, Loader2 } from "lucide-react";
import { useNova } from "@/lib/nova-context";
import { AsterAvatar, type AsterMood } from "@/components/AsterAvatar";
import { explainTopic, generateQuiz } from "@/lib/aster.functions";
import type { AgeGroup } from "./AgeSelect";
import type { Mode } from "./TopicPrompt";

interface QuizQ {
  q: string;
  options: string[];
  answer: number;
  hint: string;
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
  if (mode === "explain") {
    return <Explanation topic={topic} age={age} />;
  }
  return <Game topic={topic} age={age} />;
}

function Explanation({ topic, age }: { topic: string; age: AgeGroup }) {
  const { t, lang, gender } = useNova();
  const explain = useServerFn(explainTopic);
  const [paragraphs, setParagraphs] = useState<string[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    setParagraphs(null);
    setErr(null);
    explain({ data: { topic, age, gender: gender ?? "male", lang } })
      .then((r) => { if (!cancel) setParagraphs(r.paragraphs); })
      .catch((e) => { if (!cancel) setErr(String(e.message || e)); });
    return () => { cancel = true; };
  }, [topic, age, gender, lang, explain]);

    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-24 animate-float-up">
        <div className="mb-8 flex items-center gap-4">
        <AsterAvatar size={96} mood={paragraphs ? "happy" : "thinking"} />
          <div>
            <p className="font-mono-nova text-[10px] uppercase tracking-[0.4em] text-primary">
              {t("شرحٌ من أستر", "Aster · Explanation")}
            </p>
          <h2 dir={lang === "ar" ? "rtl" : "ltr"} className="font-arabic text-3xl text-metallic">{topic}</h2>
          </div>
        </div>

      <article className="space-y-5 rounded-3xl glass-card p-8 shadow-soft min-h-[200px]">
        {err && (
          <p dir={lang === "ar" ? "rtl" : "ltr"} className="font-arabic text-destructive">
            {t("تعذّر الاتصال بأستر: ", "Aster could not connect: ")}{err}
          </p>
        )}
        {!paragraphs && !err && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-arabic">{t("أستر يفكّر…", "Aster is thinking…")}</span>
          </div>
        )}
        {paragraphs?.map((p, i) => (
            <p
              key={i}
            dir={lang === "ar" ? "rtl" : "ltr"}
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

function Game({ topic, age }: { topic: string; age: AgeGroup }) {
  const { t, lang, gender } = useNova();
  const gen = useServerFn(generateQuiz);
  const [quiz, setQuiz] = useState<QuizQ[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(0);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState<"right" | "wrong" | null>(null);

  const fetchQuiz = () => {
    setQuiz(null); setErr(null);
    gen({ data: { topic, age, gender: gender ?? "male", lang } })
      .then((r) => setQuiz(r.questions))
      .catch((e) => setErr(String(e.message || e)));
  };
  useEffect(fetchQuiz, [topic, age, gender, lang]);

  const current = quiz?.[step];
  const mood: AsterMood = done
    ? (lives > 0 ? "excited" : "sad")
    : flash === "right" ? "happy"
    : flash === "wrong" ? "sad"
    : picked === null ? "thinking"
    : "calm";

  const pick = (i: number) => {
    if (picked !== null || !current) return;
    setPicked(i);
    const right = i === current.answer;
    setFlash(right ? "right" : "wrong");
    if (right) {
      const bonus = streak >= 2 ? 2 : 1;
      setScore((s) => s + 10 * bonus);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
      setLives((l) => l - 1);
    }
    setTimeout(() => {
      setFlash(null);
      setPicked(null);
      setShowHint(false);
      if (!right && lives - 1 <= 0) { setDone(true); return; }
      if (step + 1 >= (quiz?.length ?? 0)) setDone(true);
      else setStep((s) => s + 1);
    }, 1100);
  };

  const reset = () => {
    setStep(0); setPicked(null); setScore(0); setStreak(0);
    setLives(3); setHintUsed(0); setShowHint(false); setDone(false); setFlash(null);
    fetchQuiz();
  };

  if (err) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-32 text-center">
        <AsterAvatar size={96} mood="sad" />
        <p className="mt-6 font-arabic text-lg text-destructive">{err}</p>
        <button onClick={fetchQuiz} className="mt-6 rounded-full bg-metallic px-6 py-3 font-arabic text-sm text-[oklch(0.12_0.04_265)] shadow-nova">
          {t("حاول مجدداً", "Try again")}
        </button>
      </div>
    );
  }

  if (!quiz || !current) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-32 text-center">
        <AsterAvatar size={120} mood="thinking" />
        <p className="mt-8 font-arabic text-xl text-muted-foreground">
          {t("أستر يصنع لعبتك…", "Aster is crafting your game…")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-24 animate-float-up">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <AsterAvatar size={96} mood={mood} />
          <div>
            <p className="font-mono-nova text-[10px] uppercase tracking-[0.4em] text-primary">
              {t("لعبتك التعليميّة", "Your learning game")}
            </p>
            <h2 dir={lang === "ar" ? "rtl" : "ltr"} className="font-arabic text-2xl text-metallic">{topic}</h2>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-sm">
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <Heart key={i} className={`h-4 w-4 transition ${i < lives ? "text-destructive fill-destructive" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <div className="flex items-center gap-3 font-mono-nova text-xs">
            <span className="flex items-center gap-1"><Trophy className="h-3 w-3 text-primary" />{score}</span>
            <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-accent" />×{streak}</span>
          </div>
        </div>
      </div>

      {done ? (
        <div className="rounded-3xl glass-card p-10 text-center shadow-soft">
          <AsterAvatar size={120} mood={lives > 0 ? "excited" : "sad"} />
          <h3 className="font-arabic text-3xl text-metallic">
            {lives > 0 ? t("أحسنت! 🎉", "Well done! 🎉") : t("حظ أوفر! 💧", "Better luck next time!")}
          </h3>
          <p className="mt-2 font-arabic text-lg text-muted-foreground">
            {t("نقاطك", "Your score")}: <span className="text-foreground">{score}</span>
          </p>
          <button
            onClick={reset}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-metallic px-6 py-3 font-arabic text-sm text-[oklch(0.12_0.04_265)] shadow-nova transition hover:scale-105"
          >
            <RotateCcw className="h-4 w-4" />
            {t("لعبة جديدة", "New game")}
          </button>
        </div>
      ) : (
        <div className={`rounded-3xl glass-card p-8 shadow-soft transition-all ${flash === "right" ? "ring-2 ring-primary" : flash === "wrong" ? "ring-2 ring-destructive" : ""}`}>
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
          <p dir={lang === "ar" ? "rtl" : "ltr"} className="mb-6 font-arabic text-2xl leading-relaxed">
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
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-start font-arabic text-lg transition disabled:cursor-not-allowed ${
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
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={() => { setShowHint(true); if (!showHint) setHintUsed((h) => h + 1); }}
              disabled={showHint || picked !== null}
              className="inline-flex items-center gap-2 rounded-full border border-accent/50 px-4 py-2 text-sm text-accent transition hover:bg-accent/10 disabled:opacity-40"
            >
              <Lightbulb className="h-4 w-4" />
              {t("تلميح من أستر", "Aster hint")}
            </button>
            <span className="font-mono-nova text-[10px] uppercase tracking-widest text-muted-foreground">
              {t("تلميحات", "Hints used")}: {hintUsed}
            </span>
          </div>
          {showHint && (
            <p dir={lang === "ar" ? "rtl" : "ltr"} className="mt-4 rounded-2xl border border-accent/30 bg-accent/10 p-4 font-arabic text-sm">
              <Lightbulb className="me-2 inline h-4 w-4 text-accent" />
              {current.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
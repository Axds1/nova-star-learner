import { useState } from "react";
import { BookOpen, Gamepad2, Sparkles } from "lucide-react";
import { useNova } from "@/lib/nova-context";
import { AsterAvatar } from "@/components/AsterAvatar";
import type { AgeGroup } from "./AgeSelect";

export type Mode = "explain" | "game";

const suggestions_ar: Record<AgeGroup, string[]> = {
  child: ["دورة الماء", "كيف تطير الطائرة؟", "حروف الهجاء"],
  teen: ["نظرية النسبية", "الخلية الحية", "الجاذبية"],
  adult: ["الذكاء الاصطناعي", "اقتصاد العرض والطلب", "البلوك تشين"],
  senior: ["تاريخ الأندلس", "النباتات الطبية", "علم الفلك"],
};

export function TopicPrompt({
  age,
  onSubmit,
}: {
  age: AgeGroup;
  onSubmit: (topic: string, mode: Mode) => void;
}) {
  const { t, lang } = useNova();
  const [topic, setTopic] = useState("");

  const send = (mode: Mode) => {
    if (!topic.trim()) return;
    onSubmit(topic.trim(), mode);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 px-6 py-24 animate-float-up">
      <div className="flex flex-col items-center gap-4 text-center">
        <AsterAvatar size={72} />
        <p className="font-mono-nova text-xs uppercase tracking-[0.5em] text-primary">
          {t("أستر يستمع…", "Aster is listening…")}
        </p>
        <h2 className="font-arabic text-3xl sm:text-5xl text-metallic leading-tight">
          {t("ماذا تودّ أن تتعلّم اليوم؟", "What would you like to learn today?")}
        </h2>
      </div>

      <div className="w-full rounded-3xl glass-card p-2 shadow-soft">
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
          dir={lang === "ar" ? "rtl" : "ltr"}
          placeholder={t("اكتب موضوعك… مثل: المجموعة الشمسية", "Type a topic… e.g. Solar System")}
          className="w-full resize-none rounded-2xl bg-transparent p-5 font-arabic text-lg outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="font-mono-nova text-[10px] uppercase tracking-widest text-muted-foreground">
          {t("اقتراحات", "Suggestions")}
        </span>
        {suggestions_ar[age].map((s) => (
          <button
            key={s}
            onClick={() => setTopic(s)}
            className="rounded-full border border-primary/30 bg-secondary/30 px-4 py-1.5 font-arabic text-sm text-foreground/80 transition hover:border-primary hover:bg-secondary/60"
          >
            <Sparkles className="me-1 inline h-3 w-3 text-primary" />
            {s}
          </button>
        ))}
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        <button
          onClick={() => send("explain")}
          disabled={!topic.trim()}
          className="group relative overflow-hidden rounded-2xl bg-metallic p-[1px] transition disabled:opacity-40"
        >
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-background/40 px-6 py-5 backdrop-blur transition group-hover:bg-background/10">
            <BookOpen className="h-5 w-5" />
            <span className="font-arabic text-lg font-semibold">
              {t("اشرح لي الموضوع", "Explain the topic")}
            </span>
          </div>
        </button>
        <button
          onClick={() => send("game")}
          disabled={!topic.trim()}
          className="group relative overflow-hidden rounded-2xl ring-metallic p-5 transition hover:shadow-nova disabled:opacity-40"
        >
          <div className="flex items-center justify-center gap-3">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <span className="font-arabic text-lg font-semibold">
              {t("اصنع لعبتي التعليمية", "Build my learning game")}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
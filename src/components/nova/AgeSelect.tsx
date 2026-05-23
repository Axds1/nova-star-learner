import { Baby, Sparkles, GraduationCap, BookOpenCheck } from "lucide-react";
import { useNova } from "@/lib/nova-context";
import { AsterAvatar } from "@/components/AsterAvatar";

export type AgeGroup = "child" | "teen" | "adult" | "senior";

const groups: {
  id: AgeGroup;
  ar: string;
  en: string;
  range: string;
  icon: typeof Baby;
  hint_ar: string;
  hint_en: string;
}[] = [
  { id: "child", ar: "طفل", en: "Child", range: "4 – 10", icon: Baby, hint_ar: "قصص، ألوان، ألعاب", hint_en: "Stories, colors, games" },
  { id: "teen", ar: "يافع", en: "Teen", range: "11 – 17", icon: Sparkles, hint_ar: "محاكاة وتجارب تفاعلية", hint_en: "Simulations & quizzes" },
  { id: "adult", ar: "بالغ", en: "Adult", range: "18 – 55", icon: GraduationCap, hint_ar: "تعمّق وتطبيقات عملية", hint_en: "Depth & practical use" },
  { id: "senior", ar: "كبير السن", en: "Senior", range: "55+", icon: BookOpenCheck, hint_ar: "شرح هادئ وواضح", hint_en: "Calm, clear pacing" },
];

export function AgeSelect({ onSelect }: { onSelect: (g: AgeGroup) => void }) {
  const { t } = useNova();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-24 animate-float-up">
      <div className="flex flex-col items-center gap-4 text-center">
        <AsterAvatar size={120} mood="happy" />
        <p className="font-mono-nova text-xs uppercase tracking-[0.5em] text-primary">
          {t("أستر", "Aster")} · AI
        </p>
        <h1 className="font-arabic text-4xl sm:text-5xl md:text-6xl text-metallic leading-tight">
          {t("مرحباً بك في نوفا", "Welcome to Nova")}
        </h1>
        <p className="max-w-xl font-arabic text-base sm:text-lg text-muted-foreground">
          {t(
            "اختر فئتك العمرية لأبدأ في تكييف الشرح والتجارب التفاعلية لك خصيصاً.",
            "Choose your age group so I can tailor the experience for you.",
          )}
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g, i) => {
          const Icon = g.icon;
          return (
            <button
              key={g.id}
              onClick={() => onSelect(g.id)}
              className="group relative overflow-hidden rounded-3xl glass-card p-6 text-start transition-all duration-500 hover:-translate-y-1 hover:shadow-nova animate-float-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-nova-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex flex-col gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-metallic shadow-nova">
                  <Icon className="h-6 w-6 text-[oklch(0.12_0.04_265)]" />
                </div>
                <div>
                  <p className="font-mono-nova text-[10px] uppercase tracking-[0.3em] text-primary">{g.range}</p>
                  <h3 className="mt-1 font-arabic text-2xl font-semibold">
                    {t(g.ar, g.en)}
                  </h3>
                  <p className="mt-1 font-arabic text-sm text-muted-foreground">
                    {t(g.hint_ar, g.hint_en)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
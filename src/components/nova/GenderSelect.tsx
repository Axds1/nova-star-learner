import { useNova, type Gender } from "@/lib/nova-context";
import { AsterAvatar } from "@/components/AsterAvatar";

export function GenderSelect({ onSelect }: { onSelect: (g: Gender) => void }) {
  const { t, setGender } = useNova();

  const pick = (g: Gender) => {
    setGender(g);
    onSelect(g);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-6 py-24 animate-float-up">
      <div className="flex flex-col items-center gap-4 text-center">
        <AsterAvatar size={120} mood="happy" />
        <p className="font-mono-nova text-xs uppercase tracking-[0.5em] text-primary">
          {t("أستر", "Aster")} · AI
        </p>
        <h1 className="font-arabic text-4xl sm:text-5xl text-metallic leading-tight">
          {t("قبل أن نبدأ…", "Before we begin…")}
        </h1>
        <p className="max-w-md font-arabic text-base sm:text-lg text-muted-foreground">
          {t("اختر هويتك ليخاطبك أستر بأسلوبٍ مناسب.", "Pick how Aster should address you.")}
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-5">
        <button
          onClick={() => pick("male")}
          className="group relative overflow-hidden rounded-3xl glass-card p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-nova"
        >
          <div className="absolute inset-0 bg-nova-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative flex flex-col items-center gap-3">
            <div className="text-5xl">👦</div>
            <h3 className="font-arabic text-2xl font-semibold">{t("ذكر", "Male")}</h3>
          </div>
        </button>
        <button
          onClick={() => pick("female")}
          className="group relative overflow-hidden rounded-3xl glass-card p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-nova"
        >
          <div className="absolute inset-0 bg-nova-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative flex flex-col items-center gap-3">
            <div className="text-5xl">👧</div>
            <h3 className="font-arabic text-2xl font-semibold">{t("أنثى", "Female")}</h3>
          </div>
        </button>
      </div>
    </div>
  );
}
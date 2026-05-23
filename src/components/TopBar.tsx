import { Moon, Sun, Languages, ArrowLeft, ArrowRight } from "lucide-react";
import { useNova } from "@/lib/nova-context";

export function TopBar({ onBack }: { onBack?: () => void }) {
  const { theme, toggleTheme, lang, toggleLang, t } = useNova();
  const BackIcon = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 rounded-full glass-card px-4 py-2 text-sm transition hover:shadow-nova"
          >
            <BackIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
            <span className="font-arabic">{t("رجوع", "Back")}</span>
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="inline-flex items-center gap-2 rounded-full glass-card px-3 py-2 text-xs uppercase tracking-widest transition hover:shadow-nova"
          aria-label="toggle language"
        >
          <Languages className="h-4 w-4" />
          {lang === "ar" ? "EN" : "ع"}
        </button>
        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center rounded-full glass-card p-2 transition hover:shadow-nova"
          aria-label="toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
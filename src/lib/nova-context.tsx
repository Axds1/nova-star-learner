import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
type Lang = "ar" | "en";
export type Gender = "male" | "female";

interface NovaCtx {
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  toggleLang: () => void;
  gender: Gender | null;
  setGender: (g: Gender) => void;
  t: (ar: string, en: string) => string;
}

const Ctx = createContext<NovaCtx | null>(null);

export function NovaProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("ar");
  const [gender, setGender] = useState<Gender | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
  }, [theme, lang]);

  const value: NovaCtx = {
    theme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    lang,
    toggleLang: () => setLang((l) => (l === "ar" ? "en" : "ar")),
    gender,
    setGender,
    t: (ar, en) => (lang === "ar" ? ar : en),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNova() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useNova must be inside NovaProvider");
  return v;
}
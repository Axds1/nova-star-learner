import { useEffect, useMemo, useState } from "react";
import { AsterAvatar } from "@/components/AsterAvatar";

export function MatrixLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const total = 3600;
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / total);
      setProgress(p);
      setPhase(Math.min(3, Math.floor(p * 4)));
      if (p >= 1) {
        clearInterval(id);
        setTimeout(onDone, 450);
      }
    }, 50);
    return () => clearInterval(id);
  }, [onDone]);

  const columns = useMemo(
    () =>
      Array.from({ length: 42 }).map((_, i) => ({
        id: i,
        left: (i / 42) * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3.5,
        chars: Array.from({ length: 32 })
          .map(() => {
            const pool = "01アイウエオ△○◇✦✧·";
            return pool[Math.floor(Math.random() * pool.length)];
          })
          .join("\n"),
      })),
    [],
  );

  const phases = [
    { ar: "تهيئة النظام…", en: "Initializing system…" },
    { ar: "استدعاء أستر…", en: "Summoning Aster…" },
    { ar: "محاذاة النجوم…", en: "Aligning the stars…" },
    { ar: "أهلاً بك في نوفا", en: "Welcome to Nova" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[oklch(0.06_0.05_262)]">
      {/* deep radial backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, oklch(0.22 0.16 248 / 0.6) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, oklch(0.30 0.20 235 / 0.35) 0%, transparent 60%)",
        }}
      />
      <div className="absolute inset-0">
        {Array.from({ length: 110 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 2.2 + 0.5,
              height: Math.random() * 2.2 + 0.5,
              animationDelay: `${Math.random() * 4}s`,
              boxShadow: "0 0 6px oklch(0.95 0.05 232 / 0.7)",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden opacity-30">
        {columns.map((c) => (
          <div
            key={c.id}
            className="absolute top-0 font-mono-nova text-[11px] leading-tight whitespace-pre text-[oklch(0.85_0.14_232)]"
            style={{
              left: `${c.left}%`,
              animation: `matrix-fall ${c.duration}s linear ${c.delay}s infinite`,
              textShadow: "0 0 10px oklch(0.85 0.18 232 / 0.9)",
            }}
          >
            {c.chars}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-7 px-6 text-center">
        {/* Aster floats in as logo focus */}
        <div className="relative">
          <div className="absolute inset-0 -m-10 rounded-full blur-3xl animate-nova-pulse"
               style={{ background: "radial-gradient(circle, oklch(0.85 0.20 235 / 0.65), transparent 65%)" }} />
          <AsterAvatar size={140} mood={progress < 0.5 ? "thinking" : progress < 0.95 ? "calm" : "happy"} />
        </div>

        <div className="space-y-1">
          <h1 dir="rtl" className="font-arabic-display text-6xl text-metallic leading-none">نوفا</h1>
          <h2 className="font-display text-xl tracking-[0.55em] text-[oklch(0.96_0.02_232)]">N · O · V · A</h2>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="h-[2px] w-72 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-[oklch(0.85_0.20_235)] via-white to-[oklch(0.85_0.20_235)] transition-all duration-200"
              style={{ width: `${progress * 100}%`, boxShadow: "0 0 14px oklch(0.85 0.20 235 / 0.8)" }}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono-nova text-[10px] uppercase tracking-[0.5em] text-[oklch(0.92_0.05_232)]">
              {Math.round(progress * 100).toString().padStart(2, "0")}%
            </span>
            <span className="font-arabic text-sm text-[oklch(0.92_0.05_232)]">
              {phases[phase].ar} · {phases[phase].en}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
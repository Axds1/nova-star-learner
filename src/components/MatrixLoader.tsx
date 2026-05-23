import { useEffect, useMemo, useState } from "react";

export function MatrixLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const total = 3200;
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / total);
      setProgress(p);
      if (p >= 1) {
        clearInterval(id);
        setTimeout(onDone, 350);
      }
    }, 60);
    return () => clearInterval(id);
  }, [onDone]);

  const columns = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        left: (i / 36) * 100,
        delay: Math.random() * 2,
        duration: 2.5 + Math.random() * 3,
        chars: Array.from({ length: 28 })
          .map(() => (Math.random() > 0.5 ? "1" : "0"))
          .join("\n"),
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[oklch(0.08_0.03_265)]">
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden opacity-40">
        {columns.map((c) => (
          <div
            key={c.id}
            className="absolute top-0 font-mono-nova text-xs leading-tight whitespace-pre text-[oklch(0.78_0.16_240)]"
            style={{
              left: `${c.left}%`,
              animation: `matrix-fall ${c.duration}s linear ${c.delay}s infinite`,
              textShadow: "0 0 8px oklch(0.78 0.16 240 / 0.85)",
            }}
          >
            {c.chars}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-full bg-metallic opacity-30 blur-2xl animate-nova-pulse" />
          <div className="absolute inset-2 rounded-full bg-metallic shadow-nova animate-nova-pulse" />
          <div className="absolute inset-6 rounded-full bg-[oklch(0.08_0.03_265)] grid place-items-center">
            <span className="font-display text-4xl text-metallic">N</span>
          </div>
        </div>
        <div className="space-y-2">
          <h1 dir="rtl" className="font-arabic text-5xl text-metallic">نوفا</h1>
          <h2 className="font-display text-2xl tracking-[0.4em] text-[oklch(0.92_0.02_250)]">NOVA</h2>
        </div>
        <div className="h-px w-64 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-metallic transition-all duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="font-mono-nova text-xs uppercase tracking-[0.4em] text-[oklch(0.78_0.16_240)]">
          {Math.round(progress * 100)}%
        </p>
      </div>
    </div>
  );
}
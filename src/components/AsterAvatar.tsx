import calmImg from "@/assets/aster-calm.png";
import happyImg from "@/assets/aster-happy.png";
import excitedImg from "@/assets/aster-excited.png";
import thinkingImg from "@/assets/aster-thinking.png";

export type AsterMood = "calm" | "happy" | "excited" | "thinking" | "sad";

const moodMap: Record<AsterMood, string> = {
  calm: calmImg,
  happy: happyImg,
  excited: excitedImg,
  thinking: thinkingImg,
  sad: calmImg,
};

const moodAnim: Record<AsterMood, string> = {
  calm: "animate-ghost-float",
  happy: "animate-ghost-float",
  excited: "animate-excited-bounce",
  thinking: "animate-thinking-tilt",
  sad: "animate-sad-sway",
};

// Pink-tinged AI aura — gives Aster a warm, friendly identity
const moodAuraHue: Record<AsterMood, string> = {
  calm: "oklch(0.82 0.16 350)",
  happy: "oklch(0.82 0.2 0)",
  excited: "oklch(0.78 0.22 350)",
  thinking: "oklch(0.72 0.18 320)",
  sad: "oklch(0.62 0.14 340)",
};

export function AsterAvatar({
  size = 64,
  mood = "calm",
}: {
  size?: number;
  mood?: AsterMood;
}) {
  const aura = moodAuraHue[mood];
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      {/* aura */}
      <div
        className="absolute -inset-4 rounded-full blur-2xl animate-aura-pulse"
        style={{
          background: `radial-gradient(circle, ${aura} 0%, transparent 65%)`,
        }}
      />
      {/* ghost-floating body */}
      <div className={`relative h-full w-full ${moodAnim[mood]}`}>
        <img
          key={mood}
          src={moodMap[mood]}
          alt={`Aster · ${mood}`}
          width={size}
          height={size}
          loading="lazy"
          className="relative h-full w-full object-contain"
          style={{ filter: `drop-shadow(0 0 24px ${aura})` }}
        />
        {/* Eye-only blink lids — sit over the eye band of the robot face */}
        <div
          className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-[14%]"
          style={{ top: "36%", width: "62%" }}
          aria-hidden
        >
          <span
            className="block h-[7%] flex-1 rounded-full bg-foreground/85 animate-eye-lid"
            style={{ minHeight: 2, boxShadow: `0 0 6px ${aura}` }}
          />
          <span
            className="block h-[7%] flex-1 rounded-full bg-foreground/85 animate-eye-lid"
            style={{ minHeight: 2, boxShadow: `0 0 6px ${aura}`, animationDelay: "60ms" }}
          />
        </div>
      </div>
      {/* mood badge */}
      <span
        className="absolute -bottom-1 right-0 text-base"
        style={{ filter: `drop-shadow(0 0 6px ${aura})` }}
        aria-hidden
      >
        {mood === "happy" && "✨"}
        {mood === "excited" && "🎉"}
        {mood === "thinking" && "💭"}
        {mood === "sad" && "💧"}
      </span>
    </div>
  );
}
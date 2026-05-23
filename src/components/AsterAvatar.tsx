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

const moodAuraHue: Record<AsterMood, string> = {
  calm: "oklch(0.7 0.2 245)",
  happy: "oklch(0.78 0.22 230)",
  excited: "oklch(0.78 0.25 195)",
  thinking: "oklch(0.62 0.22 268)",
  sad: "oklch(0.55 0.18 258)",
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
          className="relative h-full w-full object-contain animate-aster-blink"
          style={{ filter: `drop-shadow(0 0 24px ${aura})` }}
        />
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
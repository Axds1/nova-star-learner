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

// White-blue cosmic aura — Nova identity
const moodAuraHue: Record<AsterMood, string> = {
  calm:     "oklch(0.92 0.08 235)",
  happy:    "oklch(0.95 0.10 232)",
  excited:  "oklch(0.86 0.18 238)",
  thinking: "oklch(0.80 0.14 245)",
  sad:      "oklch(0.70 0.10 245)",
};

// Secondary core glow (deeper blue) layered behind the white aura
const moodCoreHue: Record<AsterMood, string> = {
  calm:     "oklch(0.62 0.22 245)",
  happy:    "oklch(0.70 0.24 240)",
  excited:  "oklch(0.66 0.26 240)",
  thinking: "oklch(0.55 0.20 250)",
  sad:      "oklch(0.48 0.14 250)",
};

export function AsterAvatar({
  size = 64,
  mood = "calm",
}: {
  size?: number;
  mood?: AsterMood;
}) {
  const aura = moodAuraHue[mood];
  const core = moodCoreHue[mood];
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      {/* outer white halo */}
      <div
        className="absolute -inset-6 rounded-full blur-2xl animate-aura-pulse"
        style={{
          background: `radial-gradient(circle, ${aura} 0%, transparent 60%)`,
        }}
      />
      {/* inner blue core glow */}
      <div
        className="absolute -inset-2 rounded-full blur-xl animate-aura-pulse"
        style={{
          background: `radial-gradient(circle, ${core} 0%, transparent 70%)`,
          animationDelay: "400ms",
          opacity: 0.85,
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
          style={{ filter: `drop-shadow(0 0 18px ${aura}) drop-shadow(0 0 32px ${core})` }}
        />
      </div>
      {/* mood badge */}
      <span
        className="absolute -bottom-1 right-0 text-base"
        style={{ filter: `drop-shadow(0 0 6px ${core})` }}
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
import calmImg from "@/assets/aster-calm.png";
import happyImg from "@/assets/aster-happy.png";
import excitedImg from "@/assets/aster-excited.png";
import thinkingImg from "@/assets/aster-thinking.png";

export type AsterMood = "calm" | "happy" | "excited" | "thinking";

const moodMap: Record<AsterMood, string> = {
  calm: calmImg,
  happy: happyImg,
  excited: excitedImg,
  thinking: thinkingImg,
};

export function AsterAvatar({
  size = 64,
  mood = "calm",
}: {
  size?: number;
  mood?: AsterMood;
}) {
  return (
    <div
      className="relative shrink-0 animate-nova-pulse"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-nova-glow blur-xl" />
      <img
        key={mood}
        src={moodMap[mood]}
        alt={`Aster · ${mood}`}
        width={size}
        height={size}
        loading="lazy"
        className="relative h-full w-full object-contain drop-shadow-[0_0_22px_oklch(0.75_0.18_240/0.6)] animate-float-up"
      />
    </div>
  );
}
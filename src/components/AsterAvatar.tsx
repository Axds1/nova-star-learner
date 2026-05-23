import asterImg from "@/assets/aster-orb.png";

export function AsterAvatar({ size = 64 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 animate-nova-pulse"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-nova-glow blur-xl" />
      <img
        src={asterImg}
        alt="Aster"
        width={size}
        height={size}
        loading="lazy"
        className="relative h-full w-full object-contain drop-shadow-[0_0_18px_oklch(0.82_0.15_78/0.6)]"
      />
    </div>
  );
}
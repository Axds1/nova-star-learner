import { useNova } from "@/lib/nova-context";
import lilyArt from "@/assets/lily-blue.png";

/**
 * Decorative lily border — white lilies for light mode,
 * blue lilies for dark mode. Inspired by the project poster.
 */
export function LilyDecor() {
  const { theme } = useNova();
  const blend = theme === "dark" ? "mix-blend-screen" : "mix-blend-multiply";
  const motionAnim = theme === "dark" ? "animate-lily-glow" : "animate-lily-sway";
  const opacity = theme === "dark" ? 0.9 : 0.75;
  const size = "min(34vw, 440px)";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* Left side — crop the left half of the source art */}
      <img
        src={lilyArt}
        alt=""
        className={`absolute left-0 bottom-0 object-contain object-left-bottom ${blend} ${motionAnim}`}
        style={{
          width: size,
          height: size,
          opacity,
          objectPosition: "left bottom",
        }}
      />
      {/* Right side — mirror so flowers face inward */}
      <img
        src={lilyArt}
        alt=""
        className={`absolute right-0 bottom-0 object-contain ${blend} ${motionAnim}`}
        style={{
          width: size,
          height: size,
          opacity,
          objectPosition: "right bottom",
          transform: "scaleX(-1)",
          animationDelay: "1.2s",
        }}
      />
    </div>
  );
}
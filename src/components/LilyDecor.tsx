import { useNova } from "@/lib/nova-context";
import lilyArt from "@/assets/lily-blue.png";

/**
 * Decorative lily border — white lilies for light mode,
 * blue lilies for dark mode. Inspired by the project poster.
 */
export function LilyDecor() {
  const { theme } = useNova();
  const blend = theme === "dark" ? "mix-blend-screen" : "mix-blend-multiply";
  const opacity = theme === "dark" ? 0.92 : 0.8;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Single tall vertical lily, gently drifting side to side */}
      <img
        src={lilyArt}
        alt=""
        className={`absolute left-1/2 bottom-0 object-contain object-bottom ${blend} animate-lily-drift`}
        style={{
          width: "min(38vh, 280px)",
          height: "min(95vh, 880px)",
          opacity,
          transform: "translateX(-50%)",
          transformOrigin: "bottom center",
        }}
      />
    </div>
  );
}
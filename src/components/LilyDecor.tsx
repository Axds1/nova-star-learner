import { useNova } from "@/lib/nova-context";
import lilyArt from "@/assets/lily-blue.png";

/**
 * Decorative lily border — white lilies for light mode,
 * blue lilies for dark mode. Inspired by the project poster.
 */
export function LilyDecor() {
  const { theme } = useNova();
  // The PNG has transparent background with watercolor lilies in two corners.
  // Light mode: gentle multiply for soft pastel feel.
  // Dark mode: screen blend + brightness boost so the blue glows on dark bg.
  const blend = theme === "dark" ? "mix-blend-screen" : "mix-blend-multiply";
  const motionAnim = theme === "dark" ? "animate-lily-glow" : "animate-lily-sway";
  const opacity = theme === "dark" ? 0.85 : 0.7;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 flex justify-center"
    >
      <img
        src={lilyArt}
        alt=""
        className={`w-full max-w-[1600px] object-contain object-bottom ${blend} ${motionAnim}`}
        style={{ opacity, height: "min(60vh, 520px)" }}
      />
    </div>
  );
}
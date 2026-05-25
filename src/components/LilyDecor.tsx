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
      {/* Top-left lily: gentle drift + sway */}
      <img
        src={lilyArt}
        alt=""
        className={`absolute -top-6 -left-10 object-contain ${blend} animate-lily-float-tl`}
        style={{
          width: "min(46vw, 520px)",
          height: "auto",
          opacity,
          objectPosition: "top left",
          clipPath: "inset(0 0 55% 0)",
        }}
      />
      {/* Bottom-right lily: opposite drift */}
      <img
        src={lilyArt}
        alt=""
        className={`absolute -bottom-8 -right-10 object-contain ${blend} animate-lily-float-br`}
        style={{
          width: "min(40vw, 460px)",
          height: "auto",
          opacity,
          objectPosition: "bottom right",
          clipPath: "inset(55% 0 0 0)",
        }}
      />
    </div>
  );
}
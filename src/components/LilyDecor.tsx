import { useNova } from "@/lib/nova-context";
import whiteLily from "@/assets/lily-white.jpeg";
import blueLily from "@/assets/lily-blue.jpeg";

/**
 * Decorative lily border — white lilies for light mode,
 * blue lilies for dark mode. Inspired by the project poster.
 */
export function LilyDecor() {
  const { theme, lang } = useNova();
  const src = theme === "dark" ? blueLily : whiteLily;
  // Place on the leading edge of the layout (right in RTL, left in LTR)
  const sideClass = lang === "ar" ? "right-0" : "left-0";
  const flipClass = lang === "ar" ? "" : "scale-x-[-1]";
  const blend = theme === "dark" ? "mix-blend-screen" : "mix-blend-multiply";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-y-0 ${sideClass} z-0 hidden md:block`}
      style={{ width: "min(28vw, 360px)" }}
    >
      <img
        src={src}
        alt=""
        className={`h-full w-full object-cover object-center opacity-70 ${blend} ${flipClass}`}
        style={{
          maskImage:
            "linear-gradient(to right, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 55%, transparent 100%)",
        }}
      />
      {/* Mobile / narrow: soft bottom strip so the motif still reads */}
      <img
        src={src}
        alt=""
        className={`fixed inset-x-0 bottom-0 h-24 w-full object-cover opacity-50 md:hidden ${blend}`}
        style={{
          maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
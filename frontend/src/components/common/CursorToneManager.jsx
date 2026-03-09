import { useEffect } from "react";

const toneToVar = {
  blue: "var(--cursor-blue)",
  orange: "var(--cursor-orange)",
  red: "var(--cursor-red)",
  light: "var(--cursor-light)",
  dark: "var(--cursor-dark)",
};

export default function CursorToneManager() {
  useEffect(() => {
    let rafId = null;
    let lastTone = "blue";

    const applyTone = (tone) => {
      const resolvedTone = toneToVar[tone] ? tone : "blue";
      if (resolvedTone === lastTone) {
        return;
      }
      lastTone = resolvedTone;
      document.documentElement.style.setProperty(
        "--active-cursor",
        toneToVar[resolvedTone]
      );
    };

    const onMove = (event) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const element = document.elementFromPoint(event.clientX, event.clientY);
        const section = element?.closest("[data-cursor-tone]");
        applyTone(section?.getAttribute("data-cursor-tone") || "blue");
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}

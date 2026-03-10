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
    let burstId = 0;

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

    const onClick = (event) => {
      burstId += 1;
      const burst = document.createElement("span");
      const section = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-cursor-tone]");
      const tone = section?.getAttribute("data-cursor-tone") || "blue";
      burst.className = `cursor-click-burst tone-${tone}`;
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;
      burst.style.setProperty("--burst-id", String(burstId));

      for (let index = 0; index < 8; index += 1) {
        const ray = document.createElement("span");
        ray.className = "cursor-click-burst__ray";
        ray.style.setProperty("--ray-angle", `${index * 45}deg`);
        burst.appendChild(ray);
      }

      document.body.appendChild(burst);
      window.setTimeout(() => {
        burst.remove();
      }, 520);
    };

    window.addEventListener("click", onClick, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}

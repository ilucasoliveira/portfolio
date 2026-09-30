import { useEffect, useRef } from "react";
import { canHover, prefersReducedMotion } from "../utils/motion";

export function useTilt(maxDegrees = 4) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canHover() || prefersReducedMotion()) return;

    let frame = 0;

    function handleMove(event) {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--tilt-x", `${(0.5 - y) * maxDegrees * 2}deg`);
        el.style.setProperty("--tilt-y", `${(x - 0.5) * maxDegrees * 2}deg`);
        el.style.setProperty("--glare-x", `${x * 100}%`);
        el.style.setProperty("--glare-y", `${y * 100}%`);
        el.classList.add("is-tilting");
      });
    }

    function handleLeave() {
      cancelAnimationFrame(frame);
      el.style.removeProperty("--tilt-x");
      el.style.removeProperty("--tilt-y");
      el.classList.remove("is-tilting");
    }

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [maxDegrees]);

  return ref;
}

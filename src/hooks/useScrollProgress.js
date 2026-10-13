import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../utils/motion";

/*
 * Escreve --p (0 a 1) no elemento conforme a rolagem, para animar em CSS
 * em qualquer navegador.
 * mode "pin": progresso dentro de uma seção alta com palco "sticky"
 *             (0 quando o topo encosta no topo da tela, 1 quando o fim chega ao fim da tela).
 * mode "pass": progresso da passagem pela tela (0 entrando por baixo, 1 saindo por cima).
 * Com movimento reduzido, fica em --p: 1 (estado final, tudo visível).
 */
export function useScrollProgress(mode = "pin", onProgress) {
  const ref = useRef(null);
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.setProperty("--p", "1");
      callback.current?.(1);
      return;
    }

    let frame = 0;
    let last = -1;

    function update() {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p;
      if (mode === "pin") {
        const span = rect.height - vh;
        p = span > 0 ? -rect.top / span : rect.top < 0 ? 1 : 0;
      } else {
        p = (vh - rect.top) / (vh + rect.height);
      }
      p = Math.min(Math.max(p, 0), 1);
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        el.style.setProperty("--p", p.toFixed(4));
        callback.current?.(p);
      }
    }

    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [mode]);

  return ref;
}

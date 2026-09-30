import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../utils/motion";

const RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";
const TICK_MS = 45;
const TICKS_PER_LETTER = 3;

function randomRune() {
  return RUNES[Math.floor(Math.random() * RUNES.length)];
}

function scramble(text, revealed) {
  return [...text]
    .map((char, i) => (i < revealed || char === " " ? char : randomRune()))
    .join("");
}

export function useRuneDecode(text, active) {
  const [display, setDisplay] = useState(text);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!active || hasPlayed.current || prefersReducedMotion()) {
      setDisplay(text);
      return;
    }

    hasPlayed.current = true;
    const totalTicks = text.length * TICKS_PER_LETTER;
    let tick = 0;

    setDisplay(scramble(text, 0));

    const id = setInterval(() => {
      tick += 1;

      if (tick >= totalTicks) {
        setDisplay(text);
        clearInterval(id);
        return;
      }

      setDisplay(scramble(text, Math.floor(tick / TICKS_PER_LETTER)));
    }, TICK_MS);

    return () => clearInterval(id);
  }, [text, active]);

  return display;
}

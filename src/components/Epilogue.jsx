import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useParallax } from "../hooks/useParallax";
import { useScrollProgress } from "../hooks/useScrollProgress";
import ElvishScript from "./ElvishScript";
import Footer from "./Footer";
import RuneText from "./RuneText";
import wraith from "../assets/wraith-night.webp";
import "./Epilogue.css";

/*
 * Epílogo: o espectro sozinho no fim. A seção fica presa enquanto se rola:
 * a névoa se abre, a figura surge do escuro, o anel acende e a frase aparece
 * palavra por palavra. O fundo da imagem é o mesmo preto da página.
 */

// fiapos de névoa que se afastam para os lados
const WISPS = [
  { left: "-6%", top: "38%", w: "46%", h: "30%", dir: -1, dur: 13 },
  { left: "-2%", top: "64%", w: "40%", h: "26%", dir: -1, dur: 17 },
  { left: "58%", top: "36%", w: "48%", h: "30%", dir: 1, dur: 15 },
  { left: "62%", top: "66%", w: "42%", h: "24%", dir: 1, dur: 19 },
  { left: "22%", top: "84%", w: "56%", h: "20%", dir: 0, dur: 16 },
];

function Epilogue() {
  const { t } = useLanguage();
  const parallaxRef = useParallax();
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stageRef = useRef(null);
  const words = t.epilogue.line.split(" ");

  const scrollRef = useScrollProgress("pin", (p) => {
    if (p > 0.45) setRevealed(true);
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    // pausa as animações quando sai da tela
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // night-zone: o espectro fica na noite mesmo no tema de dia (o rodapé daqui também)
  const classes = ["epilogue", "night-zone", revealed ? "epilogue--revealed" : "", playing ? "" : "epilogue--paused"].join(" ");

  return (
    <section className={classes} ref={scrollRef} aria-labelledby="epilogue-title">
      <div className="epilogue__stage" ref={stageRef}>
        <div className="epilogue__parallax" ref={parallaxRef}>
          <div className="epilogue__aura" aria-hidden="true" />

          <figure className="epilogue__figure" aria-hidden="true">
            <div className="epilogue__body">
              <img className="epilogue__wraith" src={wraith} alt="" width="828" height="1005" loading="lazy" decoding="async" />

              <div className="epilogue__ring">
                <span className="epilogue__ring-glow" />
                <svg className="epilogue__ring-band" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="epilogueGold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f6dc8e" />
                      <stop offset="45%" stopColor="#c9a84c" />
                      <stop offset="70%" stopColor="#7a5a1c" />
                      <stop offset="100%" stopColor="#e8c97a" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="url(#epilogueGold)" strokeWidth="11" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,240,200,0.55)" strokeWidth="1.2" />
                </svg>
              </div>
            </div>
          </figure>

          {WISPS.map((w, i) => (
            <span
              key={i}
              className="epilogue__wisp"
              aria-hidden="true"
              style={{
                left: w.left,
                top: w.top,
                width: w.w,
                height: w.h,
                "--dir": w.dir,
                animationDuration: `${w.dur}s`,
              }}
            />
          ))}
        </div>

        <div className="epilogue__text">
          <h2 className="epilogue__chapter" id="epilogue-title">
            <span className="epilogue__line" aria-hidden="true" />
            <RuneText text={t.epilogue.chapter} active={revealed} />
            <span className="epilogue__line" aria-hidden="true" />
          </h2>
          <p className="epilogue__inscription">
            <span className="sr-only">{t.epilogue.line}</span>
            <span aria-hidden="true">
              {words.map((word, i) => (
                <span key={i} className="epilogue__word" style={{ "--i": i }}>
                  {word}
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </span>
          </p>
          <ElvishScript className="epilogue__elvish" text="algumas sombras guardam o que foi forjado" lit={revealed} />
        </div>

        {/* o rodapé surge no fim da cena, no mesmo escuro do espectro */}
        <Footer className="footer--epilogue" />
      </div>
    </section>
  );
}

export default Epilogue;

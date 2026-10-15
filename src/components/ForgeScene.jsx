import { useEffect, useRef, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useScrollProgress } from "../hooks/useScrollProgress";
import forge from "../assets/forge-balrog.webp";
import "./ForgeScene.css";

/*
 * A forja: o mago diante da criatura de fogo, o fim da descida da Oficina.
 * As bordas da imagem se dissolvem no preto da página; o fogo ondula, as
 * fagulhas sobem e a luz branca pulsa na ponta do cajado.
 *
 * finale: a cena cobre a tela junto com o rodapé, com o conteúdo (children)
 * embaixo dela.
 * easterEgg: frase escondida que aparece entre o mago e a criatura quando o
 * mouse passa sobre o mago (no celular, ao tocar nele); a luz do cajado estoura junto.
 */

// a imagem (~220 KB) só começa a baixar quando a cena está a menos de uma
// tela e pouco de distância, e não logo ao abrir a página
const NEAR = { threshold: 0, rootMargin: "900px 0px" };

// ponta do cajado na imagem (onde nasce a luz branca)
const STAFF = { x: "49.8%", y: "71%" };

const EMBER_COLORS = ["#ff8a3d", "#ff4a1c", "#ffc06b", "#e8331a", "#ffd9a0"];

const EMBERS = Array.from({ length: 34 }, (_, i) => {
  const size = 2 + (i % 3);
  return {
    left: `${10 + ((i * 37) % 80)}%`,
    top: `${40 + ((i * 13) % 45)}%`,
    width: `${size}px`,
    height: `${size}px`,
    color: EMBER_COLORS[i % 5],
    "--x": `${((i * 29) % 60) - 30}px`,
    "--y": `${-(160 + ((i * 53) % 220))}px`,
    "--d": `${(3.4 + ((i * 0.37) % 3.2)).toFixed(2)}s`,
    "--dl": `${(-((i * 0.53) % 6)).toFixed(2)}s`,
  };
});

const BEAM_DOTS = Array.from({ length: 12 }, (_, i) => ({
  left: `calc(${STAFF.x} + ${((i * 13) % 11) - 5}px)`,
  top: `calc(${STAFF.y} + ${((i * 7) % 9) - 4}px)`,
  width: "2px",
  height: "2px",
  color: i % 2 ? "#ffffff" : "#bfe0ff",
  "--x": `${((i * 47) % 160) - 80}px`,
  "--y": `${-(60 + ((i * 41) % 160))}px`,
  "--d": `${(1.6 + ((i * 0.29) % 1.2)).toFixed(2)}s`,
  "--dl": `${(-((i * 0.41) % 2.4)).toFixed(2)}s`,
}));

function ForgeScene({ sceneLabel, finale = false, easterEgg, labelledBy = "forge-title", children }) {
  const [playing, setPlaying] = useState(false);
  const watchRef = useRef(null);
  const ref = useScrollProgress("pass");
  const [nearRef, near] = useInView(NEAR);

  useEffect(() => {
    const el = watchRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), {
      rootMargin: "120px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`forge night-zone ${finale ? "forge--finale" : ""} ${playing ? "" : "forge--paused"}`}
      ref={ref}
      aria-labelledby={labelledBy}
    >
      <svg className="forge__defs" aria-hidden="true" focusable="false">
        <filter id="forge-live-a" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.019" numOctaves="2" seed="3" result="noise">
            <animate attributeName="seed" values="3;5;8;3" dur="2.4s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="forge-live-b" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.016" numOctaves="2" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* a cena: fundo inteiro da seção */}
      <div className="forge__backdrop" ref={watchRef}>
        <div className="forge__heat-wide" aria-hidden="true" />
        <figure className="forge__scene" role="img" aria-label={sceneLabel} ref={nearRef}>
          <div className="forge__zoom" style={near ? { "--forge-img": `url(${forge})` } : undefined}>
            {near && (
              <>
                <img className="forge__base" src={forge} alt="" width="1920" height="1200" decoding="async" />
                <img className="forge__live forge__live--a" src={forge} alt="" aria-hidden="true" />
                <img className="forge__live forge__live--b" src={forge} alt="" aria-hidden="true" />
              </>
            )}
            <span className="forge__heat" aria-hidden="true" />
            {EMBERS.map((style, i) => (
              <span key={`e${i}`} className="forge__ember" style={style} aria-hidden="true" />
            ))}
            <span className="forge__rays" aria-hidden="true" style={{ left: STAFF.x, top: STAFF.y }} />
            <span className="forge__glow" aria-hidden="true" style={{ left: STAFF.x, top: STAFF.y }} />
            {BEAM_DOTS.map((style, i) => (
              <span key={`b${i}`} className="forge__ember forge__ember--light" style={style} aria-hidden="true" />
            ))}
            <span className="forge__tip" aria-hidden="true" style={{ left: STAFF.x, top: STAFF.y }} />
            {easterEgg && (
              <>
                <span className="forge__egg-zone" aria-hidden="true" />
                <span className="forge__egg-flash" aria-hidden="true" style={{ left: STAFF.x, top: STAFF.y }} />
                <span className="forge__egg" aria-hidden="true">
                  {easterEgg}
                </span>
              </>
            )}
          </div>
        </figure>
      </div>

      <div className="forge__content">{children}</div>
    </section>
  );
}

export default ForgeScene;

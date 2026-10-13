import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { FUTHARK } from "../utils/runes";
import forge from "../assets/forge-balrog.webp";
import "./ForgeScene.css";

/*
 * A forja: o mago diante da criatura de fogo ocupa o fundo inteiro da seção.
 * As bordas da imagem se dissolvem no preto da página; o fogo ondula, as
 * fagulhas sobem e a luz branca pulsa na ponta do cajado. As tecnologias
 * ficam nos lados, como runas presas em pedra.
 */

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

// as stacks descem em arco pelos lados da cena (o meio da lista fica mais afastado)
function orbit(list, side) {
  return list.map(([name, role], i) => ({
    name,
    role,
    rune: FUTHARK[(i * 7 + (side === "right" ? 3 : 0)) % FUTHARK.length],
    style: {
      "--off": `${Math.round(Math.sin((Math.PI * (i + 0.5)) / list.length) * 48)}px`,
      "--dl": `${(-((i * 0.9) % 6)).toFixed(1)}s`,
      "--i": i,
    },
  }));
}

function Stone({ item }) {
  return (
    <li style={item.style}>
      <span className="forge__rune" aria-hidden="true">
        {item.rune}
      </span>
      <span className="forge__name">{item.name}</span>
      <span className="forge__role">{item.role}</span>
    </li>
  );
}

function ForgeScene({ stack, labelA, labelB, sceneLabel, children }) {
  const [playing, setPlaying] = useState(false);
  const watchRef = useRef(null);
  const ref = useScrollProgress("pass");
  const half = Math.ceil(stack.length / 2);
  const left = orbit(stack.slice(0, half), "left");
  const right = orbit(stack.slice(half), "right");

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
    <section className={`forge ${playing ? "" : "forge--paused"}`} ref={ref} aria-labelledby="forge-title">
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
        <figure className="forge__scene" role="img" aria-label={sceneLabel}>
          <div className="forge__zoom" style={{ "--forge-img": `url(${forge})` }}>
            <img className="forge__base" src={forge} alt="" width="1920" height="1200" decoding="async" />
            <img className="forge__live forge__live--a" src={forge} alt="" aria-hidden="true" />
            <img className="forge__live forge__live--b" src={forge} alt="" aria-hidden="true" />
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
          </div>
        </figure>
      </div>

      <div className="forge__content">
        <div className="forge__head">{children}</div>
        <div className="forge__orbits">
          <ul className="forge__orbit forge__orbit--left" aria-label={labelA}>
            {left.map((item) => (
              <Stone key={item.name} item={item} />
            ))}
          </ul>
          <div className="forge__gap" aria-hidden="true" />
          <ul className="forge__orbit forge__orbit--right" aria-label={labelB}>
            {right.map((item) => (
              <Stone key={item.name} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ForgeScene;

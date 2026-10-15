import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useInView } from "../hooks/useInView";
import { prefersReducedMotion } from "../utils/motion";
import mapArt from "../assets/journey-map.webp";
import "./JourneyMap.css";

/*
 * Mapa da jornada: a ilustração do mapa ao fundo e, por cima, uma trilha
 * pontilhada. Quando o mapa aparece inteiro na tela, a jornada se percorre
 * sozinha (sem depender da rolagem), acendendo cada parada sobre um marco do mapa.
 */

const W = 1930;
const H = 815;

// paradas: posição no mapa e em que ponto da trilha acendem
const STOPS = [
  { x: 531, y: 335, at: 0.04 },
  { x: 853, y: 520, at: 0.27 },
  { x: 1015, y: 640, at: 0.45 },
  { x: 1233, y: 323, at: 0.72 },
  { x: 1525, y: 190, at: 0.96 },
];

const JOURNEY_MS = 6500;

// a ilustração (~200 KB) só baixa quando o mapa está a menos de uma tela e pouco
// de distância; antes disso fica só o fundo escuro do quadro
const NEAR = { threshold: 0, rootMargin: "900px 0px" };

const TRAIL = "M531 335C640 420 760 470 853 520S960 650 1015 640 1150 420 1233 323 1420 200 1525 190";

function JourneyMap() {
  const { t } = useLanguage();
  const [ref, inView] = useInView({ threshold: 0.6, rootMargin: "0px" });
  const [nearRef, near] = useInView(NEAR);
  const stops = t.experience.mapStops;

  // percorre a trilha uma vez, no próprio ritmo, assim que o mapa está na tela
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    let frame = 0;
    const start = performance.now();
    // no celular o mapa é mais largo que a tela (rola de lado): a câmera acompanha a trilha
    // (com menos movimento a trilha se desenha igual, mas a tela não anda sozinha)
    const live = el.querySelector(".map__trail--live");
    const total = live.getTotalLength();
    const follow = el.scrollWidth > el.clientWidth + 4 && !prefersReducedMotion();
    function step(now) {
      const x = Math.min((now - start) / JOURNEY_MS, 1);
      const eased = 0.5 - Math.cos(Math.PI * x) / 2;
      el.style.setProperty("--t", eased.toFixed(4));
      if (follow) {
        const point = live.getPointAtLength(total * eased);
        const px = (point.x / W) * el.scrollWidth;
        el.scrollLeft = Math.max(0, px - el.clientWidth / 2);
      }
      if (x < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, ref]);

  return (
    <figure className="map" ref={ref}>
      <svg className="map__svg" ref={nearRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.experience.mapLabel}>
        <defs>
          <radialGradient id="mapGlow">
            <stop offset="0" stopColor="#fff1c4" />
            <stop offset="0.45" stopColor="#ffa94d" stopOpacity="0.65" />
            <stop offset="1" stopColor="#ff6a2b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {near && <image href={mapArt} x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid slice" />}

        {/* trilha: base apagada e traço que se desenha com a rolagem */}
        <path className="map__trail map__trail--ghost" d={TRAIL} />
        <path className="map__trail map__trail--live" d={TRAIL} pathLength="1" />
        <path className="map__trail map__trail--dots" d={TRAIL} />

        {STOPS.map((s, i) => (
          <g key={i} className="map__stop" style={{ "--at": s.at }} transform={`translate(${s.x} ${s.y})`}>
            <circle className="map__stop-glow" r="46" fill="url(#mapGlow)" />
            <circle className="map__stop-ring" r="20" />
            <circle className="map__stop-ring map__stop-ring--pulse" r="20" />
          </g>
        ))}
      </svg>

      {/* rótulos em HTML para ficarem legíveis em qualquer tamanho */}
      <ol className="map__labels">
        {STOPS.map((s, i) => (
          <li
            key={i}
            className={`map__label ${s.y > 560 ? "map__label--below" : ""}`}
            style={{ "--at": s.at, left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%` }}
          >
            <span className="map__label-when">{stops[i].when}</span>
            <span className="map__label-name">{stops[i].name}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export default JourneyMap;

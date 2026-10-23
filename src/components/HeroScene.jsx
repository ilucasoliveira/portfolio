import { useEffect, useRef, useState } from "react";
import "./HeroScene.css";

/*
 * Vida no vale de Valinor, por cima da imagem do herói (que fica parada): a água das
 * cachoeiras caindo, com espuma e névoa, a luz das Duas Árvores respirando devagar e o
 * reflexo delas tremendo no lago.
 *
 * Tudo anda só com transform e opacity (a GPU resolve sem repintar a página) e para quando o
 * herói sai da tela. Só existe a partir do tablet: no tablet, a versão simples (a água sem as
 * gotas, a névoa das quedas maiores e o reflexo dourado); no celular e com menos movimento no
 * sistema, nada é montado.
 *
 * As posições são em % da imagem (1671 x 941): o quadro .hero-scene__frame reproduz o mesmo
 * recorte do object-fit: cover da imagem, então cada efeito fica em cima da sua cachoeira,
 * árvore ou lago em qualquer tamanho de tela.
 */

const TABLET = "(min-width: 701px)";
const DESKTOP = "(min-width: 1101px)";
const STILL = "(prefers-reduced-motion: reduce)";

// a água das cachoeiras é uma camada só, recortada pela máscara tirada da pintura
// (src/assets/hero/agua-mascara.webp): aparece exatamente onde há água desenhada.
// Em cima dela, espuma na borda de cima e névoa no pé das quedas: [x, y, largura, altura]; full: só no desktop
const FOAM = [
  { box: [25.8, 58.6, 4.4, 2.2] },
  { box: [65.2, 69.8, 3.2, 1.6] },
];
const MIST = [
  { box: [24.6, 68.2, 6.6, 5.6] },
  { box: [64.4, 72.6, 4.8, 4.4] },
  { box: [40.8, 69.4, 2.6, 2.8], full: true },
  { box: [52.4, 52.4, 3, 2.6], full: true },
];

// as Duas Árvores: centro da copa e raio, em % da largura da imagem
const TREES = [
  { name: "silver", x: 71, y: 31, r: 8 },
  { name: "gold", x: 84.4, y: 33.5, r: 9 },
];

// reflexos no lago: [x, y, largura, altura]; cada faixa treme no seu ritmo
const REFLECTIONS = [
  { name: "gold", box: [83.2, 47, 5.4, 26], strips: 5 },
  { name: "silver", box: [69.6, 47.5, 3.4, 9], strips: 3, full: true },
];

const box = ([x, y, w, h]) => ({ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` });
// o mesmo, dentro do bloco da água (que começa em x 20%, y 49% da imagem), em unidades do quadro
const inWater = ([x, y, w, h]) => ({ left: `${x - 20}cqw`, top: `${y - 49}cqh`, width: `${w}cqw`, height: `${h}cqh` });

function useMatch(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);
  return matches;
}

// a cena só entra com a página assentada: fontes carregadas e um instante depois da abertura
// (quando ela termina, a barra de rolagem volta e a largura muda). Montada antes disso, a camada
// do tamanho da tela inteira se reposicionava e contava como deslocamento de layout (CLS)
const SETTLE_MS = 400;

function useSettled() {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    let timer = 0;
    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!cancelled) timer = setTimeout(() => setSettled(true), SETTLE_MS);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);
  return settled;
}

function HeroScene() {
  const tablet = useMatch(TABLET);
  const desktop = useMatch(DESKTOP);
  const still = useMatch(STILL);
  const settled = useSettled();
  const ref = useRef(null);

  // fora da tela, tudo para (as animações ficam pausadas, sem custo)
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => el.classList.toggle("is-paused", !entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [tablet, still, settled]);

  if (!tablet || still || !settled) return null;
  const show = (item) => desktop || !item.full;

  return (
    <div ref={ref} className="hero-scene" aria-hidden="true">
      <div className="hero-scene__frame">
        {/* três camadas em velocidades diferentes dão profundidade à queda: lâminas largas e
            lentas no fundo, filetes finos por cima e, no desktop, gotas brilhando */}
        <div className="hero-scene__water">
          <span className="hero-scene__flow hero-scene__flow--sheets" />
          <span className="hero-scene__flow hero-scene__flow--streaks" />
          {desktop && <span className="hero-scene__flow hero-scene__flow--drops" />}
          {/* a espuma fica dentro do recorte: só aparece onde há água na borda */}
          {FOAM.map((foam, i) => (
            <span key={i} className="hero-scene__foam" style={inWater(foam.box)} />
          ))}
        </div>
        {MIST.filter(show).map((mist, i) => (
          <span key={i} className="hero-scene__mist" style={{ ...box(mist.box), "--i": i }} />
        ))}

        {desktop &&
          TREES.map((tree) => (
            <span
              key={tree.name}
              className={`hero-scene__tree hero-scene__tree--${tree.name}`}
              style={{ left: `${tree.x}%`, top: `${tree.y}%`, width: `${tree.r * 2}%` }}
            />
          ))}

        {REFLECTIONS.filter(show).map((reflection) => (
          <div
            key={reflection.name}
            className={`hero-scene__reflection hero-scene__reflection--${reflection.name}`}
            style={box(reflection.box)}
          >
            {Array.from({ length: reflection.strips }, (_, i) => (
              <span key={i} style={{ "--i": i, "--n": reflection.strips }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroScene;

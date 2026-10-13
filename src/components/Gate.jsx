import { useLanguage } from "../context/LanguageContext";
import { useScrollProgress } from "../hooks/useScrollProgress";
import { toRunes } from "../utils/runes";
import ElvishScript from "./ElvishScript";
import rock from "../assets/gate-rock.webp";
import "./Gate.css";

/*
 * O Portão: uma porta de pedra numa parede de rocha, com desenhos de prata que
 * só aparecem ao luar. A seção fica presa enquanto se rola: as linhas se
 * desenham (colunas com luas, árvores gêmeas, coroa de estrelas, a estrela
 * central e a bigorna da forja), as runas do arco acendem uma a uma, as
 * portas se abrem e a câmera atravessa o vão: o capítulo das obras surge
 * por dentro do portão. Desenho original.
 */

const W = 600;
const H = 820;
const CX = 300;
const BASE = 780; // soleira
const ARCH_Y = 330; // centro do arco
const R_OUT = 232;
const R_IN = 196;
const DOOR_TOP = ARCH_Y - R_IN;

// inscrição do arco: palavras separadas por pontos rúnicos
const INSCRIPTION = ["lucas", "forjou", "estas", "obras"].map(toRunes).join("᛫");
const ARCH_RUNES = [...INSCRIPTION].map((char, i, all) => {
  const t = (i + 0.5) / all.length;
  const angle = Math.PI + 0.1 + t * (Math.PI - 0.2); // de uma base à outra do arco
  const r = (R_OUT + R_IN) / 2;
  return {
    char,
    x: CX + Math.cos(angle) * r,
    y: ARCH_Y + Math.sin(angle) * r,
    rot: (angle * 180) / Math.PI + 90,
    s: 0.12 + t * 0.34,
  };
});

// crescente aberto para cima (capitel das colunas)
function crescent(x, y, r) {
  return `M${x - r} ${y}A${r} ${r} 0 0 0 ${x + r} ${y}A${r * 1.35} ${r * 1.35} 0 0 1 ${x - r} ${y}Z`;
}

// estrela de quatro pontas pequena
function sparkle(x, y, r) {
  const k = r * 0.28;
  return `M${x} ${y - r}L${x + k} ${y - k}L${x + r} ${y}L${x + k} ${y + k}L${x} ${y + r}L${x - k} ${y + k}L${x - r} ${y}L${x - k} ${y - k}Z`;
}

// estrela de oito pontas com raios
function bigStar(cx, cy, r1, r2) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? r1 : r2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

function rays(cx, cy, from, to, count, offset = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + offset;
    const p = (r) => `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
    return `M${p(from)}L${p(to)}`;
  }).join("");
}

const PILLAR_L = CX - R_OUT - 22;
const PILLAR_R = CX + R_OUT + 22;
const CAP_Y = ARCH_Y - 18;

// moldura fixa: arco, colunas com luas, chave e degraus. [d, início, duração]
const FRAME_LINES = [
  [`M${CX - R_OUT} ${BASE}V${ARCH_Y}A${R_OUT} ${R_OUT} 0 0 1 ${CX + R_OUT} ${ARCH_Y}V${BASE}`, 0.02, 0.28],
  [`M${CX - R_IN} ${BASE}V${ARCH_Y}A${R_IN} ${R_IN} 0 0 1 ${CX + R_IN} ${ARCH_Y}V${BASE}`, 0.05, 0.28],
  [`M${CX - R_OUT - 10} ${ARCH_Y}A${R_OUT + 10} ${R_OUT + 10} 0 0 1 ${CX + R_OUT + 10} ${ARCH_Y}`, 0.08, 0.26],
  // colunas
  [`M${PILLAR_L - 12} ${BASE}V${CAP_Y + 14}M${PILLAR_L + 12} ${BASE}V${CAP_Y + 14}`, 0.06, 0.2],
  [`M${PILLAR_R - 12} ${BASE}V${CAP_Y + 14}M${PILLAR_R + 12} ${BASE}V${CAP_Y + 14}`, 0.06, 0.2],
  [`M${PILLAR_L - 18} ${CAP_Y + 14}h36M${PILLAR_L - 18} ${BASE - 18}h36`, 0.16, 0.08],
  [`M${PILLAR_R - 18} ${CAP_Y + 14}h36M${PILLAR_R - 18} ${BASE - 18}h36`, 0.16, 0.08],
  // luas crescentes sobre as colunas
  [crescent(PILLAR_L, CAP_Y, 20), 0.22, 0.1],
  [crescent(PILLAR_R, CAP_Y, 20), 0.22, 0.1],
  // estrias das colunas
  [`M${PILLAR_L} ${BASE - 26}V${CAP_Y + 24}`, 0.18, 0.2],
  [`M${PILLAR_R} ${BASE - 26}V${CAP_Y + 24}`, 0.18, 0.2],
  // chave do arco
  [`M${CX - 16} ${ARCH_Y - R_OUT - 4}l16-24 16 24`, 0.28, 0.08],
  // degraus
  [`M${PILLAR_L - 40} ${BASE}H${PILLAR_R + 40}M${PILLAR_L - 20} ${BASE + 16}H${PILLAR_R + 20}`, 0, 0.14],
];

// árvore esquerda (a direita é o espelho): tronco, galhos, folhas e raízes
const TREE = [
  ["M184 772C188 700 176 622 186 542S196 444 188 384", 0.12, 0.16],
  ["M198 774C200 702 190 624 199 546S206 452 198 400", 0.14, 0.16],
  ["M188 384C192 322 198 262 216 204", 0.26, 0.1],
  ["M188 384C202 334 232 304 260 270", 0.27, 0.1],
  ["M188 386C176 326 152 296 142 248", 0.27, 0.1],
  ["M186 452C162 424 142 404 130 372", 0.24, 0.1],
  ["M188 418C212 400 232 382 246 352", 0.25, 0.1],
  ["M184 772C172 758 156 766 144 778M184 772C196 760 212 766 224 778", 0.1, 0.06],
  // pontas enroladas dos galhos
  ["M216 204c6-10 16-8 14 2s-12 8-10-2", 0.36, 0.05],
  ["M260 270c8-6 16 0 10 8s-12 0-6-6", 0.37, 0.05],
  ["M142 248c-4-12 6-18 12-10s-4 12-8 4", 0.37, 0.05],
  ["M130 372c-8-6-4-16 4-12s4 10-2 8", 0.34, 0.05],
  // folhas
  ["M200 300q10-12 4-24q-10 12-4 24", 0.38, 0.05],
  ["M228 318q12-6 14-20q-14 4-14 20", 0.39, 0.05],
  ["M162 318q-12-8-10-22q12 8 10 22", 0.39, 0.05],
  ["M150 410q-12-2-18-14q14 0 18 14", 0.38, 0.05],
  ["M214 392q12-2 16-16q-14 2-16 16", 0.39, 0.05],
];

// coroa com estrelas em arco sobre a estrela central
const CROWN_Y = 222;
const CROWN = [`M272 ${CROWN_Y}l4-24 12 14 12-22 12 22 12-14 4 24ZM268 ${CROWN_Y + 7}h64`, 0.4, 0.08];
const CROWN_STARS = Array.from({ length: 7 }, (_, i) => {
  const a = Math.PI + 0.38 + (i / 6) * (Math.PI - 0.76);
  return [sparkle(CX + Math.cos(a) * 62, CROWN_Y - 6 + Math.sin(a) * 62, 7), 0.42 + i * 0.012, 0.05];
});

const STAR_Y = 352;
const CENTER = [
  [bigStar(CX, STAR_Y, 52, 13), 0.44, 0.1],
  [rays(CX, STAR_Y, 58, 98, 8, -Math.PI / 2), 0.47, 0.08],
  [rays(CX, STAR_Y, 24, 44, 8, -Math.PI / 2 + Math.PI / 8), 0.48, 0.06],
  // bigorna e martelo: a forja que guarda as obras
  ["M258 498H342L332 512H318V528H332V540H268V528H282V512H268Z", 0.5, 0.08],
  ["M326 486L356 456M346 444L366 464L374 456L354 436Z", 0.52, 0.06],
  // costura entre as portas
  [`M${CX} ${DOOR_TOP}V${BASE}`, 0.3, 0.16],
];

const CENTER_LINES = [...CENTER, CROWN, ...CROWN_STARS];

// cada traço vai em dobro: um halo largo e translúcido por baixo (o brilho) e a linha fina por cima.
// Fica parecido com um desfoque, mas sem filtro, então a rolagem não pesa.
function Lines({ list }) {
  return list.flatMap(([d, s, len], i) => {
    const style = { "--s": s, "--len": len };
    return [
      <path key={`h${i}`} className="gate__halo" d={d} pathLength="1" style={style} />,
      <path key={`l${i}`} d={d} pathLength="1" style={style} />,
    ];
  });
}

function Ghost({ list }) {
  return list.map(([d], i) => <path key={i} d={d} />);
}

// uma folha da porta: a mesma gravura inteira, recortada pela metade que lhe cabe
function Door({ side }) {
  const left = side === "l";
  const x = left ? CX - R_IN : CX;
  const shape = left
    ? `M${CX - R_IN} ${BASE}V${ARCH_Y}A${R_IN} ${R_IN} 0 0 1 ${CX} ${DOOR_TOP}V${BASE}Z`
    : `M${CX} ${DOOR_TOP}A${R_IN} ${R_IN} 0 0 1 ${CX + R_IN} ${ARCH_Y}V${BASE}H${CX}Z`;

  return (
    <div className={`gate__door gate__door--${side}`}>
      <svg viewBox={`${x} ${DOOR_TOP} ${R_IN} ${BASE - DOOR_TOP}`} preserveAspectRatio="none">
        <path className="gate__door-stone" d={shape} />
        {/* cada folha desenha só a sua árvore (a outra ficaria fora do recorte) e o centro, que é dividido */}
        <g className="gate__stone">
          <Ghost list={CENTER_LINES} />
          <g transform={left ? undefined : `translate(${W} 0) scale(-1 1)`}>
            <Ghost list={TREE} />
          </g>
        </g>
        <g className="gate__lines">
          <Lines list={CENTER_LINES} />
          <g transform={left ? undefined : `translate(${W} 0) scale(-1 1)`}>
            <Lines list={TREE} />
          </g>
        </g>
        <path className="gate__door-shade" d={shape} />
      </svg>
    </div>
  );
}

function Gate() {
  const { t } = useLanguage();
  // fase atual no atributo data-phase: o CSS tira da tela (display: none) as camadas que
  // não estão em uso, para o navegador não pintar luzes e véus invisíveis a cada quadro
  const ref = useScrollProgress("pin", (p) => {
    const el = ref.current;
    if (!el) return;
    const phase = p < 0.5 ? "draw" : p < 0.62 ? "open" : p < 0.8 ? "enter" : "inside";
    if (el.dataset.phase !== phase) el.dataset.phase = phase;
  });

  return (
    <section className="gate" ref={ref} data-phase="draw" aria-labelledby="gate-title">
      <div className="gate__stage">
        <div className="gate__light" aria-hidden="true" />

        {/* lado de dentro: luz caindo do alto e o arco emoldurando a tela */}
        <div className="gate__vault-glow" aria-hidden="true" />
        <svg className="gate__vault" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className="gate__vault-shade" fillRule="evenodd" d="M0 0H100V100H0ZM8 100V38A42 32 0 0 1 92 38V100Z" />
          <path d="M8 100V38A42 32 0 0 1 92 38V100" />
          <path d="M11 100V39A39 29 0 0 1 89 39V100" />
          <path d="M48.4 7.6L50 5.2L51.6 7.6" />
        </svg>

        <div className="gate__frame" style={{ "--rock": `url(${rock})` }}>
          {/* parede de rocha onde a porta foi talhada (camada própria: o luar só muda a opacidade) */}
          <div className="gate__wall" aria-hidden="true" />

          <svg className="gate__svg gate__svg--wall" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <defs>
              <radialGradient id="gateDoorway" cx="50%" cy="78%" r="62%">
                <stop offset="0" stopColor="#fff6da" />
                <stop offset="0.3" stopColor="#ffd98c" stopOpacity="0.85" />
                <stop offset="0.7" stopColor="#a8682c" stopOpacity="0.4" />
                <stop offset="1" stopColor="#2a1a0c" stopOpacity="0.25" />
              </radialGradient>
            </defs>

            {/* vão da porta: a luz das obras aparece quando as folhas se abrem */}
            <path
              className="gate__doorway"
              d={`M${CX - R_IN} ${BASE}V${ARCH_Y}A${R_IN} ${R_IN} 0 0 1 ${CX + R_IN} ${ARCH_Y}V${BASE}Z`}
              fill="url(#gateDoorway)"
            />
          </svg>

          {/* folhas da porta: giram para dentro levando a gravura junto */}
          <div className="gate__doors" aria-hidden="true">
            <Door side="l" />
            <Door side="r" />
          </div>

          <svg className="gate__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <g className="gate__stone">
              <Ghost list={FRAME_LINES} />
            </g>
            <g className="gate__lines">
              <Lines list={FRAME_LINES} />
            </g>

            <g className="gate__runes">
              {ARCH_RUNES.map((r, i) => (
                <text
                  key={i}
                  x={r.x}
                  y={r.y}
                  transform={`rotate(${r.rot} ${r.x} ${r.y})`}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ "--s": r.s }}
                >
                  {r.char}
                </text>
              ))}
            </g>
          </svg>
        </div>

        <div className="gate__flash" aria-hidden="true" />

        <div className="gate__caption">
          <p className="gate__eyebrow">{t.gate.eyebrow}</p>
          <h2 className="gate__title" id="gate-title">
            {t.gate.title}
          </h2>
          <ElvishScript className="gate__elvish elvish--moon" text="o que foi forjado aguarda alem" />
          <p className="gate__line">{t.gate.line}</p>
        </div>
      </div>
    </section>
  );
}

export default Gate;

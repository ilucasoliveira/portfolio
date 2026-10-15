import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { toRunes } from "../utils/runes";
import ElvishScript from "./ElvishScript";
// texturas de pedra (geradas no ChatGPT, de frente e sem símbolos): a porta em retrato,
// na proporção da placa das duas folhas (~0,62), e a parede em paisagem. Comprimidas com um
// desfoque quase invisível, que corta o grão fino e deixa cada uma com uns 30 KB.
import wallStone from "../assets/gate-wall.webp";
import doorStone from "../assets/gate-door.webp";
import "./Gate.css";

/*
 * O Portão: uma porta de pedra numa parede de rocha, com desenhos de prata que
 * só aparecem ao luar. É a entrada da Oficina e abre sozinho, cobrindo a tela:
 * as linhas se desenham (colunas com luas, árvores gêmeas, coroa de estrelas,
 * a estrela central e a bigorna da forja), as runas do arco acendem uma a uma,
 * as portas se abrem e a câmera atravessa o vão de luz. Quando a luz baixa,
 * a página aparece por trás: o salão dos anões. Desenho original.
 *
 * O CSS anima tudo a partir de --p (0 a 1); aqui um relógio escreve --p.
 * Na primeira visita da sessão a abertura é lenta, para os detalhes serem vistos;
 * nas seguintes é curta e começa com as linhas quase desenhadas. O botão Pular
 * (ou Esc) encerra na hora.
 */

// linhas do tempo da abertura: [milissegundos, --p]
// primeira visita (~8,4 s): desenho sem pressa, pausa no título, portas abrindo
// devagar e um momento parado olhando o túnel antes de entrar na luz
const TIMELINE_FIRST = [
  [0, 0],
  [3400, 0.46], // linhas desenhadas e runas acesas
  [4600, 0.5], // pausa para ler o título
  [6000, 0.63], // portas abertas
  [7200, 0.635], // parado diante do túnel
  [8400, 0.84], // atravessando a luz
];
// visitas seguintes na mesma sessão (~1,9 s, começando em REPEAT_START)
const TIMELINE_REPEAT = [
  [0, 0],
  [1400, 0.46],
  [1900, 0.5],
  [2500, 0.64],
  [3100, 0.84],
];
const REPEAT_START = 1200;
const FADE_MS = 600;
const SEEN_KEY = "gate-seen";

function progressAt(timeline, ms) {
  for (let i = 1; i < timeline.length; i++) {
    const [t1, p1] = timeline[i];
    const [t0, p0] = timeline[i - 1];
    if (ms <= t1) {
      const k = (ms - t0) / (t1 - t0);
      // suaviza cada trecho (começa e termina devagar)
      return p0 + (p1 - p0) * (k * k * (3 - 2 * k));
    }
  }
  return timeline[timeline.length - 1][1];
}

function phaseOf(p) {
  return p < 0.5 ? "draw" : p < 0.62 ? "open" : p < 0.8 ? "enter" : "inside";
}

function wasSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // sem sessionStorage, a abertura só fica inteira toda vez
  }
}

const W = 600;
const H = 820;
const CX = 300;
const BASE = 780; // soleira
const ARCH_Y = 330; // centro do arco
const R_OUT = 232;
const R_IN = 196;
const DOOR_TOP = ARCH_Y - R_IN;

// túnel atrás das portas: as paredes convergem para o ponto de fuga e terminam
// numa abertura menor, de onde vem a luz da forja
const VP_Y = 560; // altura do ponto de fuga (linha dos olhos)
const K = 0.7; // tamanho da abertura do fundo em relação ao vão
const IN_L = CX - R_IN * K;
const IN_R = CX + R_IN * K;
const IN_R_ARC = R_IN * K;
const IN_ARCH_Y = VP_Y + (ARCH_Y - VP_Y) * K;
const IN_BASE = VP_Y + (BASE - VP_Y) * K;
const OUT_L = CX - R_IN;
const OUT_R = CX + R_IN;

const TUNNEL = {
  left: `M${OUT_L} ${ARCH_Y}L${IN_L} ${IN_ARCH_Y}V${IN_BASE}L${OUT_L} ${BASE}Z`,
  right: `M${OUT_R} ${ARCH_Y}L${IN_R} ${IN_ARCH_Y}V${IN_BASE}L${OUT_R} ${BASE}Z`,
  floor: `M${OUT_L} ${BASE}H${OUT_R}L${IN_R} ${IN_BASE}H${IN_L}Z`,
  ceiling: `M${OUT_L} ${ARCH_Y}A${R_IN} ${R_IN} 0 0 1 ${OUT_R} ${ARCH_Y}L${IN_R} ${IN_ARCH_Y}A${IN_R_ARC} ${IN_R_ARC} 0 0 0 ${IN_L} ${IN_ARCH_Y}Z`,
  far: `M${IN_L} ${IN_BASE}V${IN_ARCH_Y}A${IN_R_ARC} ${IN_R_ARC} 0 0 1 ${IN_R} ${IN_ARCH_Y}V${IN_BASE}Z`,
};

// raios de luz: nascem finos no fundo do túnel e se abrem em leque até a soleira
const RAY_Y = IN_ARCH_Y + 60;
const RAYS = [
  `M${CX - 22} ${RAY_Y}L${CX - 14} ${RAY_Y}L${CX - 60} ${BASE}L${CX - 150} ${BASE}Z`,
  `M${CX + 12} ${RAY_Y}L${CX + 20} ${RAY_Y}L${CX + 160} ${BASE}L${CX + 70} ${BASE}Z`,
  `M${CX - 4} ${RAY_Y - 10}L${CX + 4} ${RAY_Y - 10}L${CX + 30} ${BASE}L${CX - 30} ${BASE}Z`,
];

// poeira suspensa na luz (posições fixas: o desenho é sempre o mesmo)
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  cx: IN_L + 10 + ((i * 53) % (IN_R - IN_L - 20)),
  cy: IN_ARCH_Y + 40 + ((i * 89) % (BASE - IN_ARCH_Y - 70)),
  r: 0.9 + (i % 3) * 0.5,
  style: {
    "--dx": `${((i * 23) % 30) - 15}px`,
    animationDuration: `${(4.5 + ((i * 0.7) % 3)).toFixed(1)}s`,
    animationDelay: `${(-((i * 0.9) % 5)).toFixed(1)}s`,
  },
}));

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
        <defs>
          <clipPath id={`gate-clip-${side}`}>
            <path d={shape} />
          </clipPath>
          {/* luz da forja batendo na face da porta: mais forte na borda que se abre */}
          <linearGradient id={`gate-lit-${side}`} gradientUnits="userSpaceOnUse" x1={left ? OUT_L : OUT_R} y1="0" x2={CX} y2="0">
            <stop offset="0" stopColor="#ffb860" stopOpacity="0.04" />
            <stop offset="1" stopColor="#ffc879" stopOpacity="0.42" />
          </linearGradient>
        </defs>
        <path className="gate__door-stone" d={shape} />
        {/* a mesma placa de pedra para as duas folhas: cada uma mostra a sua metade */}
        <image
          className="gate__door-tex"
          href={doorStone}
          x={OUT_L}
          y={DOOR_TOP}
          width={R_IN * 2}
          height={BASE - DOOR_TOP}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#gate-clip-${side})`}
        />
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
        <path className="gate__door-lit" d={shape} fill={`url(#gate-lit-${side})`} />
      </svg>
    </div>
  );
}

// onReveal: a luz começou a baixar (a página aparece por trás); onDone: o portão saiu da tela
function Gate({ onReveal, onDone }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const [leaving, setLeaving] = useState(false);
  const finish = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const seen = wasSeen();
    const timeline = seen ? TIMELINE_REPEAT : TIMELINE_FIRST;
    const offset = seen ? REPEAT_START : 0;
    const end = timeline[timeline.length - 1][0];
    let frame = 0;
    let timer = 0;
    let started = 0;
    let done = false;

    // a página não rola por trás enquanto o portão abre
    document.documentElement.classList.add("gate-open");

    function leave() {
      if (done) return;
      done = true;
      cancelAnimationFrame(frame);
      clearInterval(wait);
      markSeen();
      setLeaving(true);
      onReveal?.();
      document.documentElement.classList.remove("gate-open");
      timer = setTimeout(() => onDone?.(), FADE_MS);
    }
    finish.current = leave;

    function tick(now) {
      if (!started) started = now;
      const ms = now - started + offset;
      const p = progressAt(timeline, Math.min(ms, end));
      el.style.setProperty("--p", p.toFixed(4));
      const phase = phaseOf(p);
      if (el.dataset.phase !== phase) el.dataset.phase = phase;
      if (ms >= end) leave();
      else frame = requestAnimationFrame(tick);
    }
    // se a abertura do site (a cortina da primeira visita) estiver tocando, o portão espera
    // ela começar a se abrir: assim a cortina se parte e revela o portão se desenhando
    let wait = 0;
    if (document.querySelector(".intro--play")) {
      wait = setInterval(() => {
        if (document.querySelector(".intro--play")) return;
        clearInterval(wait);
        frame = requestAnimationFrame(tick);
      }, 100);
    } else {
      frame = requestAnimationFrame(tick);
    }

    function onKey(event) {
      if (event.key === "Escape") leave();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(wait);
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("gate-open");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      className={`gate ${leaving ? "gate--leaving" : ""}`}
      ref={ref}
      data-phase="draw"
      aria-labelledby="gate-title"
    >
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

        <div className="gate__frame" style={{ "--rock": `url(${wallStone})` }}>
          {/* parede de rocha onde a porta foi talhada (camada própria: o luar só muda a opacidade) */}
          <div className="gate__wall" aria-hidden="true" />

          <svg className="gate__svg gate__svg--wall" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <defs>
              <pattern id="gateStone" patternUnits="userSpaceOnUse" width={R_IN * 2} height={BASE - DOOR_TOP}>
                <image href={doorStone} width={R_IN * 2} height={BASE - DOOR_TOP} preserveAspectRatio="xMidYMid slice" />
              </pattern>
              {/* o fundo do túnel: a luz da forja */}
              <radialGradient id="gateFar" cx="50%" cy="72%" r="70%">
                <stop offset="0" stopColor="#fff6da" />
                <stop offset="0.35" stopColor="#ffd98c" stopOpacity="0.9" />
                <stop offset="0.8" stopColor="#c27a32" stopOpacity="0.55" />
                <stop offset="1" stopColor="#5a3214" stopOpacity="0.5" />
              </radialGradient>
              {/* cada superfície do túnel: escura na boca, iluminada perto do fundo */}
              <linearGradient id="gateLitL" gradientUnits="userSpaceOnUse" x1={OUT_L} y1="0" x2={IN_L} y2="0">
                <stop offset="0" stopColor="#070504" stopOpacity="0.88" />
                <stop offset="1" stopColor="#ffaa55" stopOpacity="0.32" />
              </linearGradient>
              <linearGradient id="gateLitR" gradientUnits="userSpaceOnUse" x1={OUT_R} y1="0" x2={IN_R} y2="0">
                <stop offset="0" stopColor="#070504" stopOpacity="0.88" />
                <stop offset="1" stopColor="#ffaa55" stopOpacity="0.32" />
              </linearGradient>
              <linearGradient id="gateLitFloor" gradientUnits="userSpaceOnUse" x1="0" y1={BASE} x2="0" y2={IN_BASE}>
                <stop offset="0" stopColor="#ffbf73" stopOpacity="0.22" />
                <stop offset="1" stopColor="#ffd08a" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="gateLitCeil" gradientUnits="userSpaceOnUse" x1="0" y1={DOOR_TOP} x2="0" y2={IN_ARCH_Y}>
                <stop offset="0" stopColor="#060404" stopOpacity="0.92" />
                <stop offset="1" stopColor="#ff9f4a" stopOpacity="0.26" />
              </linearGradient>
              {/* luz que sai pela soleira e se espalha no chão em frente */}
              <linearGradient id="gateSpill" gradientUnits="userSpaceOnUse" x1="0" y1={BASE} x2="0" y2={BASE + 90}>
                <stop offset="0" stopColor="#ffc778" stopOpacity="0.42" />
                <stop offset="1" stopColor="#ffc778" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gateRay" gradientUnits="userSpaceOnUse" x1="0" y1={RAY_Y - 10} x2="0" y2={BASE}>
                <stop offset="0" stopColor="#fff1d0" stopOpacity="0" />
                <stop offset="0.3" stopColor="#fff1d0" stopOpacity="0.2" />
                <stop offset="1" stopColor="#ffd59a" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* vão da porta: um túnel de pedra que leva à luz das obras */}
            <g className="gate__tunnel">
              {/* base opaca: a pedra da parede não aparece através da luz */}
              <path d={TUNNEL.far} fill="#3a2410" />
              <path d={TUNNEL.far} fill="url(#gateFar)" />
              {[
                [TUNNEL.left, "gateLitL"],
                [TUNNEL.right, "gateLitR"],
                [TUNNEL.floor, "gateLitFloor"],
                [TUNNEL.ceiling, "gateLitCeil"],
              ].map(([d, lit]) => (
                <g key={lit}>
                  <path d={d} fill="url(#gateStone)" />
                  <path d={d} fill={`url(#${lit})`} />
                </g>
              ))}
              <path className="gate__spill" d={`M${OUT_L} ${BASE}H${OUT_R}L${W + 40} ${BASE + 90}H-40Z`} fill="url(#gateSpill)" />
              <g className="gate__rays">
                {RAYS.map((d, i) => (
                  <path key={i} d={d} fill="url(#gateRay)" style={{ animationDelay: `${-i * 1.3}s` }} />
                ))}
              </g>
              <g className="gate__dust">
                {MOTES.map((m, i) => (
                  <circle key={i} cx={m.cx} cy={m.cy} r={m.r} style={m.style} />
                ))}
              </g>
            </g>
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

        <button type="button" className="gate__skip" onClick={() => finish.current?.()}>
          {t.gate.skip}
        </button>
      </div>
    </section>
  );
}

export default Gate;

import { useId } from "react";
import { useInView } from "../hooks/useInView";
import "./ElvishScript.css";

/*
 * Escrita élfica de desenho próprio: cada letra vira um glifo feito de haste,
 * bojos e ganchos (inspirado no formato de escritas caligráficas antigas, sem
 * copiar nenhuma fonte). As vogais viram sinais sobre o glifo anterior.
 * Grade de cada glifo: topo 1, meio 7, base 14, fundo 19.
 */

const STEM = { n: "M2 7v7", up: "M2 1v13", down: "M2 7v12" };
const BOW = "M2 7.5c7-1.6 7 7.6 0 6";
const BOW2 = "M5.4 7.5c7-1.6 7 7.6 0 6";
const HOOK = "M3 13.6C.6 8 9.4 4.6 9.2 10.6";
const OPEN = "M2 14c0-5 3-7 6-7 3.2 0 3.6 4.2.8 4.6";
const WAVE = "M1 10.5c2-3 4 3 6 0s4 3 6 0";
const LOOP = "M7 14C1 14 1 7 6 7c4 0 4 5 1 5";

// consoantes: lista de traços e largura do glifo
const GLYPHS = {
  b: [[STEM.n, BOW, BOW2], 13],
  c: [[STEM.up, BOW], 10],
  d: [[STEM.n, BOW, BOW2], 13],
  f: [[STEM.up, BOW, BOW2], 13],
  g: [[STEM.down, BOW, BOW2], 13],
  h: [[HOOK, "M9.2 10.6V19"], 11],
  j: [[STEM.down, BOW], 10],
  k: [[STEM.up, BOW, BOW2], 13],
  l: [[OPEN], 11],
  m: [[STEM.n, BOW, BOW2, "M8.6 7.5c5-1 5 6.6 0 6"], 15],
  n: [[STEM.n, BOW], 10],
  p: [[STEM.down, BOW], 10],
  q: [[STEM.down, BOW, BOW2], 13],
  r: [[HOOK], 11],
  s: [[LOOP], 10],
  t: [[STEM.n, BOW], 10],
  v: [[STEM.up, BOW], 10],
  w: [[WAVE], 14],
  x: [[STEM.up, BOW, "M2 14l7 5"], 11],
  y: [["M2 7c0 4 6 4 6 0", "M8 7v12"], 10],
  z: [[LOOP, "M7 12c2 2 2 5-1 7"], 11],
};

// vogais: sinais acima da letra anterior (ou de um suporte curto)
const TEHTA = {
  a: ["M2.5 4.4h.1", "M5 2.6h.1", "M7.5 4.4h.1"],
  e: ["M3.4 5.2l3.8-3"],
  i: ["M5 3.6h.1"],
  o: ["M3 4.6c0-2.6 4.2-2.6 4.2 0"],
  u: ["M3 2.2c0 2.6 4.2 2.6 4.2 0"],
};
const CARRIER = [["M5 9v5"], 9];

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// transforma o texto em glifos posicionados (x, largura, traços)
function layout(text) {
  const glyphs = [];
  let x = 0;

  for (const ch of normalize(text)) {
    if (ch === " ") {
      x += 7;
      continue;
    }
    if (TEHTA[ch]) {
      const last = glyphs[glyphs.length - 1];
      // vogal após consoante sem sinal: vai em cima dela; senão, usa um suporte
      if (last && !last.vowel && !last.carrier && x - (last.x + last.w) < 1) {
        last.strokes.push(...TEHTA[ch].map((d) => ({ d, tehta: true, shift: last.w / 2 - 5 })));
        last.vowel = true;
      } else {
        glyphs.push({
          x,
          w: CARRIER[1],
          carrier: true,
          vowel: true,
          strokes: [...CARRIER[0].map((d) => ({ d })), ...TEHTA[ch].map((d) => ({ d, tehta: true, shift: -0.5 }))],
        });
        x += CARRIER[1];
      }
      continue;
    }
    const def = GLYPHS[ch];
    if (!def) continue;
    glyphs.push({ x, w: def[1], strokes: def[0].map((d) => ({ d })) });
    x += def[1];
  }

  return { glyphs, width: Math.max(x, 1) };
}

function Strokes({ glyph, startIndex, gradientId }) {
  return glyph.strokes.map((s, k) => (
    <path
      key={k}
      d={s.d}
      transform={s.tehta ? `translate(${s.shift} 0)` : undefined}
      pathLength="1"
      stroke={`url(#${gradientId})`}
      style={{ "--k": startIndex + k }}
    />
  ));
}

/**
 * mode="line": uma linha de inscrição. mode="ring": inscrição em volta de um círculo.
 * lit: força o acendimento (sem esperar entrar na tela).
 */
function ElvishScript({ text, mode = "line", className = "", lit, radius = 100, size = 1, maxScale = 2.4, label }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const gradientId = useId().replace(/:/g, "");
  const circumference = 2 * Math.PI * radius;
  // no anel, repete o texto até fechar a volta e espalha os glifos por igual: o círculo sempre fica completo
  let source = text;
  if (mode === "ring") {
    const once = layout(text).width + 14;
    const copies = Math.max(1, Math.round((circumference * 0.96) / (once * maxScale)));
    source = Array.from({ length: copies }, () => text).join("  ");
  }
  const { glyphs, width } = layout(source);
  const on = lit ?? inView;
  let counter = 0;

  const defs = (
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
        <stop offset="0" stopColor="#ffe9a8" />
        <stop offset="0.5" stopColor="#ffb347" />
        <stop offset="1" stopColor="#ff7a2e" />
      </linearGradient>
    </defs>
  );

  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  if (mode === "ring") {
    const scale = Math.min((circumference * 0.96) / width, maxScale);
    // folga do fim até o começo igual a um espaço entre palavras
    const total = width + 14;
    const box = radius + 30;

    return (
      <svg
        ref={ref}
        className={`elvish elvish--ring ${on ? "is-lit" : ""} ${className}`}
        viewBox={`${-box} ${-box} ${box * 2} ${box * 2}`}
        style={{ "--n": glyphs.reduce((sum, g) => sum + g.strokes.length, 0) }}
        {...a11y}
      >
        {defs}
        {glyphs.map((g, i) => {
          const angle = ((g.x + g.w / 2) / total) * 360 - 90;
          const first = counter;
          counter += g.strokes.length;
          return (
            <g
              key={i}
              transform={`rotate(${angle}) translate(${radius} 0) rotate(90) scale(${scale}) translate(${-g.w / 2} -14)`}
            >
              <Strokes glyph={g} startIndex={first} gradientId={gradientId} />
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <svg
      ref={ref}
      className={`elvish elvish--line ${on ? "is-lit" : ""} ${className}`}
      viewBox={`-2 0 ${width + 4} 20`}
      style={{ "--w": width * size }}
      {...a11y}
    >
      {defs}
      {glyphs.map((g, i) => {
        const first = counter;
        counter += g.strokes.length;
        return (
          <g key={i} transform={`translate(${g.x} 0)`}>
            <Strokes glyph={g} startIndex={first} gradientId={gradientId} />
          </g>
        );
      })}
    </svg>
  );
}

export default ElvishScript;

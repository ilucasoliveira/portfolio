import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { GATE_DENSITIES, GATE_LAYERS } from "../data/gate";
import { createGateLight } from "./gateLight";
import ElvishScript from "./ElvishScript";
import lightMap from "../assets/gate-moria/luz.webp";
import "./Gate.css";

/*
 * O Portão: as Portas de Durin, a entrada da Oficina. Cobre a tela e abre sozinho:
 * 1. a luz anda pelas linhas de prata, das raízes das árvores até as estrelas e as runas
 *    do arco (WebGL, src/components/gateLight.js), e o título aparece embaixo;
 * 2. as folhas giram para dentro e uma luz quente acende no vão e transborda pela soleira;
 * 3. a câmera entra na luz, um clarão cobre a tela e a página aparece por trás.
 *
 * A arte vem em três camadas (src/data/gate.js): a moldura parada por cima e as duas folhas,
 * que giram com rotateY na mesma perspectiva em que a arte foi projetada. Um relógio escreve
 * transform e opacity nas poucas peças que mudam; o React não muda de estado durante a abertura.
 * Na primeira visita da sessão a abertura é média; nas seguintes, curta e com as linhas já
 * meio acesas. O botão Pular (ou Esc) encerra na hora.
 */

// trechos em milissegundos; draw: a luz percorre as linhas (de drawFrom até 1)
const TIMELINE_FIRST = { drawEnd: 2000, drawFrom: 0, openStart: 2300, openEnd: 3500, enterEnd: 4300 };
const TIMELINE_REPEAT = { drawEnd: 1000, drawFrom: 0.4, openStart: 1150, openEnd: 2250, enterEnd: 2950 };
const FADE_MS = 600;
const GENTLE_HOLD_MS = 900; // menos movimento: as linhas acendem, mas o portão não abre; depois se dissolve
const GENTLE_FADE_MS = 1200;
const LOAD_LIMIT = 2500; // se as imagens não chegarem até aqui, a Oficina aparece sem o portão
const SEEN_KEY = "gate-seen";

// url de cada versão: gate-moria/<camada>-<densidade>.webp
const FILES = import.meta.glob("../assets/gate-moria/*-*x.webp", { eager: true, import: "default" });
const fileOf = (name, density) => FILES[`../assets/gate-moria/${name}-${density}.webp`];

const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);

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

// posição de cada camada no quadro, em % da arte original (1024 x 1536)
function place([x0, y0, x1, y1]) {
  return {
    left: `${(x0 / 1024) * 100}%`,
    top: `${(y0 / 1536) * 100}%`,
    width: `${((x1 - x0) / 1024) * 100}%`,
    height: `${((y1 - y0) / 1536) * 100}%`,
  };
}

function Layer({ name, box, widths, sizes }) {
  return (
    <img
      className={`gate__layer gate__layer--${name}`}
      src={fileOf(name, "1x")}
      srcSet={GATE_DENSITIES.map((d, i) => `${fileOf(name, d)} ${widths[i]}w`).join(", ")}
      sizes={sizes}
      style={place(box)}
      alt=""
      decoding="async"
      fetchPriority="high"
      draggable="false"
    />
  );
}

// a cortina de abertura do site (primeira visita) termina antes de o portão começar
function introDone() {
  return new Promise((resolve) => {
    const check = () => (document.querySelector(".intro--play") ? setTimeout(check, 100) : resolve());
    check();
  });
}

// onReveal: a luz começou a baixar (a página aparece por trás); onDone: o portão saiu da tela
// gentle: versão para quem pediu menos movimento no sistema
function Gate({ onReveal, onDone, gentle = false }) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const canvasRef = useRef(null);
  const mapRef = useRef(null);
  const [leaving, setLeaving] = useState(false);
  const [captionLit, setCaptionLit] = useState(false);
  const finish = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const timeline = wasSeen() ? TIMELINE_REPEAT : TIMELINE_FIRST;
    const timers = [];
    let frame = 0;
    let light = null;
    let done = false;

    // a página não rola por trás enquanto o portão está na tela
    document.documentElement.classList.add("gate-open");

    function stopLight() {
      light?.dispose();
      light = null;
      el.dataset.light = "off";
    }

    function leave() {
      if (done) return;
      done = true;
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      stopLight();
      markSeen();
      setLeaving(true);
      onReveal?.();
      document.documentElement.classList.remove("gate-open");
      timers.push(setTimeout(() => onDone?.(), gentle ? GENTLE_FADE_MS : FADE_MS));
    }
    finish.current = leave;

    // o relógio escreve transform e opacity direto em quem muda (variáveis no .gate seriam
    // herdadas por tudo lá dentro e o navegador recalcularia o estilo da cena inteira a cada quadro)
    const node = (selector) => el.querySelector(selector);
    const parts = {
      sky: node(".gate__sky"),
      stage: node(".gate__stage"),
      left: node(".gate__layer--folha-esquerda"),
      right: node(".gate__layer--folha-direita"),
      inside: node(".gate__inside"),
      glow: node(".gate__glow"),
      spill: node(".gate__spill"),
      lines: canvasRef.current,
      flash: node(".gate__flash"),
      caption: node(".gate__caption"),
    };
    const written = new Map();
    const write = (part, prop, value) => {
      const key = `${part}.${prop}`;
      if (written.get(key) === value) return;
      written.set(key, value);
      parts[part].style[prop] = value;
    };
    const num = (v) => v.toFixed(3);

    function play() {
      const { drawEnd, drawFrom, openStart, openEnd, enterEnd } = timeline;
      let start = 0;
      let captionOn = false;
      function tick(now) {
        start ||= now;
        const ms = now - start;
        const draw = drawFrom + (1 - drawFrom) * clamp(ms / drawEnd);
        const open = gentle ? 0 : smooth(clamp((ms - openStart) / (openEnd - openStart)));
        const enter = gentle ? 0 : clamp((ms - openEnd) / (enterEnd - openEnd));
        const caption = clamp((draw - 0.55) / 0.3) * clamp(1 - open * 1.6);

        if (light) {
          light.draw(draw);
          // o desenho entra devagar por cima do portão apagado
          write("lines", "opacity", num(clamp(ms / 300)));
          if (draw >= 1) stopLight(); // o último quadro é igual às camadas: elas assumem
        }
        write("sky", "opacity", num(draw));
        write("caption", "opacity", num(caption));
        write("caption", "transform", `translateY(${num((1 - caption) * 16)}px)`);
        write("left", "transform", `rotateY(${num(open * 88)}deg)`);
        write("right", "transform", `rotateY(${num(open * -88)}deg)`);
        write("inside", "opacity", num(open));
        write("spill", "opacity", num(open));
        write("glow", "opacity", num(open * 0.85));
        // a câmera avança para o vão e atravessa a luz
        write("stage", "transform", `scale(${num(1 + open * 0.06 + enter * enter * 8)})`);
        write("stage", "opacity", num(1 - clamp((enter - 0.75) / 0.25)));
        write("flash", "opacity", num(clamp((enter - 0.25) / 0.5)));

        if (!captionOn && draw > 0.6) {
          captionOn = true;
          setCaptionLit(true);
        }
        if (gentle && ms >= drawEnd + GENTLE_HOLD_MS) return leave();
        if (!gentle && ms >= enterEnd) return leave();
        frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }

    const layers = GATE_LAYERS.map((layer) => ({ ...layer, img: node(`.gate__layer--${layer.name}`) }));
    const decoded = Promise.all([...layers.map((l) => l.img.decode()), mapRef.current.decode()]);
    const tooSlow = new Promise((_, reject) => timers.push(setTimeout(() => reject(new Error("lento")), LOAD_LIMIT)));

    Promise.race([decoded, tooSlow])
      .then(() => {
        // as imagens chegaram: o portão aparece apagado enquanto a luz se prepara
        if (!done) el.dataset.light = "dim";
      })
      .then(introDone)
      .then(
        async () => {
          if (done) return;
          try {
            light = await createGateLight(canvasRef.current, layers, mapRef.current);
          } catch {
            light = null; // shader que não compila: as linhas aparecem já acesas
          }
          if (done) return light?.dispose();
          el.dataset.light = light ? "on" : "off";
          play();
        },
        // imagem que falhou ou demorou: a Oficina aparece direto, sem o portão
        leave,
      );

    function onKey(event) {
      if (event.key === "Escape") leave();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      done = true;
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      light?.dispose();
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("gate-open");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // data-light: wait (imagens a caminho), dim (portão apagado enquanto a luz se prepara),
  // on (a luz desenha as linhas), off (acabou, ou o navegador não tem WebGL)
  return (
    <section
      ref={ref}
      className={`gate night-zone ${gentle ? "gate--gentle" : ""} ${leaving ? "gate--leaving" : ""}`}
      data-light="wait"
      aria-labelledby="gate-title"
    >
      <div className="gate__sky" aria-hidden="true" />

      <div className="gate__stage" aria-hidden="true">
        {/* o que se vê pelo vão quando as folhas abrem: a luz da forja */}
        <div className="gate__inside" />
        {GATE_LAYERS.map((layer) => (
          <Layer key={layer.name} {...layer} />
        ))}
        {/* a luz saindo pelo vão, por cima da pedra, e derramando no chão em frente */}
        <div className="gate__glow" />
        <div className="gate__spill" />
        <canvas className="gate__lines" ref={canvasRef} />
        <img className="gate__map" ref={mapRef} src={lightMap} alt="" decoding="async" fetchPriority="low" />
      </div>

      <div className="gate__flash" aria-hidden="true" />

      <div className="gate__caption">
        <p className="gate__eyebrow">{t.gate.eyebrow}</p>
        <h2 className="gate__title" id="gate-title">
          {t.gate.title}
        </h2>
        <ElvishScript className="gate__elvish elvish--moon" text="o que foi forjado aguarda alem" lit={captionLit} />
        <p className="gate__line">{t.gate.line}</p>
      </div>

      <button type="button" className="gate__skip" onClick={() => finish.current?.()}>
        {t.gate.skip}
      </button>
    </section>
  );
}

export default Gate;

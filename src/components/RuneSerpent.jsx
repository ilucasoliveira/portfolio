import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../utils/motion";
import {
  HELIX,
  RUNE_COUNT,
  collectGeometry,
  sampleCurve,
} from "../utils/serpentPath";
import "./RuneSerpent.css";

const RUNES = [..."ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒ"].slice(0, RUNE_COUNT);
const HEAD_VIEWPORT_RATIO = 0.62;
const GATHER_DISTANCE = 260;
const LUT_STEP = 3;
const REBUILD_DELAY_MS = 200;
const SIZE_TOLERANCE = 2;
const MIN_SCROLL_PER_PX = 0.35;
const END_RAMP = 0.6;
const FOLLOW_SPEED = 9;
const BACK_OPACITY = 0.35;
const TAIL_FADE = 0.5;
const ARRIVED_CLASS = "rune-serpent--arrived";

// geometria do desenho do portão (mesmo viewBox de Gate.jsx: 600 x 820)
const GATE_W = 600;
const GATE_H = 820;
const GATE_CX = 300;
const GATE_ARCH_Y = 330;
const GATE_RING = 262; // um pouco fora do arco externo (230)
const GATE_FOOT = 640; // até onde as runas descem pelas colunas
const GATE_SUCK_FROM = 0.6; // quando as portas começam a abrir
const GATE_SUCK_SPAN = 0.16;
const GATE_RELEASE = 0.9;
const AWAKE_CLASS = "is-awake";

const BURST = RUNES.map((_, i) => {
  const angle = i * 2.39996;
  const radius = 50 + ((i * 53) % 140);
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.8 };
});

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const smooth = (t) => t * t * (3 - 2 * t);

function buildLookup(curve) {
  const { xs, ys, count } = curve;
  const keys = new Float32Array(count);

  for (let k = 0; k < count; k++) {
    keys[k] =
      k === 0
        ? ys[0]
        : Math.max(keys[k - 1] + MIN_SCROLL_PER_PX * LUT_STEP, ys[k]);
  }

  return { xs, ys, keys, count };
}

function RuneSerpent() {
  const layerRef = useRef(null);
  const runeRefs = useRef([]);

  useEffect(() => {
    const layer = layerRef.current;
    const runes = runeRefs.current;
    if (!layer) return;

    const reduced = prefersReducedMotion();
    let geometry = null;
    let lut = null;
    let zones = [];
    let length = 0;
    let head = null;
    let frame = 0;
    let lastTime = 0;
    let running = false;
    let arrived = false;
    let docHeight = 0;
    let lastSize = { width: 0, height: 0 };

    function pointAt(len) {
      const pos = clamp(len, 0, length) / LUT_STEP;
      const i = Math.min(Math.floor(pos), lut.count - 2);
      const f = pos - i;
      return {
        x: lut.xs[i] + (lut.xs[i + 1] - lut.xs[i]) * f,
        y: lut.ys[i] + (lut.ys[i + 1] - lut.ys[i]) * f,
      };
    }

    function setArrived(value) {
      if (value === arrived) return;
      arrived = value;
      layer.classList.toggle(ARRIVED_CLASS, value);
      geometry.endEl.classList.toggle(AWAKE_CLASS, value);
    }

    function targetHead() {
      const vh = window.innerHeight;
      const sy = window.scrollY;
      const maxScroll = docHeight - vh;
      const lastKey = lut.keys[lut.count - 1];

      let y = sy + vh * HEAD_VIEWPORT_RATIO;
      const reach = maxScroll + vh * HEAD_VIEWPORT_RATIO;
      const deficit = Math.max(0, lastKey + 1 - reach);
      if (deficit > 0) {
        const ramp = clamp(
          (sy - (maxScroll - vh * END_RAMP)) / (vh * END_RAMP),
          0,
          1,
        );
        y += deficit * smooth(ramp);
      }

      if (y >= lastKey) return length;

      let lo = 0;
      let hi = lut.count - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (lut.keys[mid] >= y) hi = mid;
        else lo = mid + 1;
      }
      if (lo === 0) return 0;

      const k0 = lut.keys[lo - 1];
      const k1 = lut.keys[lo];
      const f = k1 > k0 ? (y - k0) / (k1 - k0) : 0;
      return (lo - 1 + f) * LUT_STEP;
    }

    function zoneAt(len) {
      return zones.find((z) => len > z.start && len < z.end);
    }

    // o Portão: enquanto a seção fica presa na tela, a serpente se enrola em
    // volta do arco, espera as runas acenderem e é sugada pela luz das portas
    function gateState(vh, sy) {
      const gate = document.querySelector(".gate");
      const frame = gate?.querySelector(".gate__frame");
      if (!gate || !frame) return null;

      const rect = gate.getBoundingClientRect();
      const span = rect.height - vh;
      if (span <= 0 || rect.top > vh || rect.bottom < 0) return null;

      const p = clamp(-rect.top / span, 0, 1);
      // chega ao arco enquanto o portão sobe até o topo da tela
      const enter = smooth(clamp(1 - rect.top / (vh * 0.75), 0, 1));
      // é sugada quando as portas abrem, e reaparece na trilha depois
      const suck = smooth(clamp((p - GATE_SUCK_FROM) / GATE_SUCK_SPAN, 0, 1));
      const back = clamp((p - GATE_RELEASE) / (1 - GATE_RELEASE), 0, 1);
      if (enter <= 0 || back >= 1) return null;

      const f = frame.getBoundingClientRect();
      const toDoc = (gx, gy) => ({
        x: f.left + (gx / GATE_W) * f.width,
        y: sy + f.top + (gy / GATE_H) * f.height,
      });

      return { p, enter, suck, back, toDoc, center: toDoc(GATE_CX, GATE_ARCH_Y + 120) };
    }

    // ponto no contorno em U do arco (coluna esquerda, arco, coluna direita)
    function archPoint(t) {
      const pillar = GATE_FOOT - GATE_ARCH_Y;
      const arc = Math.PI * GATE_RING;
      const total = pillar * 2 + arc;
      let d = (((t % 1) + 1) % 1) * total;
      if (d < pillar) return [GATE_CX - GATE_RING, GATE_FOOT - d];
      d -= pillar;
      if (d < arc) {
        const a = Math.PI + d / GATE_RING;
        return [GATE_CX + Math.cos(a) * GATE_RING, GATE_ARCH_Y + Math.sin(a) * GATE_RING];
      }
      d -= arc;
      return [GATE_CX + GATE_RING, GATE_ARCH_Y + d];
    }

    function render() {
      const vh = window.innerHeight;
      const sy = window.scrollY;
      const { start, portal, heroTop, gap } = geometry;
      const gate = gateState(vh, sy);
      layer.classList.toggle("rune-serpent--gate", Boolean(gate && gate.enter > 0.6 && gate.suck < 0.5));

      let appear = 1;
      let gather = 1;
      let burstY = start.y;

      if (portal) {
        appear = clamp((sy - vh * 0.7) / (vh * 0.2), 0, 1);
        gather = smooth(clamp((sy - vh) / GATHER_DISTANCE, 0, 1));
        burstY = heroTop + Math.min(sy, vh) + vh / 2;
      }

      runes.forEach((el, i) => {
        const len = Math.max(0, head - i * gap);
        let { x, y } = pointAt(len);
        let front = true;

        const zone = zoneAt(len);
        if (zone?.type === "behind") front = false;
        if (zone?.type === "helix") {
          const progress = (len - zone.start) / (zone.end - zone.start);
          const angle =
            ((HELIX.from + progress * (HELIX.to - HELIX.from)) * Math.PI) / 180;
          front = Math.sin(angle) > -0.15;
        }

        if (gather < 1) {
          const bx = start.x + BURST[i].x;
          const by = burstY + BURST[i].y;
          x = bx + (x - bx) * gather;
          y = by + (y - by) * gather;
        }

        let gateFade = 1;
        if (gate) {
          if (gate.back > 0) {
            // depois das portas: volta à trilha, surgindo aos poucos
            gateFade = gate.back;
          } else {
            const t = (i + 0.5) / RUNE_COUNT + gate.p * 0.35;
            const [gx, gy] = archPoint(t);
            let target = gate.toDoc(gx, gy);
            if (gate.suck > 0) {
              const c = gate.center;
              target = { x: target.x + (c.x - target.x) * gate.suck, y: target.y + (c.y - target.y) * gate.suck };
              gateFade = 1 - gate.suck;
            }
            x += (target.x - x) * gate.enter;
            y += (target.y - y) * gate.enter;
            front = true;
          }
        }

        const opacity =
          appear *
          gateFade *
          (front ? 1 : BACK_OPACITY) *
          (1 - (i / RUNE_COUNT) * (gate && gate.back === 0 ? TAIL_FADE * (1 - gate.enter) : TAIL_FADE));

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.style.zIndex = front ? "2" : "0";
        el.style.opacity = opacity.toFixed(3);
      });
    }

    function tick(time) {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;

      const target = targetHead();
      head += (target - head) * (1 - Math.exp(-FOLLOW_SPEED * dt));
      if (Math.abs(target - head) < 0.3) head = target;

      render();
      setArrived(head >= length - 0.5);

      if (head === target) {
        running = false;
        lastTime = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    }

    function schedule() {
      if (running || !lut) return;
      running = true;
      frame = requestAnimationFrame(tick);
    }

    function rebuild() {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.scrollHeight;
      const unchanged =
        geometry &&
        Math.abs(width - lastSize.width) < SIZE_TOLERANCE &&
        Math.abs(height - lastSize.height) < SIZE_TOLERANCE;
      if (unchanged) return;

      lastSize = { width, height };
      docHeight = height;

      const next = collectGeometry();
      if (!next) return;
      geometry = next;

      if (reduced) {
        next.endEl.classList.add(AWAKE_CLASS);
        return;
      }

      const curve = sampleCurve(next.points, LUT_STEP);

      zones = next.zones.map((z) => ({
        type: z.type,
        start: curve.nodeLengths[z.from],
        end: curve.nodeLengths[z.to],
      }));

      length = curve.length;
      lut = buildLookup(curve);

      if (head === null) head = targetHead();
      head = Math.min(head, length);
      render();
      setArrived(head >= length - 0.5);
      schedule();
    }

    let rebuildTimer = 0;
    function requestRebuild() {
      clearTimeout(rebuildTimer);
      rebuildTimer = setTimeout(rebuild, REBUILD_DELAY_MS);
    }

    const resizeObserver = new ResizeObserver(requestRebuild);
    resizeObserver.observe(document.body);
    if (!reduced)
      window.addEventListener("scroll", schedule, { passive: true });
    rebuild();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(rebuildTimer);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <div className="rune-serpent" ref={layerRef} aria-hidden="true">
      {RUNES.map((char, i) => (
        <span
          key={i}
          className="rune-serpent__rune"
          style={{ "--i": i }}
          ref={(el) => {
            runeRefs.current[i] = el;
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

export default RuneSerpent;

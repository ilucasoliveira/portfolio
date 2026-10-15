import { useEffect, useRef } from "react";
import { canHover, prefersReducedMotion } from "../utils/motion";
import { useTheme } from "../hooks/useTheme";
import "./Background.css";

// céu noturno: estrelas em canvas (cintilam, se movem em paralaxe e às vezes uma cadente),
// lua atrás da névoa, faixas de neblina e uma lanterna que segue o cursor
function makeStars(width, height) {
  const count = Math.round((width * height) / 5200);
  const stars = Array.from({ length: count }, (_, i) => {
    const r = Math.random();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: r < 0.88 ? 0.5 + Math.random() * 0.8 : 1.2 + Math.random() * 1.1,
      depth: 0.15 + Math.random() * 0.85,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.6,
      gold: i % 9 === 0,
    };
  });
  // brancas primeiro, douradas depois: a cor do pincel só muda uma vez por quadro
  return stars.sort((a, b) => a.gold - b.gold);
}

function Background() {
  const canvasRef = useRef(null);
  const lanternRef = useRef(null);
  const theme = useTheme();
  const night = theme !== "light";

  useEffect(() => {
    // de dia o céu de estrelas fica escondido: nem desenha (economiza bateria)
    if (!night) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // com menos movimento as estrelas continuam cintilando; só a estrela cadente fica de fora
    const reduced = prefersReducedMotion();
    let stars = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    let shooting = null;
    let nextShot = performance.now() + 4000;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const sameWidth = window.innerWidth === width;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // no celular a barra de endereço muda só a altura ao rolar: mantém as mesmas estrelas
      // (sortear de novo fazia o céu "pular")
      if (!sameWidth || !stars.length) stars = makeStars(width, Math.max(height, window.screen?.height || 0) * 1.6);
    }

    let lastDraw = -1;
    let lastScroll = -1;

    function draw(time) {
      const scroll = window.scrollY;
      // parado (sem rolar e sem estrela cadente), o cintilar é lento: ~12 quadros por segundo bastam
      if (!shooting && scroll === lastScroll && time - lastDraw < 80 && time < nextShot) {
        if (running) frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;
      lastScroll = scroll;
      ctx.clearRect(0, 0, width, height);
      const t = time / 1000;

      let color = "";
      for (const s of stars) {
        const span = height * 1.6;
        const y = (((s.y - scroll * s.depth * 0.12) % span) + span) % span;
        if (y > height) continue;
        const twinkle = 0.45 + 0.55 * Math.sin(t * s.speed + s.phase) ** 2;
        ctx.globalAlpha = twinkle * (0.35 + s.depth * 0.65);
        const next = s.gold ? "#f3d488" : "#e9eeff";
        if (next !== color) {
          color = next;
          ctx.fillStyle = color;
        }
        if (s.size < 1.3) {
          // estrela miúda: um quadradinho é igual ao olho e muito mais barato que um círculo
          ctx.fillRect(s.x - s.size, y - s.size, s.size * 2, s.size * 2);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
        if (s.size > 1.6 && twinkle > 0.85) {
          // estrelas maiores ganham cruz de brilho
          ctx.globalAlpha = (twinkle - 0.85) * 3;
          ctx.fillRect(s.x - s.size * 3, y - 0.3, s.size * 6, 0.6);
          ctx.fillRect(s.x - 0.3, y - s.size * 3, 0.6, s.size * 6);
        }
      }

      // estrela cadente de vez em quando
      if (!reduced) {
        if (!shooting && time > nextShot) {
          shooting = {
            x: width * (0.2 + Math.random() * 0.7),
            y: height * (0.05 + Math.random() * 0.3),
            vx: -(6 + Math.random() * 4),
            vy: 2.2 + Math.random() * 1.5,
            life: 1,
          };
          nextShot = time + 7000 + Math.random() * 9000;
        }
        if (shooting) {
          const s = shooting;
          const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 14, s.y - s.vy * 14);
          grad.addColorStop(0, "rgba(255,246,220,0.95)");
          grad.addColorStop(1, "rgba(255,246,220,0)");
          ctx.globalAlpha = s.life;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 14, s.y - s.vy * 14);
          ctx.stroke();
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.012;
          if (s.life <= 0) shooting = null;
        }
      }

      ctx.globalAlpha = 1;
      if (running) frame = requestAnimationFrame(draw);
    }

    function onVisibility() {
      running = !document.hidden;
      cancelAnimationFrame(frame);
      if (running) frame = requestAnimationFrame(draw);
    }

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    // lanterna: luz quente que acompanha o cursor
    const lantern = lanternRef.current;
    let lx = 0;
    let ly = 0;
    let lframe = 0;
    function onMove(e) {
      lx = e.clientX;
      ly = e.clientY;
      cancelAnimationFrame(lframe);
      lframe = requestAnimationFrame(() => {
        lantern.style.setProperty("--lx", `${lx}px`);
        lantern.style.setProperty("--ly", `${ly}px`);
        lantern.classList.add("is-on");
      });
    }
    const hover = canHover();
    if (hover) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(lframe);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (hover) window.removeEventListener("pointermove", onMove);
    };
  }, [night]);

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-day" />
      <div className="bg-glow" />
      <div className="bg-moon" />
      <canvas className="bg-stars-canvas" ref={canvasRef} />
      <div className="bg-fog bg-fog--a" />
      <div className="bg-fog bg-fog--b" />
      <div className="bg-vignette" />
      <div className="bg-lantern" ref={lanternRef} />
    </div>
  );
}

export default Background;

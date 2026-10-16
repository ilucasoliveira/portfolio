import { useEffect, useRef, useState } from "react";
import { go, routeFor, VEIL_EVENT } from "../hooks/useRoute";
import { prefersReducedMotion } from "../utils/motion";
import { FUTHARK } from "../utils/runes";
import ElvishScript from "./ElvishScript";
import "./Veils.css";

const INTRO_KEY = "intro-seen";
const COVER_MS = 650;
const REVEAL_MS = 900;

function Star({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
    </svg>
  );
}

/*
 * Grade fina sobre a página (inspirada no pear.no): duas verticais nas margens do
 * conteúdo, uma horizontal sob o menu, ✦ nos cruzamentos e uma estrela que desce
 * pela linha da esquerda marcando o progresso da leitura.
 */
export function Hairlines() {
  const markRef = useRef(null);

  useEffect(() => {
    const mark = markRef.current;
    let frame = 0;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      mark.style.setProperty("--p", p.toFixed(4));
      // ponto final: a altura do nome no rodapé quando a página chega ao fim
      const logo = document.querySelector(".footer__logo");
      if (logo) {
        const footer = logo.closest(".footer");
        const pinned = footer.closest(".epilogue__stage");
        let end;
        if (pinned) {
          // rodapé dentro da cena presa do epílogo: no fim, o palco está no topo da tela
          end = footer.offsetTop + logo.offsetTop + logo.offsetHeight / 2;
        } else {
          const r = logo.getBoundingClientRect();
          end = r.top + r.height / 2 + (max - window.scrollY);
        }
        mark.style.setProperty("--end", `${Math.round(Math.min(end, window.innerHeight - 12))}px`);
      }
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="hairlines" aria-hidden="true">
      <i className="hairlines__v hairlines__v--l" />
      <i className="hairlines__v hairlines__v--r" />
      <i className="hairlines__h" />
      <Star className="hairlines__star hairlines__star--l" />
      <Star className="hairlines__star hairlines__star--r" />
      <span className="hairlines__progress" ref={markRef}>
        <Star className="hairlines__mark" />
      </span>
    </div>
  );
}

/*
 * Abertura (uma vez por sessão): linhas se desenham, ✦ surgem nos cruzamentos,
 * o anel de runas acende e o véu se abre ao meio como um portão.
 * Com menos movimento, o mesmo desenho, mas a cortina se dissolve em vez de se partir (CSS).
 * Só toca na entrada pela Home: quem chega por um link direto (uma obra, a Oficina)
 * já cai no conteúdo, e a abertura conta como vista nesta sessão.
 */
export function Intro() {
  const [phase, setPhase] = useState(() => {
    if (routeFor(window.location.pathname).page !== "home") return "done";
    try {
      if (sessionStorage.getItem(INTRO_KEY)) return "done";
    } catch {
      // sem sessionStorage: mostra a abertura normalmente
    }
    return "play";
  });

  // tocando: abre sozinho em 2,7 s, ou na hora com clique/tecla
  useEffect(() => {
    if (phase !== "play") return;
    document.documentElement.classList.add("is-intro");
    const open = setTimeout(() => setPhase("open"), 2700);
    const skip = () => setPhase("open");
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      clearTimeout(open);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [phase]);

  // abrindo: o véu se parte e some depois da animação
  useEffect(() => {
    if (phase !== "open") return;
    document.documentElement.classList.remove("is-intro");
    const end = setTimeout(() => setPhase("done"), 1200);
    return () => clearTimeout(end);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      document.documentElement.classList.remove("is-intro");
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        // idem
      }
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`intro intro--${phase}`} aria-hidden="true">
      <div className="intro__half intro__half--top" />
      <div className="intro__half intro__half--bottom" />
      <div className="intro__grid">
        <i className="intro__v" style={{ "--x": "25%" }} />
        <i className="intro__v" style={{ "--x": "75%" }} />
        <i className="intro__h" style={{ "--y": "50%" }} />
        {["25%", "75%"].map((x) => (
          <span key={x} className="intro__cross" style={{ left: x, top: "50%" }}>
            <Star className="intro__star" />
          </span>
        ))}
      </div>
      <div className="intro__seal">
        <svg className="intro__ring" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="92" pathLength="1" />
          <circle cx="100" cy="100" r="70" pathLength="1" />
        </svg>
        <ElvishScript className="intro__script" mode="ring" radius={84} maxScale={1.15} text="lucas de oliveira forjado em minas com fogo e paciencia" lit />
        <p className="intro__name">
          Lucas de
          <br />
          Oliveira
        </p>
        <p className="intro__runes">{FUTHARK.slice(0, 9).split("").join(" ")}</p>
      </div>
    </div>
  );
}

/*
 * Véu entre páginas: um portal de luz se fecha a partir do clique,
 * a página troca por trás e o véu se abre de novo com as runas girando.
 * Com menos movimento, a tela só escurece e clareia (CSS).
 */
export function RouteVeil() {
  const [state, setState] = useState({ phase: "idle", x: "50%", y: "50%" });

  useEffect(() => {
    let t1 = 0;
    let t2 = 0;
    function onVeil(event) {
      const { href, origin } = event.detail;
      setState({
        phase: "cover",
        x: origin ? `${origin.x}px` : "50%",
        y: origin ? `${origin.y}px` : "50%",
      });
      t1 = setTimeout(() => {
        go(href);
        setState((s) => ({ ...s, phase: "reveal", x: "50%", y: "50%" }));
        t2 = setTimeout(() => setState((s) => ({ ...s, phase: "idle" })), REVEAL_MS);
      }, COVER_MS);
    }
    window.addEventListener(VEIL_EVENT, onVeil);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener(VEIL_EVENT, onVeil);
    };
  }, []);

  if (state.phase === "idle") return null;

  return (
    <div className={`route-veil route-veil--${state.phase}`} style={{ "--vx": state.x, "--vy": state.y }} aria-hidden="true">
      <div className="route-veil__iris" />
      <svg className="route-veil__ring" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" pathLength="1" />
        <text>
          <textPath href="#veilRing" startOffset="0" textLength="486" lengthAdjust="spacing">
            {FUTHARK} {FUTHARK}
          </textPath>
        </text>
        <defs>
          <path id="veilRing" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
        </defs>
      </svg>
    </div>
  );
}

/*
 * Saltos para âncoras da mesma página (Ver projetos, Contato, links do menu):
 * em vez de rolar suavemente por milhares de pixels de animação (que no celular
 * pode travar ou ser interrompido), a tela escurece, pula direto e clareia.
 * Distâncias curtas continuam com rolagem suave.
 */
export function AnchorJump() {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    let t1 = 0;
    let t2 = 0;

    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.target === "_blank") return;
      const url = new URL(link.getAttribute("href"), window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", url.pathname + url.search + url.hash);

      // perto: rolagem suave (com menos movimento, pula direto); longe: escurece, pula e clareia
      const distance = Math.abs(target.getBoundingClientRect().top);
      if (distance < window.innerHeight * 1.5) {
        target.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth", block: "start" });
        return;
      }

      clearTimeout(t1);
      clearTimeout(t2);
      setPhase("cover");
      t1 = setTimeout(() => {
        target.scrollIntoView({ behavior: "instant", block: "start" });
        setPhase("reveal");
        t2 = setTimeout(() => setPhase("idle"), 450);
      }, 260);
    }

    document.addEventListener("click", onClick);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (phase === "idle") return null;
  return <div className={`anchor-veil anchor-veil--${phase}`} aria-hidden="true" />;
}

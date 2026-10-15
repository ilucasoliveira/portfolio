import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useInView } from "../hooks/useInView";
import { PROJECTS, tx } from "../data/projects";
import { EASTER_EGG, SCENES, WORKSHOP_TEXT } from "../data/workshop";
import { ICONS } from "../data/icons";
import { prefersReducedMotion } from "../utils/motion";
import Gate from "../components/Gate";
import ForgeScene from "../components/ForgeScene";
import Link from "../components/Link";
import RuneText from "../components/RuneText";
import hall960 from "../assets/mines/hall-960.webp";
import hall1672 from "../assets/mines/hall-1672.webp";
import bridge960 from "../assets/mines/bridge-960.webp";
import bridge1920 from "../assets/mines/bridge-1920.webp";
import "./WorkshopPage.css";

/*
 * A Oficina: as ferramentas contadas como uma descida pelas minas.
 * 1. O portão abre sozinho (Gate) e a luz baixa sobre o salão dos anões,
 *    que é a imagem da abertura (como o topo da página de Inspirações).
 * 2. Embaixo, tudo sobre o escuro: as linguagens e o back-end, a faixa da
 *    ponte sobre o abismo, depois o front-end, os dados e a infra. Um brilho
 *    de fogo sobe do fundo da tela conforme se desce (--depth).
 * 3. No fim, a cena da forja inteira na tela junto com o rodapé e uma frase curta.
 */

const NAMES = Object.fromEntries(PROJECTS.map((p) => [p.slug, p.name]));

const clamp = (v) => Math.min(1, Math.max(0, v));

function format(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

// --depth (0 no topo, 1 no fim) para o brilho do fogo, e --footer-h (altura do
// rodapé) para a cena final caber na tela inteira junto com ele
function usePageVars(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    let last = "";

    function update() {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const depth = max > 0 ? clamp(window.scrollY / max).toFixed(3) : "0";
      if (depth === last) return;
      last = depth;
      root.style.setProperty("--depth", depth);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const footer = document.querySelector(".footer");
    const measure = () => {
      if (!footer) return;
      const margin = parseFloat(getComputedStyle(footer).marginTop) || 0;
      root.style.setProperty("--footer-h", `${Math.ceil(footer.offsetHeight + margin)}px`);
      onScroll();
    };
    const observer = footer ? new ResizeObserver(measure) : null;
    observer?.observe(footer);
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rootRef]);
}

function ToolIcon({ tool }) {
  if (tool.icon) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={ICONS[tool.icon]} />
      </svg>
    );
  }
  return (
    <span className="tool__rune" aria-hidden="true">
      {tool.rune}
    </span>
  );
}

function ToolCard({ tool, index, lang, text }) {
  const id = `tool-${tool.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const used = tool.used === "all" ? null : tool.used;
  return (
    <li className="tool" style={{ "--i": index }}>
      <article aria-labelledby={id}>
        <div className="tool__head">
          <span className="tool__icon">
            <ToolIcon tool={tool} />
          </span>
          <h3 className="tool__name" id={id}>
            {tool.name}
          </h3>
        </div>
        <p className="tool__text">{tx(tool.text, lang)}</p>
        <p className="tool__label">{text.usedIn}</p>
        <p className="tool__used">
          {used
            ? used.map((slug, i) => (
                <span key={slug}>
                  {i > 0 && ", "}
                  <Link href={`/projetos/${slug}`}>{tx(NAMES[slug], lang)}</Link>
                </span>
              ))
            : text.allProjects}
        </p>
        {tool.url && (
          <a
            className="tool__visit"
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            aria-label={format(text.visitLabel, { name: tool.name })}
          >
            {text.visit} <span aria-hidden="true">↗</span>
          </a>
        )}
      </article>
    </li>
  );
}

function Category({ category, lang, text }) {
  const [ref, inView] = useInView({ threshold: 0.12 });
  const title = tx(category.title, lang);
  const id = `group-${category.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section ref={ref} className={`tools-group ${inView ? "is-in" : ""}`} aria-labelledby={id}>
      <h2 className="tools-group__title">
        <span aria-hidden="true">ᛟ</span>
        <span id={id}>{title}</span>
        <span aria-hidden="true">ᛟ</span>
      </h2>
      <ul className="tools-group__grid">
        {category.tools.map((tool, i) => (
          <ToolCard key={tool.name} tool={tool} index={i} lang={lang} text={text} />
        ))}
      </ul>
    </section>
  );
}

function WorkshopPage() {
  const { lang } = useLanguage();
  const text = WORKSHOP_TEXT[lang];
  // com menos movimento no sistema o portão também abre a página, na versão suave
  const [gate, setGate] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [gentle] = useState(prefersReducedMotion);
  const rootRef = useRef(null);
  const [upper, lower] = SCENES;

  usePageVars(rootRef);

  return (
    <div ref={rootRef} className={`workshop ${revealed ? "is-revealed" : ""}`}>
      {gate && <Gate gentle={gentle} onReveal={() => setRevealed(true)} onDone={() => setGate(false)} />}

      {/* fundo fixo: o escuro das minas e o fogo que sobe do fundo conforme se desce */}
      <div className="workshop__atmosphere" aria-hidden="true" />

      <div className="workshop__content">
        {/* abertura: o salão dos anões ocupa a primeira tela */}
        <header className="workshop-hero">
          <img
            className="workshop-hero__image"
            src={hall1672}
            srcSet={`${hall960} 960w, ${hall1672} 1672w`}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            decoding="async"
          />
          <div className="workshop-hero__inner">
            <p className="chapter-label">{text.chapter}</p>
            <h1 className="chapter-title workshop-hero__title">
              {text.titlePre}{" "}
              <em>
                <RuneText text={text.titleEm} active={revealed} />
              </em>
            </h1>
            <p className="workshop-hero__intro">{text.intro}</p>
            <span className="workshop-hero__descend" aria-hidden="true">
              {text.descend}
              <span className="workshop-hero__line" />
            </span>
          </div>
        </header>

        <div className="workshop__part">
          {upper.categories.map((category) => (
            <Category key={category.title.en} category={category} lang={lang} text={text} />
          ))}
        </div>

        {/* a ponte sobre o abismo: uma faixa entre as duas partes, que rola com a página */}
        <div className="workshop-bridge" aria-hidden="true">
          <img
            src={bridge1920}
            srcSet={`${bridge960} 960w, ${bridge1920} 1920w`}
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="workshop__part">
          {lower.categories.map((category) => (
            <Category key={category.title.en} category={category} lang={lang} text={text} />
          ))}
        </div>

        {/* fim: a forja inteira na tela junto com o rodapé */}
        <ForgeScene finale easterEgg={EASTER_EGG} sceneLabel={text.finaleLabel} labelledBy="workshop-finale">
          <p className="workshop-finale" id="workshop-finale">
            {text.finale}
          </p>
          <div className="workshop-finale__actions">
            <Link href={`/projetos/${PROJECTS[0].slug}`} className="cta cta--gold">
              {text.toProjects}
            </Link>
            <Link href="/#contato" className="cta cta--ghost">
              {text.toContact}
            </Link>
          </div>
        </ForgeScene>
      </div>
    </div>
  );
}

export default WorkshopPage;

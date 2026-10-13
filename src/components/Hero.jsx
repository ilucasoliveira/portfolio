import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useParallax } from "../hooks/useParallax";
import { useIntroDone } from "../hooks/useIntroDone";
import ElvishScript from "./ElvishScript";
import valley from "../assets/hero-valley.webp";
import "./Hero.css";

const RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";
const GOLDEN_ANGLE = 2.39996;

const FLYING_RUNES = Array.from({ length: 24 }, (_, i) => {
  const angle = i * GOLDEN_ANGLE;
  const radius = 140 + ((i * 53) % 220);

  return {
    char: RUNES[i % RUNES.length],
    x: Math.round(Math.cos(angle) * radius),
    y: Math.round(Math.sin(angle) * radius * 0.7),
    start: 5 + ((i * 37) % 40),
    rotation: (i * 47) % 360,
  };
});

// brasas subindo do pé das montanhas
const EMBERS = Array.from({ length: 22 }, (_, i) => ({
  left: `${6 + ((i * 41) % 88)}%`,
  size: 1.5 + (i % 4) * 0.6,
  dur: 7 + ((i * 7) % 8),
  delay: -((i * 1.7) % 12),
  dx: ((i * 31) % 120) - 60,
  o: 0.35 + ((i * 17) % 55) / 100,
}));

function Hero() {
  const { t } = useLanguage();
  const [scrollFade, setScrollFade] = useState(1);
  const parallaxRef = useParallax();
  const ready = useIntroDone();

  useEffect(() => {
    const stage = parallaxRef.current;
    const handleScroll = () => {
      setScrollFade(Math.max(0, 1 - window.scrollY / 300));
      stage?.style.setProperty("--sy", Math.min(window.scrollY, 1600).toFixed(0));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [parallaxRef]);

  return (
    <section id="hero" className="hero" ref={parallaxRef}>
      <div className="hero__stage">
        <svg
          className="hero__ring hero__ring--outer"
          viewBox="0 0 640 640"
          aria-hidden="true"
        >
          <defs>
            {/* gradiente fixo: o calor percorre o anel porque o anel gira (sem repintar a cada quadro) */}
            <linearGradient id="ringHeat" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7a6128" />
              <stop offset="35%" stopColor="#e8c97a" />
              <stop offset="50%" stopColor="#fff3d0" />
              <stop offset="65%" stopColor="#ff8a3d" />
              <stop offset="100%" stopColor="#7a6128" />
            </linearGradient>
            <path
              id="ringPathOuter"
              d="M 320,320 m -280,0 a 280,280 0 1,1 560,0 a 280,280 0 1,1 -560,0"
              fill="none"
            />
          </defs>
          <circle
            cx="320"
            cy="320"
            r="280"
            fill="none"
            stroke="rgba(201,168,76,0.10)"
            strokeWidth="1"
          />
          {/* halo: o mesmo texto com contorno largo e translúcido, no lugar de um filtro de desfoque (bem mais leve) */}
          <text
            className="hero__inscription hero__inscription--halo"
            fontSize="15"
            fill="none"
            stroke="rgba(255, 150, 60, 0.28)"
            strokeWidth="4"
            strokeLinejoin="round"
            letterSpacing="10"
            aria-hidden="true"
          >
            <textPath href="#ringPathOuter" textLength={Math.round(2 * Math.PI * 280 - 8)} lengthAdjust="spacing">
              ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ · ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ
              ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ·
            </textPath>
          </text>
          <text className="hero__inscription" fontSize="15" fill="url(#ringHeat)" letterSpacing="10">
            <textPath href="#ringPathOuter" textLength={Math.round(2 * Math.PI * 280 - 8)} lengthAdjust="spacing">
              ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ · ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ
              ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ·
            </textPath>
          </text>
        </svg>

        <svg
          className="hero__ring hero__ring--inner"
          viewBox="0 0 440 440"
          aria-hidden="true"
        >
          <circle
            cx="220"
            cy="220"
            r="200"
            fill="none"
            stroke="rgba(201,168,76,0.35)"
            strokeWidth="1"
          />
        </svg>

        <div className="hero__embers" aria-hidden="true">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              style={{
                left: e.left,
                width: `${e.size}px`,
                height: `${e.size}px`,
                animationDuration: `${e.dur}s`,
                animationDelay: `${e.delay}s`,
                "--dx": `${e.dx}px`,
                "--o": e.o,
              }}
            />
          ))}
        </div>

        {/* brilho de brasa na base do herói: some antes de "O Arquiteto" subir */}
        <div className="hero__glow" aria-hidden="true" />

        {/* vale noturno ao fundo: some no céu em cima e no preto embaixo */}
        <div className="hero__valley" aria-hidden="true">
          <img src={valley} alt="" width="1920" height="1013" decoding="async" fetchPriority="high" />
        </div>

        <div className="hero__runes" aria-hidden="true">
          {FLYING_RUNES.map((rune, i) => (
            <span
              key={i}
              className="hero__rune"
              style={{
                "--x": `${rune.x}px`,
                "--y": `${rune.y}px`,
                "--start": `${rune.start}%`,
                "--rot": `${rune.rotation}deg`,
              }}
            >
              {rune.char}
            </span>
          ))}
        </div>

        <div className="hero__content">
          <div className="hero__eyebrow">
            <span className="hero__line" />
            {t.hero.eyebrow}
            <span className="hero__line" />
          </div>

          <h1 className={`hero__title ${ready ? "is-in" : ""}`}>
            <span className="hero__title-line">Lucas de</span>
            <span className="hero__title-line">Oliveira</span>
          </h1>

          <div className="hero__rune-divider" aria-hidden="true">
            <span className="hero__line hero__line--short" />
            <ElvishScript className="hero__elvish-line" text="lucas de oliveira" lit={ready} />
            <span className="hero__line hero__line--short" />
          </div>

          <p className="hero__tagline">{t.hero.tagline}</p>

          <div className="hero__cta-group">
            <a href="#projetos" className="hero__cta hero__cta--primary">
              {t.hero.ctaProjects}
            </a>
            <a href="#contato" className="hero__cta hero__cta--secondary">
              {t.hero.ctaContact}
            </a>
          </div>
        </div>


        <div
          className="hero__scroll"
          style={{ opacity: scrollFade }}
          aria-hidden="true"
        >
          <div className="hero__scroll-inner">
            <span>{t.hero.scroll}</span>
            <div className="hero__scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

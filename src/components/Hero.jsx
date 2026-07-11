import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Hero.css";

function Hero() {
  const { t } = useLanguage();
  const [scrollFade, setScrollFade] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setScrollFade(Math.max(0, 1 - window.scrollY / 300));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className="hero">
      <svg className="hero__ring hero__ring--outer" viewBox="0 0 640 640">
        <defs>
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
        <text
          fontFamily="JetBrains Mono, monospace"
          fontSize="15"
          fill="rgba(201,168,76,0.28)"
          letterSpacing="10"
        >
          <textPath href="#ringPathOuter">
            ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ · ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ
            ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ·
          </textPath>
        </text>
      </svg>

      <svg className="hero__ring hero__ring--inner" viewBox="0 0 440 440">
        <circle
          cx="220"
          cy="220"
          r="200"
          fill="none"
          stroke="rgba(201,168,76,0.35)"
          strokeWidth="1"
        />
      </svg>

      <div className="hero__content">
        <div className="hero__eyebrow">
          <span className="hero__line" />
          {t.hero.eyebrow}
          <span className="hero__line" />
        </div>

        <h1 className="hero__title">
          Lucas de
          <br />
          Oliveira
        </h1>

        <div className="hero__rune-divider">
          <span className="hero__line hero__line--short" />
          <span className="hero__rune-text">ᚠ ᛁ ᚾ</span>
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

      <div className="hero__scroll" style={{ opacity: scrollFade }}>
        <div className="hero__scroll-inner">
          <span>{t.hero.scroll}</span>
          <div className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
}

export default Hero;

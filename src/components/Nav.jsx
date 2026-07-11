import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Nav.css";

function Nav() {
  const { t, lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <a href="#hero" className="nav__logo">
        <span className="nav__rune">ᚦ</span>
        Lucas de Oliveira
      </a>
      <div className="nav__links">
        <a href="#sobre">{t.nav.about}</a>
        <a href="#projetos">{t.nav.projects}</a>
        <a href="#stack">{t.nav.stack}</a>
        <a href="#contato" className="nav__contact-btn">
          {t.nav.contact}
        </a>
        <div className="nav__lang-toggle">
          <button
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <button
            className={lang === "pt" ? "active" : ""}
            onClick={() => setLang("pt")}
          >
            PT
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import Link from "./Link";
import { PROJECTS } from "../data/projects";
import "./Nav.css";

// itens do menu: a mesma ordem dos capítulos da página
// "Projetos" abre direto a página do primeiro projeto (com as abas para os outros);
// "Oficina" é a página própria das ferramentas, com a descida pelas minas
const PROJECTS_HREF = `/projetos/${PROJECTS[0].slug}`;

const MENU = [
  ["/#sobre", "about", "I"],
  [PROJECTS_HREF, "projects", "II"],
  ["/#jornada", "experience", "III"],
  ["/oficina", "stack", "IV"],
  ["/#contato", "contact", "V"],
  ["/inspiracoes", "inspirations", "A"],
];

function Nav({ page }) {
  const { t, lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);
  const drawerRef = useRef(null);

  // menu do celular: trava a rolagem, foca o primeiro link, fecha com Esc
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("nav-open");
    drawerRef.current?.querySelector("a")?.focus({ preventScroll: true });
    const onKey = (event) => {
      if (event.key === "Escape") {
        closeMenu();
        burgerRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth > 1000 && closeMenu();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.classList.remove("nav-open");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // fecha na hora (a trava de rolagem sai antes do salto para a seção)
  function closeMenu() {
    document.documentElement.classList.remove("nav-open");
    setOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`}>
      <Link href="/#hero" className="nav__logo">
        <span className="nav__rune" aria-hidden="true">
          ᚦ
        </span>
        Lucas de Oliveira
      </Link>
      <div className="nav__links">
        <Link href="/#sobre">{t.nav.about}</Link>
        <Link href={PROJECTS_HREF} aria-current={page === "project" ? "page" : undefined}>
          {t.nav.projects}
        </Link>
        <Link href="/#jornada">{t.nav.experience}</Link>
        <Link href="/oficina" aria-current={page === "workshop" ? "page" : undefined}>
          {t.nav.stack}
        </Link>
        <Link href="/inspiracoes" aria-current={page === "inspirations" ? "page" : undefined}>
          {t.nav.inspirations}
        </Link>
        <Link href="/#contato" className="nav__contact-btn">
          {t.nav.contact}
        </Link>
        <div
          className="nav__lang-toggle"
          role="group"
          aria-label={t.nav.language}
        >
          <button
            type="button"
            lang="en"
            aria-label="English"
            aria-pressed={lang === "en"}
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <button
            type="button"
            lang="pt-BR"
            aria-label="Português"
            aria-pressed={lang === "pt"}
            className={lang === "pt" ? "active" : ""}
            onClick={() => setLang("pt")}
          >
            PT
          </button>
        </div>
        <button
          ref={burgerRef}
          type="button"
          className="nav__burger"
          aria-expanded={open}
          aria-controls="nav-drawer"
          aria-label={open ? t.nav.close : t.nav.menu}
          onClick={() => (open ? closeMenu() : setOpen(true))}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* menu do celular e tablet: os capítulos do site em tela cheia */}
      <div
        id="nav-drawer"
        ref={drawerRef}
        className="nav__drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        hidden={!open}
      >
        <ol className="nav__drawer-list">
          {MENU.map(([href, key, numeral], i) => (
            <li key={key} style={{ "--i": i }}>
              <Link
                href={href}
                onClick={closeMenu}
                aria-current={
                  (key === "inspirations" && page === "inspirations") ||
                  (key === "projects" && page === "project") ||
                  (key === "stack" && page === "workshop")
                    ? "page"
                    : undefined
                }
              >
                <span className="nav__drawer-n" aria-hidden="true">
                  {numeral}
                </span>
                {t.nav[key]}
              </Link>
            </li>
          ))}
        </ol>
        <p className="nav__drawer-runes" aria-hidden="true">
          ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ
        </p>
      </div>
    </nav>
  );
}

export default Nav;

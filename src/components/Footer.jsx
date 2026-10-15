import { useLanguage } from "../context/LanguageContext";
import Link from "./Link";
import "./Footer.css";

const CURRENT_YEAR = new Date().getFullYear();

function Footer({ className = "" }) {
  const { t } = useLanguage();

  return (
    <footer className={`footer ${className}`.trim()}>
      <div className="footer__rune-border" aria-hidden="true" data-runes="ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ" />
      <div className="footer__inner">
        <div className="footer__logo">
          <span aria-hidden="true">ᚦ </span>
          Lucas de Oliveira
        </div>
        <p className="footer__copy">
          {t.footer.tagline} © {CURRENT_YEAR}
        </p>
        <ul className="footer__links">
          <li>
            <Link href="/#sobre">{t.nav.about}</Link>
          </li>
          <li>
            <Link href="/projetos">{t.nav.projects}</Link>
          </li>
          <li>
            <Link href="/inspiracoes">{t.nav.inspirations}</Link>
          </li>
          <li>
            <Link href="/#contato">{t.nav.contact}</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;

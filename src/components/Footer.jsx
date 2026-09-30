import { useLanguage } from "../context/LanguageContext";
import "./Footer.css";

const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer__rune-border" aria-hidden="true">
        ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ
      </div>
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
            <a href="#sobre">{t.nav.about}</a>
          </li>
          <li>
            <a href="#projetos">{t.nav.projects}</a>
          </li>
          <li>
            <a href="#contato">{t.nav.contact}</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;

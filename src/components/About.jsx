import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import Signature from "./Signature";
import portrait from "../assets/portrait.png";
import "./About.css";

function About() {
  const { t } = useLanguage();
  const [ref, isVisible] = useReveal();

  return (
    <section
      id="sobre"
      className={`about reveal ${isVisible ? "visible" : ""}`}
      ref={ref}
    >
      <div className="about__header">
        <div className="about__chapter">
          <span className="about__chapter-line" />
          {t.about.chapter}
        </div>
        <h2 className="about__title">
          {t.about.titlePre} <em>{t.about.titleEm}</em>
        </h2>
      </div>

      <div className="about__grid">
        <div className="about__portrait-wrap">
          <div className="about__portrait">
            <img
              src={portrait}
              alt="Lucas de Oliveira"
              className="about__portrait-img"
            />
          </div>
          <div className="about__portrait-frame" />
          <div className="about__badge">
            <div className="about__badge-number">{t.about.badgeNumber}</div>
            <div className="about__badge-label">{t.about.badgeLabel}</div>
          </div>
        </div>

        <div className="about__content">
          <blockquote className="about__quote">{t.about.quote}</blockquote>
          <p className="about__paragraph">{t.about.p1}</p>
          <p className="about__paragraph">{t.about.p2}</p>

          <div className="about__divider">
            <span className="about__divider-line" />
            <span className="about__divider-rune">ᚠ ᛁ ᚾ</span>
            <span className="about__divider-line" />
          </div>

          <div className="about__tags">
            {t.about.tags.map((tag) => (
              <span key={tag} className="about__tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Signature />
    </section>
  );
}

export default About;

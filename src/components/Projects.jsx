import { useLanguage } from "../context/LanguageContext";
import { projectsData } from "../data/projects";
import { useReveal } from "../hooks/useReveal";
import libraryShot from "../assets/personal-library.png";
import libraryShotMobile from "../assets/personal-library-mobile.png";
import "./Projects.css";

function Projects() {
  const { t, lang } = useLanguage();
  const { featured, others } = projectsData[lang];
  const [ref, isVisible] = useReveal();

  return (
    <section
      id="projetos"
      className={`projects reveal ${isVisible ? "visible" : ""}`}
      ref={ref}
    >
      <div className="projects__header">
        <div className="projects__chapter">
          <span className="projects__chapter-line" />
          {t.projects.chapter}
        </div>
        <h2 className="projects__title">
          {t.projects.titlePre} <em>{t.projects.titleEm}</em>
        </h2>
      </div>

      <div className="projects__featured">
        <div className="projects__featured-glow" />

        <div className="projects__featured-image">
          <picture>
            <source media="(max-width: 700px)" srcSet={libraryShotMobile} />
            <img
              src={libraryShot}
              alt="Personal Library — application interface"
              className="projects__featured-img"
            />
          </picture>
        </div>

        <div className="projects__featured-meta">
          <span className="projects__featured-badge">
            {t.projects.featured.badge}
          </span>
          <span className="projects__featured-year">{featured.year}</span>
        </div>

        <h3 className="projects__featured-title">{featured.title}</h3>
        <p className="projects__featured-desc">{featured.desc}</p>

        <div className="projects__featured-tags">
          {featured.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <a
          href={featured.link}
          target="_blank"
          rel="noopener noreferrer"
          className="projects__featured-cta"
        >
          {t.projects.featured.cta}
        </a>
      </div>

      <div className="projects__grid">
        {others.map((project) => (
          <div key={project.title} className="projects__card">
            <div className="projects__card-hover-bar" />
            <div className="projects__card-tags">{project.tags}</div>
            <h3 className="projects__card-title">{project.title}</h3>
            <p className="projects__card-desc">{project.desc}</p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="projects__card-link"
            >
              {t.projects.viewMore}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;

import { useLanguage } from "../context/LanguageContext";
import { projectsData } from "../data/projects";
import { useReveal } from "../hooks/useReveal";
import { useTilt } from "../hooks/useTilt";
import RuneText from "./RuneText";
import libraryShot from "../assets/personal-library.webp";
import libraryShotMobile from "../assets/personal-library-mobile.webp";
import "./Projects.css";

function ProjectCard({ project, linkLabel }) {
  const tiltRef = useTilt();

  return (
    <div ref={tiltRef} className="projects__card">
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
        {linkLabel}
      </a>
    </div>
  );
}

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
          {t.projects.titlePre}{" "}
          <em>
            <RuneText text={t.projects.titleEm} active={isVisible} />
          </em>
        </h2>
      </div>

      <div className="projects__featured" data-serpent="featured">
        <div className="projects__featured-glow" />

        <div className="projects__featured-image">
          <picture>
            <source media="(max-width: 700px)" srcSet={libraryShotMobile} />
            <img
              src={libraryShot}
              alt={t.projects.featured.imageAlt}
              width="1198"
              height="748"
              loading="lazy"
              decoding="async"
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

        <div className="projects__featured-actions">
          {featured.demo && (
            <a
              href={featured.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="projects__featured-cta"
            >
              {t.projects.featured.demo}
            </a>
          )}
          <a
            href={featured.link}
            target="_blank"
            rel="noopener noreferrer"
            className="projects__featured-cta"
          >
            {t.projects.featured.cta}
          </a>
        </div>
      </div>

      <div className="projects__grid" data-serpent="projects">
        {others.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            linkLabel={t.projects.viewMore}
          />
        ))}
      </div>
    </section>
  );
}

export default Projects;

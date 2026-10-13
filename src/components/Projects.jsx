import { useLanguage } from "../context/LanguageContext";
import { PROJECTS, tx } from "../data/projects";
import { useReveal } from "../hooks/useReveal";
import { useTilt } from "../hooks/useTilt";
import RuneText from "./RuneText";
import Corners from "./Corners";
import Link from "./Link";
import "./Projects.css";

const NUMERAL_RUNES = { I: "ᚠ", II: "ᚢ", III: "ᚦ", IV: "ᚨ" };

export function ExternalLinks({ project, className = "projects__card-link" }) {
  const { t } = useLanguage();
  return project.links.map((link) => (
    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
      {t.projects.links[link.type]} ↗<span className="sr-only"> {t.projects.newTab}</span>
    </a>
  ));
}

function ProjectCard({ project }) {
  const { t, lang } = useLanguage();
  const tiltRef = useTilt();
  const text = project.text[lang];
  const href = `/projetos/${project.slug}`;

  return (
    <article ref={tiltRef} className="projects__card">
      <div className="projects__card-hover-bar" />
      <span className="projects__card-rune" aria-hidden="true">
        {NUMERAL_RUNES[project.numeral]}
      </span>
      <div className="projects__card-tags">{project.tags.join(" · ")}</div>
      <h3 className="projects__card-title">
        <Link href={href} className="projects__card-title-link">
          {tx(project.name, lang)}
        </Link>
      </h3>
      <p className="projects__card-desc">{text.summary}</p>
      <ul className="projects__card-list">
        {text.bullets.slice(0, 3).map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="projects__card-actions">
        <Link href={href} className="link-rune projects__details">
          {t.projects.details}
        </Link>
        <ExternalLinks project={project} />
      </div>
    </article>
  );
}

function Projects() {
  const { t, lang } = useLanguage();
  const [featured, ...others] = PROJECTS;
  const [ref, isVisible] = useReveal();
  const text = featured.text[lang];
  const href = `/projetos/${featured.slug}`;

  return (
    <section id="projetos" className={`projects reveal ${isVisible ? "visible" : ""}`} ref={ref}>
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

      <article className="projects__featured" data-serpent="featured">
        <Corners />
        <div className="projects__featured-glow" />

        <Link href={href} className="projects__featured-image" tabIndex={-1} aria-hidden="true">
          <picture>
            <source media="(max-width: 700px)" srcSet={featured.imageMobile} />
            <img
              src={featured.image}
              alt=""
              width="1198"
              height="748"
              loading="lazy"
              decoding="async"
              className="projects__featured-img"
            />
          </picture>
          <span className="projects__featured-veil">{t.projects.enter}</span>
        </Link>

        <div className="projects__featured-meta">
          <span className="projects__featured-badge">{t.projects.featured.badge}</span>
          <span className="projects__featured-year">
            {featured.year} · {text.kind}
          </span>
        </div>

        <h3 className="projects__featured-title">
          <Link href={href} className="projects__card-title-link">
            {tx(featured.name, lang)}
          </Link>
        </h3>
        <p className="projects__featured-desc">{text.lead}</p>

        <div className="projects__featured-tags">
          {featured.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="projects__featured-actions">
          <Link href={href} className="cta cta--gold">
            {t.projects.details}
          </Link>
          <ExternalLinks project={featured} className="projects__featured-cta" />
        </div>
      </article>

      <div className="projects__grid" data-serpent="projects">
        {others.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;

import { useLanguage } from "../context/LanguageContext";
import { NUMERAL_RUNES, PROJECTS, tx } from "../data/projects";
import { useReveal } from "../hooks/useReveal";
import RuneText from "./RuneText";
import Link from "./Link";
import "./Projects.css";

/*
 * As Obras na Home: só um convite. Todas as obras numa faixa de arcos (nome,
 * uma frase, a stack e se está no ar), cada uma levando à sua página, e o
 * caminho para a página de todas as obras (/projetos), onde fica o resto.
 */

// links para fora (demo, docs, código), usados nas páginas das obras
export function ExternalLinks({ project, className = "" }) {
  const { t } = useLanguage();
  return project.links.map((link) => (
    <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
      {t.projects.links[link.type]} ↗<span className="sr-only"> {t.projects.newTab}</span>
    </a>
  ));
}

function isLive(project) {
  return project.links.some((link) => link.type === "demo");
}

function WorkArch({ project, index }) {
  const { t, lang } = useLanguage();
  const text = project.text[lang];
  const live = isLive(project);
  return (
    <li className="wstrip__item" style={{ "--i": index }}>
      <article className="wstrip__card">
        <span className="wstrip__key" aria-hidden="true">
          {NUMERAL_RUNES[project.numeral]}
        </span>
        <h3 className="wstrip__name">
          {/* o link cobre o arco inteiro (::after), mas o nome dele é só o título */}
          <Link href={`/projetos/${project.slug}`} className="wstrip__link">
            {tx(project.name, lang)}
          </Link>
        </h3>
        <p className="wstrip__summary">{text.summary}</p>
        <p className="wstrip__tags">{project.tags.join(" · ")}</p>
        <p className="wstrip__foot">
          <span className={`wstrip__status ${live ? "is-live" : ""}`}>
            {live ? t.projects.live : t.projects.codeOnly}
          </span>
          <span className="wstrip__enter" aria-hidden="true">
            {t.projects.enterShort}
          </span>
        </p>
      </article>
    </li>
  );
}

function Projects() {
  const { t, lang } = useLanguage();
  const [ref, isVisible] = useReveal();
  const demo = PROJECTS.find(isLive);
  const demoUrl = demo?.links.find((link) => link.type === "demo")?.url;

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
        <p className="projects__intro">{t.projects.intro}</p>
      </div>

      <ol className="wstrip">
        {PROJECTS.map((project, i) => (
          <WorkArch key={project.slug} project={project} index={i} />
        ))}
      </ol>

      <div className="projects__actions">
        <Link href="/projetos" className="cta cta--gold">
          {t.projects.seeAll}
        </Link>
        {demoUrl && (
          <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="cta cta--ghost">
            {/* espaço que não quebra: a seta nunca fica sozinha na linha de baixo */}
            {t.projects.liveDemo.replace("{name}", tx(demo.name, lang))}&nbsp;↗<span className="sr-only"> {t.projects.newTab}</span>
          </a>
        )}
      </div>
    </section>
  );
}

export default Projects;

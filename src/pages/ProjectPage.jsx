import { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { PROJECTS, findProject, tx } from "../data/projects";
import { useInView } from "../hooks/useInView";
import ArchDiagram from "../components/ArchDiagram";
import Corners from "../components/Corners";
import ElvishScript from "../components/ElvishScript";
import ForgeScene from "../components/ForgeScene";
import Link from "../components/Link";
import RuneText from "../components/RuneText";
import Words from "../components/Words";
import { ExternalLinks } from "../components/Projects";
import { FUTHARK } from "../utils/runes";
import "./ProjectPage.css";

const NUMERAL_RUNES = { I: "ᚠ", II: "ᚢ", III: "ᚦ", IV: "ᚨ" };

// abertura de capítulo dentro da página: rótulo + título com palavra em itálico
function Chapter({ id, chapter, pre, em, kicker }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <header ref={ref} className={`pchapter ${inView ? "is-in" : ""}`}>
      <p className="chapter-label">{kicker ?? chapter}</p>
      <h2 className="chapter-title" id={id}>
        {pre}{" "}
        <em>
          <RuneText text={em} active={inView} />
        </em>
      </h2>
    </header>
  );
}

function Tabs({ current }) {
  const { t, lang } = useLanguage();
  return (
    <nav className="ptabs" aria-label={t.projectPage.tabs}>
      {PROJECTS.map((project) => (
        <Link
          key={project.slug}
          className="ptabs__tab"
          href={`/projetos/${project.slug}`}
          aria-current={project.slug === current ? "page" : undefined}
        >
          <span className="ptabs__rune" aria-hidden="true">
            {NUMERAL_RUNES[project.numeral]}
          </span>
          <span className="ptabs__name">{tx(project.name, lang)}</span>
        </Link>
      ))}
    </nav>
  );
}

// selo de cera com runa e número
function Seal({ n, label, i }) {
  return (
    <div className="seal" style={{ "--i": i }}>
      <div className="seal__wax" aria-hidden="true">
        <span className="seal__rune">{FUTHARK[(i * 5 + 2) % FUTHARK.length]}</span>
      </div>
      <p className="seal__n">{n}</p>
      <p className="seal__label">{label}</p>
    </div>
  );
}

function NotFound() {
  const { t } = useLanguage();
  const titleRef = useRef(null);
  useEffect(() => titleRef.current?.focus(), []);
  return (
    <section className="phero phero--missing">
      <h1 className="phero__title" ref={titleRef} tabIndex={-1}>
        {t.projectPage.notFound}
      </h1>
      <Link className="cta cta--ghost" href="/#projetos">
        {t.projectPage.notFoundBack}
      </Link>
    </section>
  );
}

function ProjectPage({ slug }) {
  const { t, lang } = useLanguage();
  const titleRef = useRef(null);
  const [heroRef, heroIn] = useInView({ threshold: 0.1 });
  const project = findProject(slug);

  // ao trocar de projeto, o foco vai para o título (leitores de tela anunciam a página nova)
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [slug]);

  if (!project) return <NotFound />;

  const p = t.projectPage;
  const text = project.text[lang];
  const name = tx(project.name, lang);
  const index = PROJECTS.indexOf(project);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const stack = project.stack.map(([n, role]) => [n, tx(role, lang)]);

  return (
    <article className="project-page" aria-labelledby="project-title">
      {/* cabeçalho da obra */}
      <header className="phero" ref={heroRef}>
        <div className="phero__inner">
          <Link className="link-rune phero__back" href="/#projetos">
            {p.back}
          </Link>
          <Tabs current={project.slug} />

          <p className="chapter-label phero__label">
            {p.project} {project.numeral} · {project.year} · {text.kind}
          </p>
          <h1 className="phero__title" id="project-title" ref={titleRef} tabIndex={-1}>
            <RuneText text={name} active={heroIn} />
          </h1>
          <ElvishScript className="phero__elvish" text={name} lit={heroIn} />
          <Words className="phero__lead" text={text.lead} />

          <dl className="phero__meta">
            <Corners />
            {text.meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="phero__links">
            <ExternalLinks project={project} className="cta cta--ghost" />
          </div>
          {text.note && <p className="phero__note">{text.note}</p>}
        </div>
      </header>

      {/* a forja: a cena inteira de fundo e a stack em volta */}
      <ForgeScene stack={stack} labelA={p.stackA} labelB={p.stackB} sceneLabel={p.sceneLabel}>
        <p className="chapter-label">{p.forge.chapter}</p>
        <h2 className="chapter-title" id="forge-title">
          {p.forge.pre} <em>{p.forge.em}</em>
        </h2>
        <p className="forge__hint">{p.forge.hint}</p>
      </ForgeScene>

      {/* iluminura: arquitetura */}
      <section className="psec" aria-labelledby="arch-title">
        <Chapter id="arch-title" chapter={p.arch.chapter} pre={p.arch.pre} em={p.arch.em} />
        <div className="psplit">
          <div className="psplit__a">
            <ArchDiagram
              cells={project.diagram}
              label={text.archLabel}
              caption={text.archCaption}
              captionLead={t.projects.illumination}
              lang={lang}
            />
          </div>
          <div className="psplit__b">
            {project.image ? (
              <figure className="pshot">
                <Corners />
                <img src={project.image} alt={text.shotAlt} width="1198" height="748" loading="lazy" decoding="async" />
                <figcaption>{text.shotAlt}</figcaption>
              </figure>
            ) : (
              <p className="pflow">
                <strong>{p.flowTitle}</strong> {text.flow}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* funcionalidades e selos de cera */}
      <section className="psec" aria-labelledby="features-title">
        <Chapter id="features-title" chapter={p.features.chapter} pre={p.features.pre} em={p.features.em} />
        <div className="psplit">
          <ul className="pfeatures psplit__a">
            {text.features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="psplit__b">
            <div className="seals">
              {text.seals.map(([n, label], i) => (
                <Seal key={label} n={n} label={label} i={i} />
              ))}
            </div>
            <p className="seals__caption">{p.seals}</p>
          </div>
        </div>
      </section>

      {/* decisões técnicas */}
      <section className="psec" aria-labelledby="decisions-title">
        <Chapter id="decisions-title" chapter={p.decisions.chapter} pre={p.decisions.pre} em={p.decisions.em} />
        <div className="decisions">
          {text.decisions.map(([title, body], i) => (
            <article key={title} className="decision">
              <span className="decision__n" aria-hidden="true">
                {FUTHARK[(i * 3 + 1) % FUTHARK.length]}
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* contrato da API */}
      <section className="psec" aria-labelledby="endpoints-title">
        <Chapter id="endpoints-title" chapter={p.endpoints.chapter} pre={p.endpoints.pre} em={p.endpoints.em} />
        <div className="etable__box" tabIndex={0} role="region" aria-labelledby="endpoints-title">
          <table className="etable">
            <thead>
              <tr>
                <th scope="col">{p.method}</th>
                <th scope="col">{p.route}</th>
                <th scope="col">{p.does}</th>
              </tr>
            </thead>
            <tbody>
              {project.endpoints.map(([method, path, desc]) => (
                <tr key={`${method} ${path}`}>
                  <td>
                    <span className={`verb verb--${method.split("/")[0].toLowerCase()}`}>{method}</span>
                  </td>
                  <td className="etable__path">{path}</td>
                  <td>{tx(desc, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="etable__caption">{text.endCaption}</p>
      </section>

      {/* próximos passos */}
      <section className="psec" aria-labelledby="next-title">
        <Chapter id="next-title" kicker={`ᛉ · ${text.nextKind}`} pre={p.next.pre} em={p.next.em} />
        <ul className="pnext">
          {text.next.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* anterior / próximo */}
      <nav className="psec pnav" aria-label={p.others}>
        <Link className="pnav__link" href={`/projetos/${prev.slug}`}>
          <span className="pnav__dir">{p.prev}</span>
          <span className="pnav__name">{tx(prev.name, lang)}</span>
          <span className="pnav__rune" aria-hidden="true">
            {NUMERAL_RUNES[prev.numeral]}
          </span>
        </Link>
        <Link className="pnav__link pnav__link--next" href={`/projetos/${next.slug}`}>
          <span className="pnav__dir">{p.nextProject}</span>
          <span className="pnav__name">{tx(next.name, lang)}</span>
          <span className="pnav__rune" aria-hidden="true">
            {NUMERAL_RUNES[next.numeral]}
          </span>
        </Link>
      </nav>
    </article>
  );
}

export default ProjectPage;

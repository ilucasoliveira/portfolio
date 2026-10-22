import { useLanguage } from "../context/LanguageContext";
import { NUMERAL_RUNES, PROJECTS, tx } from "../data/projects";
import { HALL_TEXT, LAMPS } from "../data/hall";
import { useInView } from "../hooks/useInView";
import { ExternalLinks } from "../components/Projects";
import Corners from "../components/Corners";
import Link from "../components/Link";
import RuneText from "../components/RuneText";
import ThemedImg from "../components/ThemedImg";
import { useTheme } from "../hooks/useTheme";
import city960 from "../assets/city/gondolin-960.webp";
import city1672 from "../assets/city/gondolin-1672.webp";
import cityDay960 from "../assets/city/gondolin-day-960.webp";
import cityDay1672 from "../assets/city/gondolin-day-1672.webp";

// a cidade à noite e de dia (mesmo enquadramento)
const CITY = {
  night: { src: city1672, srcSet: `${city960} 960w, ${city1672} 1672w` },
  day: { src: cityDay1672, srcSet: `${cityDay960} 960w, ${cityDay1672} 1672w` },
};
const CITY_SMALL = { night: { src: city960 }, day: { src: cityDay960 } };
import "./ProjectsPage.css";

/*
 * As Obras: a cidade de pedra branca, à noite.
 * 1. A cidade ocupa a primeira tela e as janelas acendem uma a uma, a partir da torre.
 * 2. As obras em destaque são arcos de pedra largos, com a tela do app de pé
 *    diante da cidade (a segunda espelhada); as outras ficam em quadros com cantos
 *    de voluta, mostrando a própria obra (a tela do app ou o Swagger) e a runa no alto.
 * 3. No fim, o caminho para a Oficina (as ferramentas) e para o contato.
 */

// a torre central: as janelas mais perto dela acendem primeiro
const TOWER = [59, 36];
const LIT = LAMPS.map(([x, y], i) => ({
  x,
  y,
  delay: Math.round(Math.hypot(x - TOWER[0], (y - TOWER[1]) * 1.8) * 38),
  flicker: (2.6 + ((i * 0.73) % 2.4)).toFixed(2),
}));

function isLive(project) {
  return project.links.some((link) => link.type === "demo");
}

function Meta({ project, text, hall }) {
  return (
    <p className="work__meta">
      <span>{project.year}</span>
      <span>{text.kind}</span>
      <span className={`work__status ${isLive(project) ? "is-live" : ""}`}>
        {isLive(project) ? hall.status.live : hall.status.code}
      </span>
    </p>
  );
}

function FeaturedWork({ project, hall, flip }) {
  const { t, lang } = useLanguage();
  const text = project.text[lang];
  const href = `/projetos/${project.slug}`;
  return (
    <article className={`work work--featured ${flip ? "work--flip" : ""}`} aria-labelledby={`work-${project.slug}`}>
      <Link href={href} className="hall-arch hall-arch--wide" tabIndex={-1} aria-hidden="true">
        {/* pelo arco se vê a cidade, e a tela do app fica de pé dentro dele */}
        <span className="hall-arch__window">
          <ThemedImg
            {...CITY_SMALL}
            className="hall-arch__city"
            alt=""
            width="960"
            height="540"
            loading="lazy"
            decoding="async"
          />
          <picture className="hall-arch__screen">
            <source media="(max-width: 700px)" srcSet={project.imageMobile} />
            <img src={project.image} alt="" width="1198" height="748" loading="lazy" decoding="async" />
          </picture>
        </span>
        <span className="hall-arch__key">{NUMERAL_RUNES[project.numeral]}</span>
      </Link>

      <div className="work__body">
        <Meta project={project} text={text} hall={hall} />
        <h3 className="work__title" id={`work-${project.slug}`}>
          <Link href={href}>{tx(project.name, lang)}</Link>
        </h3>
        <p className="work__lead">{text.lead}</p>
        <ul className="work__tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="work__actions">
          <Link href={href} className="cta cta--gold">
            {t.projects.enter}
          </Link>
          <ExternalLinks project={project} className="work__ext" />
        </div>
      </div>
    </article>
  );
}

function Work({ project, index, hall }) {
  const { t, lang } = useLanguage();
  const text = project.text[lang];
  const href = `/projetos/${project.slug}`;
  return (
    <li className="work" style={{ "--i": index }}>
      <article aria-labelledby={`work-${project.slug}`}>
        <Link href={href} className="hall-frame" tabIndex={-1} aria-hidden="true">
          {/* a própria obra num quadro de pedra: a tela do app, ou o Swagger nas APIs */}
          <span className="hall-frame__window">
            <img src={project.cover} alt="" width="1198" height="748" loading="lazy" decoding="async" />
          </span>
          <Corners />
          <span className="hall-arch__key">{NUMERAL_RUNES[project.numeral]}</span>
        </Link>
        <Meta project={project} text={text} hall={hall} />
        <h3 className="work__title" id={`work-${project.slug}`}>
          <Link href={href}>{tx(project.name, lang)}</Link>
        </h3>
        <p className="work__summary">{text.summary}</p>
        <p className="work__stack">{project.tags.join(" · ")}</p>
        <Link href={href} className="link-rune work__enter">
          {t.projects.enter}
        </Link>
      </article>
    </li>
  );
}

function ProjectsPage() {
  const { lang } = useLanguage();
  const hall = HALL_TEXT[lang];
  const theme = useTheme();
  const [heroRef, heroIn] = useInView({ threshold: 0.2 });
  const [rowRef, rowIn] = useInView({ threshold: 0.15 });
  const featured = PROJECTS.filter((project) => project.featured);
  const others = PROJECTS.filter((project) => !project.featured);

  return (
    <div className="hall">
      {/* abertura: a cidade inteira na tela, com as janelas acendendo */}
      <header className="hall-hero" ref={heroRef}>
        <div className="hall-hero__art" aria-hidden="true">
          <ThemedImg
            {...CITY}
            sizes="(max-width: 700px) 1500px, 100vw"
            alt=""
            width="1672"
            height="940"
            fetchPriority="high"
            decoding="async"
          />
          {/* de dia não há janelas acesas */}
          {theme !== "light" && (
            <span className="hall-hero__lamps">
              {LIT.map((lamp) => (
                <i
                  key={`${lamp.x}-${lamp.y}`}
                  style={{ left: `${lamp.x}%`, top: `${lamp.y}%`, "--d": `${lamp.delay}ms`, "--f": `${lamp.flicker}s` }}
                />
              ))}
            </span>
          )}
        </div>

        <div className="hall-hero__inner">
          <p className="chapter-label">{hall.chapter}</p>
          <h1 className="chapter-title hall-hero__title">
            {hall.titlePre}{" "}
            <em>
              <RuneText text={hall.titleEm} active={heroIn} />
            </em>
          </h1>
          <p className="hall-hero__intro">{hall.intro}</p>
          <a className="hall-hero__descend" href="#obras">
            {hall.descend}
            <span className="hall-hero__line" aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* as obras: os arcos grandes das obras em destaque e os menores das outras */}
      <section id="obras" className="hall-works" aria-labelledby="hall-works-title">
        <h2 className="sr-only" id="hall-works-title">
          {hall.worksLabel}
        </h2>
        {featured.map((project, i) => (
          <FeaturedWork key={project.slug} project={project} hall={hall} flip={i % 2 === 1} />
        ))}
        <ul ref={rowRef} className={`hall-works__row ${rowIn ? "is-in" : ""}`}>
          {others.map((project, i) => (
            <Work key={project.slug} project={project} index={i} hall={hall} />
          ))}
        </ul>
      </section>

      {/* fim: as ferramentas e o contato */}
      <section className="hall-close">
        <span className="hall-close__mark" aria-hidden="true">
          ✦
        </span>
        <p className="hall-close__text">{hall.closing}</p>
        <div className="hall-close__actions">
          <Link href="/oficina" className="cta cta--ghost">
            {hall.toWorkshop}
          </Link>
          <Link href="/#contato" className="cta cta--ghost">
            {hall.toContact}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ProjectsPage;

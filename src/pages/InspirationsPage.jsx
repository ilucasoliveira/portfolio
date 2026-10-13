import { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { INSPIRATIONS } from "../data/inspirations";
import { useInView } from "../hooks/useInView";
import Link from "../components/Link";
import RuneText from "../components/RuneText";
import Words from "../components/Words";
import tolkien from "../assets/tolkien.webp";
import coverHobbit from "../assets/cover-hobbit.webp";
import coverFellowship from "../assets/cover-fellowship.webp";
import coverTowers from "../assets/cover-two-towers.webp";
import coverKing from "../assets/cover-return-king.webp";
import "./InspirationsPage.css";

/*
 * Inspirações: o "apêndice" do site, diagramado como a página de um livro antigo
 * (papel, tinta, fios finos, capitulares). É a única página clara do site.
 *
 * Imagem do topo: coloque os arquivos em src/assets/shire/ com a largura no nome,
 * por exemplo hero-1920.webp e hero-3840.webp. Eles entram sozinhos aqui, e o
 * navegador escolhe o tamanho certo para cada tela (1080p, 4K, celular).
 * Sem arquivos na pasta, o topo fica só com a tipografia.
 */
const HERO_FILES = import.meta.glob("../assets/shire/hero-*.{webp,avif,jpg,jpeg,png}", {
  eager: true,
  import: "default",
});
const HERO = Object.entries(HERO_FILES)
  .map(([path, url]) => ({ url, w: Number(path.match(/hero-(\d+)/)?.[1] || 0) }))
  .filter((f) => f.w > 0)
  .sort((a, b) => a.w - b.w);
const HERO_SRCSET = HERO.map((f) => `${f.url} ${f.w}w`).join(", ");

const COVERS = {
  hobbit: coverHobbit,
  fellowship: coverFellowship,
  towers: coverTowers,
  king: coverKing,
};

// abertura de capítulo: rótulo e título com palavra em itálico que se decifra
function Chapter({ id, kicker, pre, em }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <header ref={ref} className="bchapter">
      <p className="bchapter__label">{kicker}</p>
      <h2 className="bchapter__title" id={id}>
        {pre}{" "}
        <em>
          <RuneText text={em} active={inView} />
        </em>
      </h2>
    </header>
  );
}

function Book({ book, cover, index }) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  return (
    <li ref={ref} className={`bbook ${inView ? "is-in" : ""}`} style={{ "--i": index }}>
      <div className="bbook__cover">
        <img src={cover} alt="" loading="lazy" decoding="async" />
      </div>
      <p className="bbook__meta">{book.year}</p>
      <h3 className="bbook__title">{book.title}</h3>
      <p className="bbook__text">{book.text}</p>
    </li>
  );
}

function InspirationsPage() {
  const { lang } = useLanguage();
  const c = INSPIRATIONS[lang];
  const titleRef = useRef(null);
  const [heroRef, heroIn] = useInView({ threshold: 0.1 });

  // foco no título ao chegar (leitores de tela anunciam a página nova)
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <article className={`book ${HERO.length ? "book--image" : ""}`} aria-labelledby="inspirations-title">
      <header className="bhero" ref={heroRef}>
        {HERO.length > 0 && (
          <img
            className="bhero__image"
            src={HERO[HERO.length - 1].url}
            srcSet={HERO_SRCSET}
            sizes="100vw"
            alt=""
            decoding="async"
            fetchPriority="high"
          />
        )}
        <div className="bhero__inner">
          <Link className="book-back" href="/#hero">
            {c.back}
          </Link>
          <p className="bhero__label">{c.label}</p>
          <h1 className="bhero__title" id="inspirations-title" ref={titleRef} tabIndex={-1}>
            <RuneText text={c.title} active={heroIn} />
          </h1>
          <p className="bhero__welcome">{c.welcome}</p>
          <span className="bhero__rule" aria-hidden="true" />
          <Words className="bhero__lead" text={c.lead} />
        </div>
      </header>

      {/* o Professor */}
      <section className="bsec" aria-labelledby="professor-title">
        <Chapter id="professor-title" kicker={c.professor.kicker} pre={c.professor.pre} em={c.professor.em} />
        <div className="bprof">
          <figure className="bprof__plate">
            <img src={tolkien} alt={c.professor.photoAlt} width="480" height="629" loading="lazy" decoding="async" />
            <figcaption>{c.plate} I · J.R.R. Tolkien</figcaption>
          </figure>
          <div className="bprof__body">
            {c.professor.paragraphs.map((text, i) => (
              <p key={text} className={i === 0 ? "bdrop" : undefined}>
                {text}
              </p>
            ))}
            <dl className="bprof__facts">
              {c.professor.facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* epígrafe */}
      <blockquote className="bquote">
        <p>{c.road}</p>
      </blockquote>

      {/* as obras */}
      <section className="bsec" aria-labelledby="works-title">
        <Chapter id="works-title" kicker={c.works.kicker} pre={c.works.pre} em={c.works.em} />
        <p className="bsec__intro">{c.works.intro}</p>
        <ol className="bshelf">
          {c.works.books.map((book, i) => (
            <Book key={book.key} book={book} cover={COVERS[book.key]} index={i} />
          ))}
        </ol>
      </section>

      {/* ecos no site: um índice */}
      <section className="bsec" aria-labelledby="echoes-title">
        <Chapter id="echoes-title" kicker={c.echoes.kicker} pre={c.echoes.pre} em={c.echoes.em} />
        <ol className="bindex">
          {c.echoes.items.map(([here, source]) => (
            <li key={here}>
              <span className="bindex__here">{here}</span>
              <span className="bindex__dots" aria-hidden="true" />
              <span className="bindex__source">{source}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* por que */}
      <section className="bsec" aria-labelledby="why-title">
        <Chapter id="why-title" kicker={c.why.kicker} pre={c.why.pre} em={c.why.em} />
        <div className="bwhy">
          {c.why.paragraphs.map((text, i) => (
            <Words key={text} className="bwhy__p" text={text} base={i * 0.3} />
          ))}
        </div>
      </section>

      {/* créditos, como nota de rodapé do livro */}
      <section className="bsec bsec--credits" aria-labelledby="credits-title">
        <div className="bcredits">
          <h2 className="bcredits__title" id="credits-title">
            {c.credits.title}
          </h2>
          {c.credits.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <Link className="book-back book-back--end" href="/#hero">
          {c.closing}
        </Link>
      </section>
    </article>
  );
}

export default InspirationsPage;

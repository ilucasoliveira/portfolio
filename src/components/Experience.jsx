import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import { CV_FILES } from "../data/cv";
import "./Experience.css";

function Experience() {
  const { t, lang } = useLanguage();
  const [ref, isVisible] = useReveal();
  const { experience } = t;

  return (
    <section
      id="jornada"
      className={`experience reveal ${isVisible ? "visible" : ""}`}
      ref={ref}
    >
      <div className="experience__header">
        <div>
          <div className="experience__chapter">
            <span className="experience__chapter-line" />
            {experience.chapter}
          </div>
          <h2 className="experience__title">
            {experience.titlePre} <em>{experience.titleEm}</em>
          </h2>
        </div>

        <a
          href={CV_FILES[lang]}
          target="_blank"
          rel="noopener noreferrer"
          className="experience__cv"
        >
          {experience.cv}
        </a>
      </div>

      <div className="experience__grid">
        <div className="experience__column">
          <h3 className="experience__column-title">{experience.workTitle}</h3>

          <ol className="experience__timeline">
            {experience.work.map((job) => (
              <li key={job.company} className="experience__item">
                <span className="experience__dot" aria-hidden="true" />
                <div className="experience__period">{job.period}</div>
                <h4 className="experience__role">{job.role}</h4>
                <div className="experience__org">{job.company}</div>
                <p className="experience__note">{job.note}</p>
                <ul className="experience__highlights">
                  {job.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div className="experience__column">
          <h3 className="experience__column-title">
            {experience.educationTitle}
          </h3>

          <ol className="experience__timeline">
            {experience.education.map((course) => (
              <li key={course.name} className="experience__item">
                <span className="experience__dot" aria-hidden="true" />
                <div className="experience__period">{course.period}</div>
                <h4 className="experience__role">{course.name}</h4>
                <div className="experience__org">{course.school}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Experience;

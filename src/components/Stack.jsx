import { useLanguage } from "../context/LanguageContext";
import { getStackData } from "../data/stack";
import { useReveal } from "../hooks/useReveal";
import "./Stack.css";

function Stack() {
  const { t, lang } = useLanguage();
  const categories = getStackData(lang);
  const [ref, isVisible] = useReveal();

  return (
    <section
      id="stack"
      className={`stack reveal ${isVisible ? "visible" : ""}`}
      ref={ref}
    >
      <div className="stack__header">
        <div className="stack__chapter">
          <span className="stack__chapter-line" />
          {t.stack.chapter}
        </div>
        <h2 className="stack__title">
          {t.stack.titlePre} <em>{t.stack.titleEm}</em>
        </h2>
      </div>

      <div className="stack__grid">
        {categories.map((category) => (
          <div key={category.title} className="stack__category">
            <div className="stack__category-header">
              {category.title}
              <span className="stack__category-line" />
            </div>

            {category.items.map((item) => (
              <div key={item.name} className="stack__item">
                <div className="stack__item-icon">{item.icon}</div>
                <div className="stack__item-name">{item.name}</div>
                <div className="stack__item-dots">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={`stack__dot ${i < item.level ? "stack__dot--filled" : ""}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stack;

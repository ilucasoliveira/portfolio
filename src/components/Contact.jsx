import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import "./Contact.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/message";

function Contact() {
  const { t } = useLanguage();
  const [ref, isVisible] = useReveal();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    setStatus("loading");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contato"
      className={`contact reveal ${isVisible ? "visible" : ""}`}
      ref={ref}
    >
      <div className="contact__header">
        <div className="contact__chapter">
          <span className="contact__chapter-line" />
          {t.contact.chapter}
        </div>
        <h2 className="contact__title">
          {t.contact.titlePre} <em>{t.contact.titleEm}</em>
        </h2>
      </div>

      <div className="contact__grid">
        <div className="contact__info">
          <h3 className="contact__subtitle">{t.contact.subtitle}</h3>
          <p className="contact__paragraph">{t.contact.paragraph}</p>

          <div className="contact__links">
            <a
              href="mailto:lucasdeoliveira937@gmail.com"
              className="contact__link"
            >
              <div className="contact__link-icon">✉</div>
              <div>
                <div className="contact__link-label">Email</div>
                <div className="contact__link-value">
                  lucasdeoliveira937@gmail.com
                </div>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/ilucasoliveira/"
              className="contact__link"
            >
              <div className="contact__link-icon contact__link-icon--mono">
                in
              </div>
              <div>
                <div className="contact__link-label">LinkedIn</div>
                <div className="contact__link-value">
                  linkedin.com/in/ilucasoliveira
                </div>
              </div>
            </a>

            <a
              href="https://github.com/ilucasoliveira"
              className="contact__link"
            >
              <div className="contact__link-icon contact__link-icon--mono">
                gh
              </div>
              <div>
                <div className="contact__link-label">GitHub</div>
                <div className="contact__link-value">
                  github.com/ilucasoliveira
                </div>
              </div>
            </a>

            <a
              href="https://www.instagram.com/ilucasoliveira_/"
              className="contact__link"
            >
              <div className="contact__link-icon">◎</div>
              <div>
                <div className="contact__link-label">Instagram</div>
                <div className="contact__link-value">@ilucasoliveira_</div>
              </div>
            </a>
          </div>
        </div>

        <div className="contact__form-wrap">
          <div className="contact__corner contact__corner--tl" />
          <div className="contact__corner contact__corner--tr" />
          <div className="contact__corner contact__corner--bl" />
          <div className="contact__corner contact__corner--br" />

          <div className="contact__field">
            <label className="contact__label">{t.contact.form.name}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t.contact.form.namePlaceholder}
              className="contact__input"
            />
          </div>

          <div className="contact__field">
            <label className="contact__label">{t.contact.form.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t.contact.form.emailPlaceholder}
              className="contact__input"
            />
          </div>

          <div className="contact__field">
            <label className="contact__label">{t.contact.form.subject}</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t.contact.form.subjectPlaceholder}
              className="contact__input"
            />
          </div>

          <div className="contact__field">
            <label className="contact__label">{t.contact.form.message}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t.contact.form.messagePlaceholder}
              className="contact__textarea"
            />
          </div>

          <button
            className={`contact__submit ${
              status === "loading" ? "contact__submit--sending" : ""
            }`}
            onClick={handleSubmit}
            disabled={status === "loading"}
          >
            {status === "loading"
              ? t.contact.form.sending
              : t.contact.form.submit}
          </button>

          {status === "success" && (
            <div className="contact__status contact__status--success">
              {t.contact.form.success}
            </div>
          )}
          {status === "error" && (
            <div className="contact__status contact__status--error">
              {t.contact.form.error}
            </div>
          )}
          {status === "idle" && (
            <div className="contact__hint">{t.contact.form.hint}</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;

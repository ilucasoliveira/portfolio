import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import { MESSAGE_URL } from "../services/api";
import ApiStatus from "./ApiStatus";
import Nebula from "./Nebula";
import RuneText from "./RuneText";
import "./Contact.css";

const CONTACT_EMAIL = "lucasoliveirapimentel.dev@gmail.com";
const REQUEST_TIMEOUT_MS = 20000;
const MESSAGE_MIN_LENGTH = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const FIELDS = [
  { name: "name", type: "text", autoComplete: "name", maxLength: 100 },
  { name: "email", type: "email", autoComplete: "email", maxLength: 254 },
  { name: "subject", type: "text", autoComplete: "off", maxLength: 150 },
  { name: "message", multiline: true, maxLength: 5000 },
];

function validate(data, messages) {
  const errors = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const subject = data.subject.trim();
  const message = data.message.trim();

  if (!name) errors.name = messages.fieldRequired;

  if (!email) errors.email = messages.fieldRequired;
  else if (!EMAIL_PATTERN.test(email)) errors.email = messages.fieldEmail;

  if (!subject) errors.subject = messages.fieldRequired;

  if (!message) errors.message = messages.fieldRequired;
  else if (message.length < MESSAGE_MIN_LENGTH)
    errors.message = messages.fieldMessageShort;

  return errors;
}

function Contact() {
  const { t } = useLanguage();
  const [ref, isVisible] = useReveal();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const found = validate(formData, t.contact.form);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    if (!MESSAGE_URL) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(MESSAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (response.status === 429) {
        setStatus("rateLimit");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData(EMPTY_FORM);
    } catch (error) {
      setStatus(error.name === "TimeoutError" ? "timeout" : "error");
    }
  }

  function handleLanternMove(e) {
    const name = e.currentTarget.firstElementChild;
    const rect = name.getBoundingClientRect();
    name.style.setProperty("--lx", `${e.clientX - rect.left}px`);
    name.style.setProperty("--ly", `${e.clientY - rect.top}px`);
  }

  function handleLanternLeave(e) {
    const name = e.currentTarget.firstElementChild;
    name.style.removeProperty("--lx");
    name.style.removeProperty("--ly");
  }

  const statusMessages = {
    success: t.contact.form.success,
    error: t.contact.form.error,
    rateLimit: t.contact.form.errorRateLimit,
    timeout: t.contact.form.errorTimeout,
  };
  const statusMessage = statusMessages[status];

  return (
    <section
      id="contato"
      className={`contact reveal ${isVisible ? "visible" : ""}`}
      ref={ref}
    >
      <Nebula />

      <div className="contact__header">
        <div className="contact__chapter">
          <span className="contact__chapter-line" />
          {t.contact.chapter}
        </div>
        <h2 className="contact__title">
          {t.contact.titlePre}{" "}
          <em>
            <RuneText text={t.contact.titleEm} active={isVisible} />
          </em>
        </h2>
      </div>

      <div className="contact__grid">
        <div className="contact__info" data-serpent="contact-info">
          <h3 className="contact__subtitle">{t.contact.subtitle}</h3>
          <p className="contact__paragraph">{t.contact.paragraph}</p>

          <div className="contact__links">
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact__link">
              <div className="contact__link-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <rect x="2" y="5" width="20" height="14" />
                  <path d="M2 6 L12 13 L22 6" />
                </svg>
              </div>
              <div>
                <div className="contact__link-label">Email</div>
                <div className="contact__link-value">{CONTACT_EMAIL}</div>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/ilucasoliveira/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact__link"
            >
              <div
                className="contact__link-icon contact__link-icon--mono"
                aria-hidden="true"
              >
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
              target="_blank"
              rel="noopener noreferrer"
              className="contact__link"
            >
              <div
                className="contact__link-icon contact__link-icon--mono"
                aria-hidden="true"
              >
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
              target="_blank"
              rel="noopener noreferrer"
              className="contact__link"
            >
              <div className="contact__link-icon" aria-hidden="true">
                ◎
              </div>
              <div>
                <div className="contact__link-label">Instagram</div>
                <div className="contact__link-value">@ilucasoliveira_</div>
              </div>
            </a>
          </div>

          <ApiStatus active={isVisible} />

          <div
            className="contact__easter"
            data-serpent="end"
            aria-hidden="true"
            onPointerMove={handleLanternMove}
            onPointerDown={handleLanternMove}
            onPointerLeave={handleLanternLeave}
          >
            <span className="contact__easter-name">
              Lucas de Oliveira Pimentel
            </span>
          </div>
        </div>

        <form
          className="contact__form-wrap"
          data-serpent="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="contact__corner contact__corner--tl" />
          <div className="contact__corner contact__corner--tr" />
          <div className="contact__corner contact__corner--bl" />
          <div className="contact__corner contact__corner--br" />

          {FIELDS.map((field) => {
            const id = `contact-${field.name}`;
            const errorId = `${id}-error`;
            const error = errors[field.name];
            const fieldProps = {
              id,
              name: field.name,
              value: formData[field.name],
              onChange: handleChange,
              placeholder: t.contact.form[`${field.name}Placeholder`],
              maxLength: field.maxLength,
              "aria-invalid": Boolean(error),
              "aria-describedby": error ? errorId : undefined,
            };

            return (
              <div key={field.name} className="contact__field">
                <label htmlFor={id} className="contact__label">
                  {t.contact.form[field.name]}
                </label>

                {field.multiline ? (
                  <textarea
                    {...fieldProps}
                    className={`contact__textarea ${error ? "contact__input--invalid" : ""}`}
                  />
                ) : (
                  <input
                    {...fieldProps}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    className={`contact__input ${error ? "contact__input--invalid" : ""}`}
                  />
                )}

                {error && (
                  <p id={errorId} className="contact__error">
                    {error}
                  </p>
                )}
              </div>
            );
          })}

          <div className="contact__honeypot" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className={`contact__submit ${
              status === "loading" ? "contact__submit--sending" : ""
            }`}
            disabled={status === "loading"}
          >
            {status === "loading"
              ? t.contact.form.sending
              : t.contact.form.submit}
          </button>

          <div role="status" aria-live="polite">
            {statusMessage && (
              <div
                className={`contact__status ${
                  status === "success"
                    ? "contact__status--success"
                    : "contact__status--error"
                }`}
              >
                {statusMessage}
              </div>
            )}
          </div>

          {status === "idle" && (
            <div className="contact__hint" aria-hidden="true">
              {t.contact.form.hint}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;

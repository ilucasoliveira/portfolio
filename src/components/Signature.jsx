import { useLanguage } from "../context/LanguageContext";
import { useReveal } from "../hooks/useReveal";
import "./Signature.css";

function Signature() {
  const { t } = useLanguage();
  const [ref, isVisible] = useReveal(0.6);

  return (
    <div ref={ref} className={`signature ${isVisible ? "visible" : ""}`}>
      <span className="signature__name">Lucas de Oliveira</span>
      <svg
        className="signature__flourish"
        viewBox="0 0 260 26"
        aria-hidden="true"
      >
        <path
          className="signature__stroke"
          pathLength="1"
          d="M8 14 C 70 4, 150 24, 200 12 S 250 8, 254 13"
        />
        <path
          className="signature__leaf"
          pathLength="1"
          d="M198 12 c 6 -7 14 -7 18 -1 c -5 5 -13 5 -18 1"
        />
      </svg>
      <span className="signature__caption">{t.about.signatureCaption}</span>
    </div>
  );
}

export default Signature;

import { useRuneDecode } from "../hooks/useRuneDecode";
import "./RuneText.css";

function RuneText({ text, active }) {
  const display = useRuneDecode(text, active);
  const decoding = display !== text;

  return (
    <span className={`rune-text ${decoding ? "rune-text--decoding" : ""}`}>
      <span className="sr-only">{text}</span>
      <span className="rune-text__final" aria-hidden="true">
        {text}
      </span>
      {decoding && (
        <span className="rune-text__scramble" aria-hidden="true">
          {display}
        </span>
      )}
    </span>
  );
}

export default RuneText;

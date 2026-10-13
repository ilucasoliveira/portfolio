import { useRuneDecode } from "../hooks/useRuneDecode";
import "./RuneText.css";

/*
 * Texto que surge decifrando runas. Durante a decifração cada letra ainda oculta
 * continua no lugar (invisível) e a runa aparece por cima dela: o título já ocupa
 * o espaço e as quebras de linha finais, então nada pula nem muda de linha.
 */
function RuneText({ text, active }) {
  const display = useRuneDecode(text, active);
  const decoding = display !== text;

  if (!decoding) {
    return <span className="rune-text">{text}</span>;
  }

  const chars = [...text];
  const shown = [...display];

  return (
    <span className="rune-text rune-text--decoding">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((char, i) =>
          shown[i] === char ? (
            char
          ) : (
            <span key={i} className="rune-text__ch" data-rune={shown[i]}>
              {char}
            </span>
          ),
        )}
      </span>
    </span>
  );
}

export default RuneText;

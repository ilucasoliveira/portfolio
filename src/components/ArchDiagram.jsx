import { tx } from "../data/projects";
import Corners from "./Corners";
import "./ArchDiagram.css";

// iluminura: diagrama de arquitetura em grade de 5 colunas (nó, seta, nó, seta, nó)
function ArchDiagram({ cells, label, caption, captionLead, lang, size = "md" }) {
  return (
    <figure className={`arch arch--${size}`}>
      <Corners />

      <div className="arch__grid" role="img" aria-label={label}>
        {cells.map((cell, i) => {
          if (cell.kind === "gap") return <span key={i} aria-hidden="true" />;
          if (cell.kind === "arrow") {
            return (
              <div key={i} className="arch__arrow" aria-hidden="true">
                {cell.t}
                {cell.s && <small>{tx(cell.s, lang)}</small>}
              </div>
            );
          }
          return (
            <div key={i} className={`arch__node ${cell.core ? "arch__node--core" : ""}`} aria-hidden="true">
              {tx(cell.t, lang)}
              {cell.s && <small>{tx(cell.s, lang)}</small>}
            </div>
          );
        })}
      </div>

      {caption && (
        <figcaption className="arch__caption">
          <b>{captionLead}</b> · {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default ArchDiagram;

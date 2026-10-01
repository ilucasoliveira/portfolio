import nebula from "../assets/nebula.webp";
import "./Nebula.css";

const LAYERS = ["base", "echo", "halo"];

function Nebula() {
  return (
    <div className="nebula" aria-hidden="true">
      {LAYERS.map((layer) => (
        <img
          key={layer}
          src={nebula}
          alt=""
          width="720"
          height="720"
          loading="lazy"
          decoding="async"
          className={`nebula__layer nebula__layer--${layer}`}
        />
      ))}
      <span className="nebula__anchor" data-serpent="nebula" />
    </div>
  );
}

export default Nebula;

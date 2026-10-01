import { useEffect, useRef, useState } from "react";
import nebula from "../assets/nebula.webp";
import "./Nebula.css";

const LAYERS = ["base", "echo", "halo"];

function Nebula() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`nebula ${visible ? "" : "nebula--paused"}`}
      aria-hidden="true"
    >
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

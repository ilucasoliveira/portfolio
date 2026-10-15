import { useInView } from "../hooks/useInView";
import { FUTHARK } from "../utils/runes";
import "./StoneStack.css";

/*
 * A stack de uma obra gravada numa muralha de pedra branca: cada ferramenta é um
 * bloco com a sua runa. Quando a muralha aparece, as runas acendem uma a uma,
 * como as janelas da cidade na página das obras.
 */
function StoneStack({ stack, labelledBy, children }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  return (
    <section className={`stone ${inView ? "is-lit" : ""}`} aria-labelledby={labelledBy} ref={ref}>
      <div className="stone__head">{children}</div>
      <ul className="stone__wall">
        {stack.map(([name, role], i) => (
          <li key={name} className="stone__block" style={{ "--i": i }}>
            <span className="stone__rune" aria-hidden="true">
              {FUTHARK[(i * 7 + 3) % FUTHARK.length]}
            </span>
            <span className="stone__name">{name}</span>
            <span className="stone__role">{role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default StoneStack;

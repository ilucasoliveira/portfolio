import { Fragment } from "react";
import { useInView } from "../hooks/useInView";

// texto que surge palavra por palavra, saindo da névoa
function Words({ as: Tag = "p", text, className = "", base = 0, children, ...props }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const words = text.split(" ");

  return (
    <Tag
      ref={ref}
      className={`words ${inView ? "is-in" : ""} ${className}`}
      style={{ "--base": `${base}s` }}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="w" style={{ "--i": i }}>
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
      {children}
    </Tag>
  );
}

export default Words;

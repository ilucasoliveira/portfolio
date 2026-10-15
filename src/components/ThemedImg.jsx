import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";

/*
 * Imagem com versão de dia e de noite. Só a do tema ativo é baixada; ao trocar de
 * tema a outra entra por cima com um fade (o dia nascendo ou caindo), e as duas
 * ficam montadas daí em diante. As duas cobrem o mesmo quadro (position: absolute),
 * então o elemento pai precisa ter tamanho e position.
 *
 * day / night: { src, srcSet? }; o resto (sizes, alt, className...) vale para as duas.
 */
function Img({ variant, image, className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      {...props}
      src={image.src}
      srcSet={image.srcSet}
      className={`theme-img theme-img--${variant} ${loaded ? "is-loaded" : ""} ${className}`}
      ref={(el) => {
        if (el?.complete && el.naturalWidth && !loaded) setLoaded(true);
      }}
      onLoad={() => setLoaded(true)}
    />
  );
}

function ThemedImg({ day, night, ...props }) {
  const theme = useTheme();
  const active = theme === "light" ? "day" : "night";
  const [seen, setSeen] = useState(() => ({ [active]: true }));

  useEffect(() => {
    setSeen((prev) => (prev[active] ? prev : { ...prev, [active]: true }));
  }, [active]);

  return (
    <>
      {seen.night && <Img variant="night" image={night} {...props} />}
      {seen.day && <Img variant="day" image={day} {...props} />}
    </>
  );
}

export default ThemedImg;

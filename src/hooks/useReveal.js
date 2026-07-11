import { useEffect, useRef, useState } from "react";

export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // já revelou, não precisa mais observar
        }
      },
      { threshold },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

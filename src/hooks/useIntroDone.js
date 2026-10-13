import { useEffect, useState } from "react";

// true quando a abertura (Intro) terminou ou não vai acontecer
export function useIntroDone() {
  const [done, setDone] = useState(() => !document.documentElement.classList.contains("is-intro"));

  useEffect(() => {
    const root = document.documentElement;
    const check = () => setDone(!root.classList.contains("is-intro"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return done;
}

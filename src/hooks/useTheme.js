import { useEffect, useState } from "react";

/*
 * Tema do site: "dark" (noite) ou "light" (dia). O index.html já põe o tema no
 * <html data-theme> antes de pintar (a escolha salva, ou o modo do aparelho), então
 * aqui só lemos, trocamos e avisamos quem estiver ouvindo.
 */

const KEY = "theme";
const EVENT = "app:theme";
const BAR = { light: "#f1ead8", dark: "#07070a" };
let switching = 0;

export function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function savedTheme() {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

// troca o tema; remember=false quando quem mudou foi o aparelho (a pessoa não escolheu)
export function setTheme(next, { remember = true } = {}) {
  const root = document.documentElement;
  if (remember) {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // sem localStorage, vale só até fechar a aba
    }
  }
  if (root.dataset.theme === next) return;
  // as cores mudam devagar durante a troca (classe tirada depois que acabam)
  root.classList.add("theme-switching");
  clearTimeout(switching);
  switching = setTimeout(() => root.classList.remove("theme-switching"), 1300);
  root.dataset.theme = next;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BAR[next]);
  window.dispatchEvent(new Event(EVENT));
}

export function useTheme() {
  const [theme, setState] = useState(currentTheme);
  useEffect(() => {
    const update = () => setState(currentTheme());
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, []);
  return theme;
}

// enquanto a pessoa não escolher um tema, o site acompanha o modo do aparelho
export function useFollowSystemTheme() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (event) => {
      if (!savedTheme()) setTheme(event.matches ? "light" : "dark", { remember: false });
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
}

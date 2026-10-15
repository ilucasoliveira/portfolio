import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../utils/motion";

/*
 * Roteamento mínimo sem dependência nova: a home ("/"), a de projeto
 * ("/projetos/:slug"), a de inspirações ("/inspiracoes") e a oficina ("/oficina").
 * O vercel.json reescreve essas rotas para o index.html.
 */

const PROJECT_PATH = /^\/projetos\/([^/]+)\/?$/;
const INSPIRATIONS_PATH = /^\/inspiracoes\/?$/;
const WORKSHOP_PATH = /^\/oficina\/?$/;
const ROUTE_EVENT = "app:navigate";
export const VEIL_EVENT = "app:veil";

// qual página um caminho abre (também usado pelos links para baixar a página antes)
export function routeFor(pathname) {
  const match = pathname.match(PROJECT_PATH);
  if (match) return { page: "project", slug: decodeURIComponent(match[1]) };
  if (INSPIRATIONS_PATH.test(pathname)) return { page: "inspirations" };
  if (WORKSHOP_PATH.test(pathname)) return { page: "workshop" };
  return { page: "home" };
}

function readRoute() {
  return routeFor(window.location.pathname);
}

export function useRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const update = () => setRoute(readRoute());
    window.addEventListener("popstate", update);
    window.addEventListener(ROUTE_EVENT, update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener(ROUTE_EVENT, update);
    };
  }, []);

  return route;
}

function resolve(href) {
  const url = new URL(href, window.location.origin);
  // mantém ?lang= quando ele já está na URL atual
  const lang = new URLSearchParams(window.location.search).get("lang");
  if (lang && !url.searchParams.has("lang")) url.searchParams.set("lang", lang);
  return url;
}

// troca a página na hora (usado pelo véu de transição no meio da animação)
export function go(href) {
  const url = resolve(href);
  window.history.pushState(null, "", url.pathname + url.search + url.hash);
  window.dispatchEvent(new Event(ROUTE_EVENT));

  // depois da troca: rola até a âncora (esperando a página montar) ou volta ao topo
  const scroll = () => {
    const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;
    if (target) target.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  };
  requestAnimationFrame(() => requestAnimationFrame(scroll));
}

// troca de página com o véu (portal) quando há movimento; sem movimento, direto
export function navigate(href, origin) {
  const url = resolve(href);
  const samePath = url.pathname === window.location.pathname;
  if (samePath || prefersReducedMotion()) {
    go(href);
    return;
  }
  window.dispatchEvent(new CustomEvent(VEIL_EVENT, { detail: { href, origin } }));
}

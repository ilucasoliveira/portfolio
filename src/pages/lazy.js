import { lazy } from "react";

/*
 * As páginas fora da home ficam em arquivos separados: quem abre só a home não
 * baixa o código da Oficina, das Inspirações nem das obras.
 * preloadPage começa o download antes da troca (ao passar o mouse, focar ou
 * clicar num link), então a página costuma estar pronta quando o véu se abre.
 */

const LOADERS = {
  projects: () => import("./ProjectsPage"),
  project: () => import("./ProjectPage"),
  inspirations: () => import("./InspirationsPage"),
  workshop: () => import("./WorkshopPage"),
};

export const ProjectsPage = lazy(LOADERS.projects);
export const ProjectPage = lazy(LOADERS.project);
export const InspirationsPage = lazy(LOADERS.inspirations);
export const WorkshopPage = lazy(LOADERS.workshop);

const started = new Set();

export function preloadPage(page) {
  if (!LOADERS[page] || started.has(page)) return;
  started.add(page);
  // se falhar (sem rede), o lazy tenta de novo quando a página for montada
  LOADERS[page]().catch(() => started.delete(page));
}

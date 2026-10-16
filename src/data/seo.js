import { translations } from "./translations";
import { findProject, tx } from "./projects";

/*
 * Título, descrição e imagem de prévia de cada página, num lugar só.
 * Usado pelo App (no navegador) e pelo scripts/prerender.mjs (no build, para gerar
 * um HTML por página: WhatsApp, LinkedIn e afins não rodam JavaScript).
 */

export const SITE_URL = "https://ilucasoliveira.dev";

// as imagens ficam em public/og (1200x630)
const IMAGE_ALT = {
  en: {
    home: "Lucas de Oliveira, Full Stack Python Developer, over the valley of Valinor at night",
    projects: "The works of Lucas de Oliveira over the white city of Gondolin",
    workshop: "The workshop of Lucas de Oliveira in the dwarf halls of Moria",
    inspirations: "The Shire, where the inspirations of this portfolio begin",
    project: (name) => `${name}, a work by Lucas de Oliveira, over the city of Gondolin`,
  },
  pt: {
    home: "Lucas de Oliveira, Desenvolvedor Full Stack Python, sobre o vale de Valinor à noite",
    projects: "As obras de Lucas de Oliveira sobre a cidade branca de Gondolin",
    workshop: "A oficina de Lucas de Oliveira nos salões dos anões de Moria",
    inspirations: "O Condado, onde começam as inspirações deste portfólio",
    project: (name) => `${name}, uma obra de Lucas de Oliveira, sobre a cidade de Gondolin`,
  },
};

export function pageMeta(route, lang) {
  const m = translations[lang].meta;
  const alt = IMAGE_ALT[lang];

  if (route.page === "project") {
    const project = findProject(route.slug);
    if (!project) {
      return {
        title: `${translations[lang].projectPage.notFound} · Lucas de Oliveira`,
        description: m.projectsDescription,
        image: "projects",
        imageAlt: alt.projects,
        notFound: true,
      };
    }
    const name = tx(project.name, lang);
    return {
      title: `${name} · Lucas de Oliveira`,
      description: project.text[lang].summary,
      image: `project-${project.slug}`,
      imageAlt: alt.project(name),
    };
  }
  if (route.page === "projects") {
    return { title: m.projects, description: m.projectsDescription, image: "projects", imageAlt: alt.projects };
  }
  if (route.page === "workshop") {
    return { title: m.workshop, description: m.workshopDescription, image: "workshop", imageAlt: alt.workshop };
  }
  if (route.page === "inspirations") {
    return {
      title: m.inspirations,
      description: m.inspirationsDescription,
      image: "inspirations",
      imageAlt: alt.inspirations,
    };
  }
  return { title: m.title, description: m.description, image: "home", imageAlt: alt.home };
}

export function ogImageUrl(image) {
  return `${SITE_URL}/og/${image}.jpg`;
}

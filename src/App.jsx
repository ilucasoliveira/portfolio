import { Suspense, useEffect } from "react";
import "./styles/fonts.css";
import "./styles/global.css";
import "./styles/day.css";
import { useLanguage } from "./context/LanguageContext";
import { useRoute } from "./hooks/useRoute";
import { findProject, tx } from "./data/projects";
import Background from "./components/Background";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { AnchorJump, Hairlines, Intro, RouteVeil } from "./components/Veils";
import Home from "./pages/Home";
import { InspirationsPage, ProjectPage, ProjectsPage, WorkshopPage } from "./pages/lazy";

function setMeta(selector, attr, value) {
  document.head.querySelector(selector)?.setAttribute(attr, value);
}

function App() {
  const route = useRoute();
  const { t, lang } = useLanguage();
  const project = route.page === "project" ? findProject(route.slug) : null;

  // título, descrição e endereço canônico acompanham a página e o idioma (o Google lê
  // depois de rodar o JavaScript: cada página aparece na busca como ela mesma, não como a Home)
  useEffect(() => {
    const m = t.meta;
    let title = m.title;
    let description = m.description;
    if (project) {
      title = `${tx(project.name, lang)} · Lucas de Oliveira`;
      description = project.text[lang].summary;
    } else if (route.page === "projects") {
      title = m.projects;
      description = m.projectsDescription;
    } else if (route.page === "inspirations") {
      title = m.inspirations;
      description = m.inspirationsDescription;
    } else if (route.page === "workshop") {
      title = m.workshop;
      description = m.workshopDescription;
    }
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const url = `${window.location.origin}${path}`;
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('link[rel="canonical"]', "href", url);

    // endereço de obra que não existe: a página avisa e pede para não ser indexada
    let robots = document.head.querySelector('meta[name="robots"]');
    if (route.page === "project" && !project) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        document.head.append(robots);
      }
      robots.content = "noindex";
      document.title = `${t.projectPage.notFound} · Lucas de Oliveira`;
    } else {
      robots?.remove();
    }
  }, [project, route.page, t, lang]);

  // a página de inspirações tem o clima claro do Condado (sem céu noturno)
  const shire = route.page === "inspirations";
  useEffect(() => {
    document.documentElement.classList.toggle("page-shire", shire);
  }, [shire]);

  const pageKey = route.page === "project" ? route.slug : route.page;
  let page = <Home />;
  if (route.page === "projects") page = <ProjectsPage />;
  if (route.page === "project") page = <ProjectPage slug={route.slug} />;
  if (route.page === "inspirations") page = <InspirationsPage />;
  if (route.page === "workshop") page = <WorkshopPage />;

  return (
    <div className="app">
      {!shire && <Background />}
      <Hairlines />
      <Nav page={route.page} />
      <main key={pageKey}>
        {/* enquanto o código da página chega, uma tela vazia segura o rodapé lá embaixo */}
        <Suspense fallback={<div className="page-loading" />}>{page}</Suspense>
      </main>
      {/* na home o rodapé faz parte do epílogo */}
      {/* na Oficina o rodapé fica no fundo da mina, na noite, também de dia */}
      {route.page !== "home" && <Footer className={route.page === "workshop" ? "night-zone" : ""} />}
      <RouteVeil />
      <AnchorJump />
      <Intro />
    </div>
  );
}

export default App;

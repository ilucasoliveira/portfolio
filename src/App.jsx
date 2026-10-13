import { useEffect } from "react";
import "./styles/global.css";
import { useLanguage } from "./context/LanguageContext";
import { useRoute } from "./hooks/useRoute";
import { findProject, tx } from "./data/projects";
import Background from "./components/Background";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { AnchorJump, Hairlines, Intro, RouteVeil } from "./components/Veils";
import Home from "./pages/Home";
import ProjectPage from "./pages/ProjectPage";
import InspirationsPage from "./pages/InspirationsPage";
import { INSPIRATIONS } from "./data/inspirations";

function App() {
  const route = useRoute();
  const { t, lang } = useLanguage();
  const project = route.page === "project" ? findProject(route.slug) : null;

  // título da aba acompanha a página e o idioma
  useEffect(() => {
    if (project) document.title = `${tx(project.name, lang)} · Lucas de Oliveira`;
    else if (route.page === "inspirations") document.title = INSPIRATIONS[lang].metaTitle;
    else document.title = t.meta.title;
  }, [project, route.page, t, lang]);

  // a página de inspirações tem o clima claro do Condado (sem céu noturno)
  const shire = route.page === "inspirations";
  useEffect(() => {
    document.documentElement.classList.toggle("page-shire", shire);
  }, [shire]);

  const pageKey = route.page === "project" ? route.slug : route.page;
  let page = <Home />;
  if (route.page === "project") page = <ProjectPage slug={route.slug} />;
  if (route.page === "inspirations") page = <InspirationsPage />;

  return (
    <div className="app">
      {!shire && <Background />}
      <Hairlines />
      <Nav page={route.page} />
      <main key={pageKey}>{page}</main>
      {/* na home o rodapé faz parte do epílogo */}
      {route.page !== "home" && <Footer />}
      <RouteVeil />
      <AnchorJump />
      <Intro />
    </div>
  );
}

export default App;

import { Suspense, useEffect } from "react";
import "./styles/fonts.css";
import "./styles/global.css";
import "./styles/day.css";
import { useLanguage } from "./context/LanguageContext";
import { useRoute } from "./hooks/useRoute";
import { ogImageUrl, pageMeta } from "./data/seo";
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
  const { lang } = useLanguage();

  // título, descrição, prévia e endereço canônico acompanham a página e o idioma (o Google lê
  // depois de rodar o JavaScript; para quem não roda, o build gera um HTML por página)
  useEffect(() => {
    const meta = pageMeta({ page: route.page, slug: route.slug }, lang);
    // cada idioma tem o seu endereço: inglês sem nada, português com ?lang=pt.
    // o canônico aponta para a versão que está na tela, e os alternates ligam as duas
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const en = `${window.location.origin}${path}`;
    const pt = `${en}?lang=pt`;
    const url = lang === "pt" ? pt : en;
    document.title = meta.title;
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[property="og:title"]', "content", meta.title);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", ogImageUrl(meta.image));
    setMeta('meta[property="og:image:alt"]', "content", meta.imageAlt);
    setMeta('meta[property="og:locale"]', "content", lang === "pt" ? "pt_BR" : "en_US");
    setMeta('meta[property="og:locale:alternate"]', "content", lang === "pt" ? "en_US" : "pt_BR");
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('link[hreflang="en"]', "href", en);
    setMeta('link[hreflang="pt-BR"]', "href", pt);
    setMeta('link[hreflang="x-default"]', "href", en);

    // endereço de obra que não existe: a página avisa e pede para não ser indexada
    let robots = document.head.querySelector('meta[name="robots"]');
    if (meta.notFound) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        document.head.append(robots);
      }
      robots.content = "noindex";
    } else {
      robots?.remove();
    }
  }, [route.page, route.slug, lang]);

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

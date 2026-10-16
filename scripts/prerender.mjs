/*
 * Roda depois do `vite build` (npm run build). Faz duas coisas no dist/:
 *
 * 1. Um HTML por página (projetos.html, oficina.html, projetos/<obra>.html...), cada um
 *    com o próprio título, descrição e imagem de prévia. WhatsApp, LinkedIn e afins não
 *    rodam JavaScript: sem isso, todo link mostraria a prévia da Home. A Vercel serve
 *    esses arquivos pelo endereço limpo (cleanUrls no vercel.json).
 *
 * 2. A CSP (Content Security Policy) em cada HTML: a lista do que a página pode carregar.
 *    Os scripts escritos direto no HTML entram pela impressão digital (hash) calculada
 *    aqui, então mudar um deles não quebra nada: o próximo build recalcula.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { register } from "node:module";
import { dirname, join } from "node:path";
import { loadEnv } from "vite";

register("./asset-stub.mjs", import.meta.url);
const { SITE_URL, ogImageUrl, pageMeta } = await import("../src/data/seo.js");
const { PROJECTS } = await import("../src/data/projects.js");

const DIST = join(import.meta.dirname, "..", "dist");
const LANG = "en"; // a prévia de link sai em inglês, como o idioma padrão do site

const ROUTES = [
  { path: "/", file: "index.html", route: { page: "home" } },
  { path: "/projetos", file: "projetos.html", route: { page: "projects" } },
  { path: "/oficina", file: "oficina.html", route: { page: "workshop" } },
  { path: "/inspiracoes", file: "inspiracoes.html", route: { page: "inspirations" } },
  ...PROJECTS.map((project) => ({
    path: `/projetos/${project.slug}`,
    file: `projetos/${project.slug}.html`,
    route: { page: "project", slug: project.slug },
  })),
];

const escape = (text) =>
  text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function seoBlock(path, meta) {
  const en = `${SITE_URL}${path}`;
  const pt = `${en}?lang=pt`;
  const tags = [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<link rel="canonical" href="${en}" />`,
    `<link rel="alternate" hreflang="en" href="${en}" />`,
    `<link rel="alternate" hreflang="pt-BR" href="${pt}" />`,
    `<link rel="alternate" hreflang="x-default" href="${en}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Lucas de Oliveira" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:url" content="${en}" />`,
    `<meta property="og:image" content="${ogImageUrl(meta.image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escape(meta.imageAlt)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:locale:alternate" content="pt_BR" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  return `<!-- seo (gerado por scripts/prerender.mjs) -->\n    ${tags.join("\n    ")}`;
}

// de onde a página pode buscar dados: o próprio site e a API de contato (Render)
const env = loadEnv("production", join(import.meta.dirname, ".."), "VITE_");
const apiOrigin = env.VITE_API_URL ? new URL(env.VITE_API_URL).origin : null;
const connect = ["'self'", apiOrigin, "https://*.onrender.com"].filter(Boolean);

function withCsp(html) {
  const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    ([, code]) => `'sha256-${createHash("sha256").update(code).digest("base64")}'`,
  );
  const policy = [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(" ")}`.trim(),
    "style-src 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${[...new Set(connect)].join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
  // logo depois do charset: vale para tudo o que vem depois, inclusive os scripts do <head>
  return html.replace(
    /(<meta charset="UTF-8" \/>)/,
    `$1\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
  );
}

const template = await readFile(join(DIST, "index.html"), "utf8");
const BLOCK = /<!--\s*seo:start[\s\S]*?seo:end -->/;
if (!BLOCK.test(template)) throw new Error("prerender: bloco seo:start/seo:end não encontrado no index.html");

for (const { path, file, route } of ROUTES) {
  const meta = pageMeta(route, LANG);
  const html = withCsp(template.replace(BLOCK, seoBlock(path, meta)));
  const out = join(DIST, file);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
}

const notFound = join(DIST, "404.html");
await writeFile(notFound, withCsp(await readFile(notFound, "utf8")));

console.log(`prerender: ${ROUTES.length} páginas + 404, com CSP (connect-src ${connect.join(" ")})`);

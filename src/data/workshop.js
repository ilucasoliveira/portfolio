/*
 * A Oficina: as ferramentas com que as obras foram forjadas, em ordem de descida
 * pelas minas. São duas partes (antes e depois da faixa da ponte), cada uma com
 * suas categorias; cada ferramenta
 * tem um logo (ou uma runa, quando não há logo), uma frase em cada idioma,
 * os projetos onde entrou (pelo slug de src/data/projects.js) e o site oficial.
 *
 * used: "all" quer dizer todos os projetos (aparece como "todos os projetos").
 *
 * EASTER_EGG: a frase que aparece ao passar o mouse sobre o mago, no fim da página
 * (fica em inglês nos dois idiomas, como a fala clássica).
 */

export const EASTER_EGG = "You shall not pass!";

const both = (en, pt) => ({ en, pt });

export const WORKSHOP_TEXT = {
  en: {
    chapter: "Chapter IV",
    titlePre: "The",
    titleEm: "Workshop",
    intro:
      "Every tool the works were forged with, and where each one went in. Go down slowly: the deeper you go, the closer to the fire.",
    descend: "Descend",
    usedIn: "Used in",
    allProjects: "every project",
    visit: "Visit",
    visitLabel: "{name} official site (opens in a new tab)",
    finaleLabel: "A wizard with a staff of white light faces a creature of fire in the depths",
    finale: "In the deep places, only what was forged to last endures.",
    toProjects: "See the works",
    toContact: "Open a channel",
  },
  pt: {
    chapter: "Capítulo IV",
    titlePre: "A",
    titleEm: "Oficina",
    intro:
      "Cada ferramenta com que as obras foram forjadas, e onde ela entrou. Desça devagar: quanto mais fundo, mais perto do fogo.",
    descend: "Descer",
    usedIn: "Usado em",
    allProjects: "todos os projetos",
    visit: "Visitar",
    visitLabel: "Site oficial de {name} (abre em nova aba)",
    finaleLabel: "Um mago com um cajado de luz branca enfrenta uma criatura de fogo nas profundezas",
    finale: "Nas profundezas, só resiste o que foi forjado para durar.",
    toProjects: "Ver as obras",
    toContact: "Abrir um canal",
  },
};

const SOUNDPRINT = "mysoundprint";
const ROTA = "rota151";
const BOOKSHELF = "personal-library";
const TRACKER = "portfolio-tracker-api";
const MOVIES = "movies-api";

export const SCENES = [
  {
    id: "salao",
    categories: [
      {
        title: both("Languages", "Linguagens"),
        tools: [
          {
            name: "Python",
            icon: "python",
            url: "https://www.python.org",
            text: both(
              "My main language. Every API I have published is written in Python, from the routes to the tests.",
              "Minha linguagem principal. Todas as APIs que publiquei são escritas em Python, das rotas aos testes.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF, TRACKER, MOVIES],
          },
          {
            name: "SQL",
            rune: "ᛞ",
            text: both(
              "To query and to check what the ORM actually sends to the database, and in the migrations of the PostgreSQL projects.",
              "Para consultar e conferir o que o ORM manda de fato para o banco, e nas migrações dos projetos com PostgreSQL.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF, TRACKER, MOVIES],
          },
          {
            name: "JavaScript",
            icon: "javascript",
            url: "https://developer.mozilla.org/docs/Web/JavaScript",
            text: both(
              "The browser side: the React interfaces of this portfolio and of My Own BookShelf.",
              "O lado do navegador: as interfaces em React deste portfólio e do My Own BookShelf.",
            ),
            used: [BOOKSHELF],
          },
          {
            name: "TypeScript",
            rune: "ᛏ",
            url: "https://www.typescriptlang.org",
            text: both(
              "Typed front ends: API responses described as types, and dictionaries typed against each other so a missing translation fails the build.",
              "Fronts tipados: as respostas da API descritas como tipos, e dicionários tipados um contra o outro para uma tradução esquecida quebrar o build.",
            ),
            used: [SOUNDPRINT, ROTA],
          },
        ],
      },
      {
        title: both("Back end", "Back-end"),
        tools: [
          {
            name: "FastAPI",
            icon: "fastapi",
            url: "https://fastapi.tiangolo.com",
            text: both(
              "My framework for APIs: typed, validated and documented on its own. Every API of mine runs on it.",
              "Meu framework de APIs: tipado, validado e documentado sozinho. Todas as minhas APIs rodam nele.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF, TRACKER, MOVIES],
          },
          {
            name: "SQLAlchemy 2.0",
            icon: "sqlalchemy",
            url: "https://www.sqlalchemy.org",
            text: both(
              "The ORM of my APIs with a database, including async mode with asyncpg.",
              "O ORM das minhas APIs com banco, inclusive no modo assíncrono com asyncpg.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF, TRACKER, MOVIES],
          },
          {
            name: "Pydantic v2",
            icon: "pydantic",
            url: "https://docs.pydantic.dev",
            text: both(
              "Checks everything that goes in and out of the APIs: if the data does not match the model, the request never reaches the business rules.",
              "Confere tudo o que entra e sai das APIs: se o dado não bate com o modelo, a requisição nem chega na regra de negócio.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF, MOVIES],
          },
          {
            name: "Alembic",
            rune: "ᚨ",
            url: "https://alembic.sqlalchemy.org",
            text: both(
              "Database migrations versioned with the code. The rating column of My Own BookShelf changed type this way, without losing a single rating; in Rota151 a test fails if models and migrations drift.",
              "Migrações do banco versionadas com o código. A coluna de nota do My Own BookShelf mudou de tipo assim, sem perder nenhuma nota; na Rota151 um teste falha se modelos e migrações divergirem.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF],
          },
          {
            name: "JWT",
            icon: "jwt",
            url: "https://jwt.io",
            text: both(
              "Token login: accounts, sessions that expire and a password change that invalidates the old tokens.",
              "Login com token: contas, sessões que expiram e troca de senha que invalida os tokens antigos.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF, TRACKER],
          },
          {
            name: "pytest",
            icon: "pytest",
            url: "https://docs.pytest.org",
            text: both(
              "Automated tests for the APIs, run on every push. Rota151 alone has 126 of them.",
              "Testes automáticos das APIs, rodando a cada push. Só a Rota151 tem 126.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF, TRACKER],
          },
        ],
      },
    ],
  },
  {
    id: "ponte",
    categories: [
      {
        title: both("Front end", "Front-end"),
        tools: [
          {
            name: "React",
            icon: "react",
            url: "https://react.dev",
            text: both(
              "Every interface I have published, with my own components and no UI library.",
              "Todas as interfaces que publiquei, com componentes próprios e sem biblioteca de UI.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF],
          },
          {
            name: "Vite",
            icon: "vite",
            url: "https://vite.dev",
            text: both(
              "Build and dev server of the front ends. In MySoundPrint, Rota151 and My Own BookShelf it also builds the installable app (PWA).",
              "Build e servidor de desenvolvimento dos fronts. No MySoundPrint, na Rota151 e no My Own BookShelf também gera o app instalável (PWA).",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF],
          },
          {
            name: "HTML & CSS",
            icon: "css",
            url: "https://developer.mozilla.org/docs/Web/CSS",
            text: both(
              "Layouts, animations and themes written by hand, like the scenes on this page.",
              "Layouts, animações e temas escritos à mão, como as cenas desta página.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF],
          },
          {
            name: "Vitest + Playwright",
            icon: "vitest",
            url: "https://vitest.dev",
            text: both(
              "Front-end tests: unit tests with Vitest and, in My Own BookShelf, the full flow in a real browser with Playwright, accessibility checks included.",
              "Testes do front: unidade com Vitest e, no My Own BookShelf, o fluxo completo num navegador de verdade com Playwright, com checagem de acessibilidade.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF],
          },
        ],
      },
      {
        title: both("Data", "Dados"),
        tools: [
          {
            name: "PostgreSQL",
            icon: "postgresql",
            url: "https://www.postgresql.org",
            text: both(
              "The database of every API whose data has to last.",
              "O banco de todas as APIs cujos dados precisam durar.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF, TRACKER, MOVIES],
          },
          {
            name: "Redis",
            icon: "redis",
            url: "https://redis.io",
            text: both(
              "Cache in front of the database and of external APIs, like the market quotes of Portfolio Tracker, and the OAuth state of MySoundPrint, consumed once with GETDEL.",
              "Cache na frente do banco e de APIs externas, como as cotações do Portfolio Tracker, e o state do OAuth do MySoundPrint, consumido uma vez com GETDEL.",
            ),
            used: [SOUNDPRINT, ROTA, TRACKER, MOVIES],
          },
          {
            name: "Supabase",
            icon: "supabase",
            url: "https://supabase.com",
            text: both(
              "Managed PostgreSQL in production, and Storage for profile photos.",
              "PostgreSQL gerenciado em produção, e Storage para as fotos de perfil.",
            ),
            used: [SOUNDPRINT, BOOKSHELF, TRACKER],
          },
        ],
      },
      {
        title: both("Infra & tools", "Infra & ferramentas"),
        tools: [
          {
            name: "Docker Compose",
            icon: "docker",
            url: "https://docs.docker.com/compose",
            text: both(
              "Starts the API, the database and the cache together with one command, the same on any machine.",
              "Sobe a API, o banco e o cache juntos com um comando, igual em qualquer máquina.",
            ),
            used: [SOUNDPRINT, ROTA, TRACKER, MOVIES],
          },
          {
            name: "Git",
            icon: "git",
            url: "https://git-scm.com",
            text: both(
              "Version control for everything, with small commits and messages that say what changed.",
              "Versionamento de tudo, com commits pequenos e mensagens que dizem o que mudou.",
            ),
            used: "all",
          },
          {
            name: "GitHub Actions",
            icon: "githubactions",
            url: "https://github.com/features/actions",
            text: both(
              "Continuous integration: lint, tests and build run on their own on every push, and the deploy only happens when they pass. In MySoundPrint it is also the hourly cron.",
              "Integração contínua: lint, testes e build rodam sozinhos a cada push, e o deploy só acontece se passarem. No MySoundPrint ainda é o cron de hora em hora.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF],
          },
          {
            name: "Poetry",
            icon: "poetry",
            url: "https://python-poetry.org",
            text: both(
              "Dependencies and virtual environment of the Python APIs.",
              "Dependências e ambiente virtual das APIs em Python.",
            ),
            used: [SOUNDPRINT, ROTA, BOOKSHELF, MOVIES],
          },
          {
            name: "Render",
            icon: "render",
            url: "https://render.com",
            text: both("Where the APIs run in production.", "Onde as APIs rodam em produção."),
            used: [SOUNDPRINT, ROTA, BOOKSHELF, TRACKER],
          },
          {
            name: "Vercel",
            icon: "vercel",
            url: "https://vercel.com",
            text: both(
              "Deploy of the front ends, with security headers and caching set up.",
              "Deploy dos fronts, com cabeçalhos de segurança e cache configurados.",
            ),
            used: [SOUNDPRINT, BOOKSHELF],
          },
        ],
      },
    ],
  },
];

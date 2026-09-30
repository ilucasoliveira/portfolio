export const projectsData = {
  en: {
    featured: {
      title: "Personal Library",
      tags: ["Python", "FastAPI", "PostgreSQL", "React"],
      year: "2026",
      desc: "Full-stack app for tracking a personal book collection. Deployed REST API with authentication, photo uploads via Supabase Storage, Google Books integration, and a React + Vite frontend with a custom design system.",
      link: "https://github.com/ilucasoliveira/personal-library-api",
      demo: "",
    },
    others: [
      {
        title: "Portfolio Tracker API",
        tags: "FastAPI · Async SQLAlchemy · Redis · JWT",
        desc: "Investment portfolio API with JWT auth and argon2 hashing. Derives positions, average cost and profit from transaction history using live quotes cached in Redis. Tested with pytest and deployed on Render.",
        link: "https://github.com/ilucasoliveira/portfolio-tracker-api",
      },
      {
        title: "Movies API",
        tags: "FastAPI · PostgreSQL · Redis · Docker",
        desc: "Fully async API for watched movies and series. Many-to-many genres, cache-aside with Redis and invalidation on every write, all orchestrated with Docker Compose.",
        link: "https://github.com/ilucasoliveira/movies-api",
      },
      {
        title: "This Portfolio",
        tags: "React · Vite · FastAPI · Resend",
        desc: "The site you are on. React 19 frontend with EN/PT i18n and accessibility work (reduced motion, keyboard focus, WCAG contrast), backed by my own FastAPI contact API with Pydantic validation, rate limiting and a spam honeypot. Deployed on Vercel and Render with a custom domain.",
        link: "https://github.com/ilucasoliveira/portfolio",
      },
    ],
  },
  pt: {
    featured: {
      title: "Personal Library",
      tags: ["Python", "FastAPI", "PostgreSQL", "React"],
      year: "2026",
      desc: "Aplicação full-stack para gerenciar uma biblioteca pessoal. API REST em produção com autenticação, upload de fotos via Supabase Storage, integração com Google Books e frontend React + Vite com design system próprio.",
      link: "https://github.com/ilucasoliveira/personal-library-api",
      demo: "",
    },
    others: [
      {
        title: "Portfolio Tracker API",
        tags: "FastAPI · SQLAlchemy async · Redis · JWT",
        desc: "API de carteira de investimentos com autenticação JWT e hash argon2. Calcula posição, preço médio e lucro a partir do histórico de transações, com cotações em tempo real cacheadas no Redis. Testada com pytest e publicada no Render.",
        link: "https://github.com/ilucasoliveira/portfolio-tracker-api",
      },
      {
        title: "Movies API",
        tags: "FastAPI · PostgreSQL · Redis · Docker",
        desc: "API totalmente assíncrona para filmes e séries assistidos. Gêneros em relação muitos-para-muitos, cache-aside com Redis e invalidação a cada escrita, tudo orquestrado com Docker Compose.",
        link: "https://github.com/ilucasoliveira/movies-api",
      },
      {
        title: "Este Portfólio",
        tags: "React · Vite · FastAPI · Resend",
        desc: "O site em que você está. Frontend em React 19 com i18n EN/PT e cuidado com acessibilidade (movimento reduzido, foco por teclado, contraste WCAG), integrado à minha própria API de contato em FastAPI com validação Pydantic, rate limiting e honeypot contra spam. Publicado na Vercel e no Render com domínio próprio.",
        link: "https://github.com/ilucasoliveira/portfolio",
      },
    ],
  },
};

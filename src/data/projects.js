export const projectsData = {
  en: {
    featured: {
      title: "Personal Library",
      tags: ["Python", "FastAPI", "PostgreSQL", "React"],
      year: "2026",
      desc: "Full-stack app for tracking a personal book collection. Deployed REST API with authentication, photo uploads via Supabase Storage, Google Books integration, and a React + Vite frontend with a custom design system.",
      link: "https://github.com/ilucasoliveira/personal-library-api",
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
        title: "Daily Python Exercises",
        tags: "Python · pytest · SQLAlchemy · Docker",
        desc: "50+ days of daily practice with a commit each day. From Python fundamentals to testing, databases, Docker and JWT authentication, with weekly integrated review projects.",
        link: "https://github.com/ilucasoliveira/daily-python-exercises",
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
        title: "Daily Python Exercises",
        tags: "Python · pytest · SQLAlchemy · Docker",
        desc: "Mais de 50 dias de prática diária com commit todo dia. Dos fundamentos de Python a testes, banco de dados, Docker e autenticação JWT, com projetos de revisão integrados a cada semana.",
        link: "https://github.com/ilucasoliveira/daily-python-exercises",
      },
    ],
  },
};

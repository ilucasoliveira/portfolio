# ᚦ Lucas de Oliveira — Portfolio

> _"I build software with the precision of one who carves runes into stone — clean code, robust systems, and a journey told in every line."_

My personal portfolio, designed as a dark medieval grimoire: obsidian and antique gold, runic details, and each section framed as a chapter of the journey. Fully bilingual (EN/PT), with a working contact form powered by my own FastAPI backend.

**Live:** https://lucasdeoliveira.vercel.app
**Backend repository:** [ilucasoliveira/portfolio-lucas-api](https://github.com/ilucasoliveira/portfolio-lucas-api)

## ✦ Features

- **Grimoire design system** — custom dark theme with CSS variables, four typefaces (Cinzel Decorative, Cinzel, Cormorant Garamond, JetBrains Mono), and handcrafted details: rotating runic rings (SVG), animated signature, star-field background, and gold shimmer micro-interactions
- **Bilingual (EN/PT)** — instant language switching via React Context, English by default
- **Chapters as sections** — The Architect (about), The Works (projects), The Arsenal (tech stack), Open a Channel (contact)
- **Working contact form** — controlled inputs, loading/success/error states, and real email delivery through a [FastAPI backend](https://github.com/ilucasoliveira/portfolio-lucas-api) running in production
- **Scroll-aware UI** — glassmorphism navbar on scroll, section reveals via IntersectionObserver, fading scroll indicator
- **Responsive** — adaptive featured-project screenshot via `<picture>`, mobile nav monogram, and reduced-motion support

## ✦ Tech Stack

| Layer      | Tools                                                                        |
| ---------- | ---------------------------------------------------------------------------- |
| UI         | React 19, Vite                                                               |
| Styling    | Plain CSS with design tokens (no frameworks)                                 |
| i18n       | React Context + translation dictionaries                                     |
| Animations | CSS keyframes, IntersectionObserver (custom `useReveal` hook)                |
| Backend    | [FastAPI contact API](https://github.com/ilucasoliveira/portfolio-lucas-api) |
| Deploy     | Vercel (frontend) · Render (API)                                             |
| Linting    | Oxlint                                                                       |

## ✦ Getting Started

```bash
# clone and install
git clone https://github.com/ilucasoliveira/portfolio.git
cd portfolio
npm install

# configure the API endpoint
cp .env.example .env
# edit .env → VITE_API_URL=http://127.0.0.1:8000/message

# run
npm run dev
```

The contact form expects the [backend API](https://github.com/ilucasoliveira/portfolio-lucas-api) running locally on port 8000. Without it, every other section works normally.

### Environment variables

| Variable       | Description          | Example                         |
| -------------- | -------------------- | ------------------------------- |
| `VITE_API_URL` | Contact API endpoint | `http://127.0.0.1:8000/message` |

## ✦ Project Structure

```
src/
├── components/     # One component per section (JSX + CSS pairs)
│   ├── Nav, Hero, About, Projects, Stack, Contact, Footer
│   ├── Background  # star field + noise + glow layers
│   └── Signature   # animated SVG signature
├── context/
│   └── LanguageContext.jsx   # EN/PT switching
├── data/
│   ├── translations.js       # all copy, both languages
│   ├── projects.js           # featured + secondary projects
│   └── stack.js              # tech stack with levels
├── hooks/
│   └── useReveal.js          # IntersectionObserver scroll reveals
└── styles/
    └── global.css            # design tokens + keyframes
```

## ✦ Author

**Lucas de Oliveira** — Full Stack Python Developer

- Portfolio: [lucasdeoliveira.vercel.app](https://lucasdeoliveira.vercel.app)
- GitHub: [@ilucasoliveira](https://github.com/ilucasoliveira)
- LinkedIn: [in/ilucasoliveira](https://www.linkedin.com/in/ilucasoliveira/)
- Email: lucasdeoliveira937@gmail.com

---

ᛚ · _forged in Minas · MMXXVI_

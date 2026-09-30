# ᚦ Lucas de Oliveira · Portfolio

> _"I build software with the precision of one who carves runes into stone — clean code, robust systems, and a journey told in every line."_

My personal portfolio, designed as a dark medieval grimoire: obsidian and antique gold, runic details, and each section framed as a chapter of the journey. Bilingual (EN/PT), accessible, and connected to my own FastAPI backend, which the site shows working live.

**Live:** https://ilucasoliveira.dev
**Backend repository:** [ilucasoliveira/portfolio-lucas-api](https://github.com/ilucasoliveira/portfolio-lucas-api)

## ✦ Features

- **Grimoire design system**: custom dark theme built on CSS variables, five typefaces (Cinzel Decorative, Cinzel, Cormorant Garamond, JetBrains Mono, Great Vibes) and handcrafted details such as rotating runic rings (SVG), an animated signature and a star-field background
- **Chapters as sections**: The Architect (about), The Works (projects), The Journey (experience), The Arsenal (tech stack) and Open a Channel (contact)
- **Rune decoding titles**: each chapter title decodes from random runes into its final word when the section scrolls into view
- **Tilting project cards**: cards tilt toward the cursor with a golden glare, enabled only on devices with a precise pointer
- **Live API status**: the contact section pings the backend and shows whether it is online, its latency, and a link to the interactive API docs. Render cold starts are detected and explained to the visitor
- **Request console**: after sending a message, a panel shows the actual `POST` request, the HTTP status, the response body and the round trip time
- **Contact form**: client-side validation with per-field errors, a spam honeypot, request timeout, and specific messages for rate limiting and slow servers
- **Bilingual (EN/PT)**: language chosen from the `?lang=` URL parameter, then the visitor's saved choice, then the browser language. Shareable links like `ilucasoliveira.dev/?lang=pt`
- **Accessibility**: WCAG AA text contrast, 12px minimum font size, visible keyboard focus, full `prefers-reduced-motion` support, decorative runes hidden from screen readers, and animated text exposed to them in its final form
- **Performance**: only the font weights in use are loaded, display fonts are subset to the glyphs they render, images are served as WebP with explicit dimensions and lazy loading

## ✦ Tech Stack

| Layer      | Tools                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------- |
| UI         | React 19, Vite                                                                                 |
| Styling    | Plain CSS with design tokens (no frameworks)                                                   |
| i18n       | React Context + translation dictionaries                                                       |
| Animations | CSS keyframes, IntersectionObserver and custom hooks (`useReveal`, `useRuneDecode`, `useTilt`) |
| Backend    | [FastAPI contact API](https://github.com/ilucasoliveira/portfolio-lucas-api)                   |
| Deploy     | Vercel (frontend), Render (API)                                                                |
| Linting    | Oxlint                                                                                         |

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

The contact form and the API status expect the [backend API](https://github.com/ilucasoliveira/portfolio-lucas-api) running locally on port 8000. Without it, the status shows "offline" and every other section works normally.

### Environment variables

| Variable       | Description                                                           | Example                         |
| -------------- | --------------------------------------------------------------------- | ------------------------------- |
| `VITE_API_URL` | Contact API endpoint. `/ping` and `/docs` are derived from its origin | `http://127.0.0.1:8000/message` |

## ✦ Project Structure

```
src/
├── components/          # One component per section (JSX + CSS pairs)
│   ├── Nav, Hero, About, Projects, Experience, Stack, Contact, Footer
│   ├── Background       # star field, noise and glow layers
│   ├── Signature        # animated SVG signature
│   ├── RuneText         # rune decoding text, screen reader safe
│   ├── ApiStatus        # live backend status and latency
│   └── RequestConsole   # last request and response of the contact form
├── context/
│   └── LanguageContext.jsx   # EN/PT switching, URL and storage detection
├── data/
│   ├── translations.js       # all copy, both languages
│   ├── projects.js           # featured and secondary projects
│   ├── stack.js              # tech stack by category
│   └── cv.js                 # résumé PDF path per language
├── hooks/
│   ├── useReveal.js          # IntersectionObserver scroll reveals
│   ├── useRuneDecode.js      # rune to text decoding animation
│   └── useTilt.js            # pointer driven 3D tilt
├── services/
│   └── api.js                # API URLs derived from VITE_API_URL
├── utils/
│   └── motion.js             # reduced motion and pointer capability checks
└── styles/
    └── global.css            # design tokens, keyframes and accessibility rules
```

## ✦ Author

**Lucas de Oliveira**, Full Stack Python Developer

- Portfolio: [ilucasoliveira.dev](https://ilucasoliveira.dev)
- GitHub: [@ilucasoliveira](https://github.com/ilucasoliveira)
- LinkedIn: [in/ilucasoliveira](https://www.linkedin.com/in/ilucasoliveira/)
- Email: lucasoliveirapimentel.dev@gmail.com

---

ᛚ · _forged in Minas · MMXXVI_

# ᚦ Lucas de Oliveira — Portfolio

> _"I build software with the precision of one who carves runes into stone — clean code, robust systems, and a journey told in every line."_

My personal portfolio, designed as a dark medieval grimoire: obsidian and antique gold, runic details, and each section framed as a chapter of the journey. Fully bilingual (EN/PT), with a working contact form powered by my own FastAPI backend.

**Live:** [add your Vercel URL here]
**Backend repository:** [add your API repo URL here]

## ✦ Features

- **Grimoire design system** — custom dark theme with CSS variables, four typefaces (Cinzel Decorative, Cinzel, Cormorant Garamond, JetBrains Mono), and handcrafted details: rotating runic rings (SVG), animated signature, star-field background, and gold shimmer micro-interactions
- **Bilingual (EN/PT)** — instant language switching via React Context, English by default
- **Chapters as sections** — The Architect (about), The Works (projects with live GitHub data), The Arsenal (tech stack), Open a Channel (contact)
- **Working contact form** — controlled inputs, loading/success/error states, and real email delivery through a FastAPI + SMTP backend
- **Scroll-aware UI** — glassmorphism navbar on scroll, section reveals via IntersectionObserver, fading scroll indicator
- **Responsive** — from desktop to mobile, with reduced-motion support

## ✦ Tech Stack

| Layer      | Tools                                                         |
| ---------- | ------------------------------------------------------------- |
| UI         | React 19, Vite                                                |
| Styling    | Plain CSS with design tokens (no frameworks)                  |
| i18n       | React Context + translation dictionaries                      |
| Animations | CSS keyframes, IntersectionObserver (custom `useReveal` hook) |
| Backend    | [FastAPI contact API](add-your-api-repo-url)                  |
| Linting    | Oxlint                                                        |

## ✦ Getting Started

```bash
# clone and install
git clone https://github.com/ilucasoliveira/[your-repo-name].git
cd [your-repo-name]
npm install

# configure the API endpoint
cp .env.example .env
# edit .env → VITE_API_URL=http://127.0.0.1:8000/message

# run
npm run dev
```

The contact form expects the [backend API](add-your-api-repo-url) running locally on port 8000. Without it, every other section works normally.

### Environment variables

| Variable       | Description          | Example                         |
| -------------- | -------------------- | ------------------------------- |
| `VITE_API_URL` | Contact API endpoint | `http://127.0.0.1:8000/message` |

## ✦ Project Structure

```
src/
├── components/     # One folder-free component per section (JSX + CSS pairs)
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

- GitHub: [@ilucasoliveira](https://github.com/ilucasoliveira)
- LinkedIn: [in/ilucasoliveira](https://www.linkedin.com/in/ilucasoliveira/)
- Email: lucasdeoliveira937@gmail.com

---

ᛚ · _forged in Minas · MMXXVI_

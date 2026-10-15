# ᚦ Lucas de Oliveira · Portfolio

> _"I build software with the precision of one who carves runes into stone: clean code, robust systems, and a journey told in every line."_

My personal portfolio, told as a journey through Middle-earth. A starry night sky, a hero portal that opens over a valley, a moonlit stone gate that opens onto a descent through the mines where the tech stack lives, a fire forge for each project, a map of my career and a wraith waiting in the epilogue. Bilingual (EN/PT), accessible, and connected to my own FastAPI backend, which the site shows working live.

**Live:** https://ilucasoliveira.dev
**Backend repository:** [ilucasoliveira/portfolio-lucas-api](https://github.com/ilucasoliveira/portfolio-lucas-api)

## ✦ The journey

The home page reads like a book, one chapter per section:

| Chapter            | Section    | What happens                                                                                          |
| ------------------ | ---------- | ----------------------------------------------------------------------------------------------------- |
| Opening            | Intro      | A veil splits open while a ring of Elvish script draws itself (once per session)                     |
| Prologue           | Hero       | Rune rings glow and scale past the viewer over a night valley, runes fly toward the camera in 3D      |
| I · The Architect  | About      | Portrait, story and an animated signature                                                             |
| II · The Works     | Projects   | Featured project and cards, each one opening its own project page                                     |
| III · The Journey  | Experience | An illustrated map whose trail travels on its own through each stop of my career, then the timeline  |
| V · Open a Channel | Contact    | Contact form and live API status                                                                      |
| Epilogue           | Epilogue   | A wraith rises from the dark holding a glowing ring; the footer closes the scene                     |

Three more pages complete the site:

- **Workshop** (`/oficina`, chapter IV): a moonlit stone gate draws itself and opens on its own (with a Skip button) onto a hall of the dwarves. Below it, on the dark of the mines, the tool cards (where I use each tool, the projects that use it and its official site), a bridge over the abyss between the two halves, and a fire glow that rises as you go down. The page ends with the forge scene filling the screen together with the footer and a single short line
- **Project pages** (`/projetos/:slug`): tabs between projects, a forge scene where the tech stack orbits a wizard facing a creature of fire, an architecture diagram, features with wax seals, technical decisions, an endpoint table and next steps
- **Inspirations** (`/inspiracoes`): the site's appendix, laid out like the page of an old book in daylight, crediting J.R.R. Tolkien, The Hobbit and The Lord of the Rings, and explaining where each part of the site comes from

## ✦ Features

- **Scroll-driven scenes**: a small `useScrollProgress` hook writes a `--p` (0 to 1) variable on pinned sections, and CSS turns it into the forge zoom and the epilogue reveal. The hero portal uses native CSS scroll timelines where supported. On the Workshop page a clock writes the same `--p` to play the gate opening, and the scroll writes `--depth` to raise the fire glow (opacity only, so the GPU does the work)
- **Page transitions**: a minimal router (`useRoute`) with a portal of runes that closes from the clicked point and opens on the new page; long in-page jumps fade out, jump and fade back in instead of scrolling through every animation
- **Elvish-style script**: procedurally generated glyphs (invented, not real tengwar) drawn stroke by stroke, in line or ring form
- **Rune decoding titles**: chapter titles decode from random runes into their final word, letter by letter, without changing layout
- **Pear.no-style grid**: fine hairlines framing the content, stars at the crossings and a progress star that travels down to the footer
- **Responsive navigation**: full menu on desktop, a full-screen chapter menu (hamburger) on tablets and phones
- **Live API status**: the contact section pings the backend and shows whether it is online, its latency and a link to the interactive docs, with Render cold starts explained to the visitor
- **Contact form**: client-side validation with per-field errors, a spam honeypot, request timeout and specific messages for rate limiting and slow servers
- **Bilingual (EN/PT)**: language chosen from the `?lang=` URL parameter, then the visitor's saved choice, then the browser language
- **Accessibility**: WCAG AA text contrast, visible keyboard focus, focus moved to the title on page changes, full `prefers-reduced-motion` support (every scene has a static version), decorative runes hidden from screen readers and animated text exposed in its final form
- **Performance**: glows built from layered strokes instead of live blur filters, layers removed from rendering when their scene is off screen, the star field throttled when idle, images served as WebP with `srcset` (the Inspirations hero ships 1920px and 3840px versions)

## ✦ Tech Stack

| Layer      | Tools                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------- |
| UI         | React 19, Vite                                                                            |
| Styling    | Plain CSS with design tokens (no frameworks)                                              |
| Routing    | Custom History API router (`useRoute`), no dependency                                     |
| i18n       | React Context + translation dictionaries                                                  |
| Animations | CSS keyframes and scroll timelines, IntersectionObserver, canvas and small custom hooks   |
| Backend    | [FastAPI contact API](https://github.com/ilucasoliveira/portfolio-lucas-api)              |
| Deploy     | Vercel (frontend), Render (API)                                                           |
| Linting    | Oxlint                                                                                    |

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

On Vercel, set `VITE_API_URL` to the production API before building.

### Deploy notes

`vercel.json` rewrites `/projetos/:slug` and `/inspiracoes` to `index.html`, so those pages also work when opened directly or reloaded.

## ✦ Project Structure

```
src/
├── pages/
│   ├── Home.jsx               # the chapters, in order
│   ├── ProjectPage.jsx        # one page per project
│   ├── WorkshopPage.jsx       # the gate and the descent through the mines (tech stack)
│   └── InspirationsPage.jsx   # appendix: credits to Tolkien and the books
├── components/
│   ├── Nav, Footer            # top bar, hamburger menu and footer
│   ├── Hero, About, Projects, Experience, Contact, Epilogue
│   ├── Gate                   # the stone gate that opens the Workshop
│   ├── JourneyMap             # map with the self-drawing career trail
│   ├── ForgeScene             # project stack around the forge scene (or the scene alone, as the Workshop finale)
│   ├── ArchDiagram            # architecture diagram on project pages
│   ├── Background             # canvas star field, moon, fog and lantern
│   ├── Veils                  # intro, page transition, anchor jump and hairline grid
│   ├── ElvishScript           # generated Elvish-style glyphs
│   ├── RuneText, Words        # rune decoding titles and word-by-word reveals
│   ├── Link                   # in-app links with the page transition
│   └── ApiStatus, Signature, Corners
├── context/
│   └── LanguageContext.jsx    # EN/PT switching, URL and storage detection
├── data/
│   ├── translations.js        # all interface copy, both languages
│   ├── projects.js            # projects and their page content
│   ├── inspirations.js        # Inspirations page copy
│   ├── workshop.js            # Workshop tools: text, projects and links, by scene
│   ├── icons.js               # tool logos (Simple Icons, CC0)
│   └── cv.js                  # résumé PDF path per language
├── hooks/                     # useRoute, useScrollProgress, useInView, useRuneDecode, ...
├── services/
│   └── api.js                 # API URLs derived from VITE_API_URL
├── utils/                     # motion checks, runes
└── styles/
    └── global.css             # design tokens, shared utilities and accessibility rules
```

## ✦ Credits

This portfolio is a non-commercial fan tribute with no official connection to the Tolkien Estate, the publishers of the books or the studios behind the adaptations. The Hobbit, The Lord of the Rings and every name, place and character of Middle-earth were created by J.R.R. Tolkien and belong to their rights holders. Book covers and photographs shown on the Inspirations page belong to their respective authors and publishers, and illustrations used across the site belong to their artists.

## ✦ Author

**Lucas de Oliveira**, Full Stack Python Developer

- Portfolio: [ilucasoliveira.dev](https://ilucasoliveira.dev)
- GitHub: [@ilucasoliveira](https://github.com/ilucasoliveira)
- LinkedIn: [in/ilucasoliveira](https://www.linkedin.com/in/ilucasoliveira/)
- Email: lucasoliveirapimentel.dev@gmail.com

---

ᛚ · _forged in Minas · MMXXVI_

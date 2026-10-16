# ᚦ Lucas de Oliveira · Portfolio

> _"I build software with the precision of one who carves runes into stone: clean code, robust systems, and a journey told in every line."_

My personal portfolio, told as a journey through Middle-earth. A starry night sky, a hero portal that opens over a valley, a moonlit stone gate that opens onto a descent through the mines where the tech stack lives, a white stone city at night for the works, a map of my career and a wraith waiting in the epilogue. Bilingual (EN/PT), accessible, and connected to my own FastAPI backend, which the site shows working live.

**Live:** https://ilucasoliveira.dev
**Backend repository:** [ilucasoliveira/portfolio-lucas-api](https://github.com/ilucasoliveira/portfolio-lucas-api)

## ✦ The journey

The home page reads like a book, one chapter per section:

| Chapter            | Section    | What happens                                                                                          |
| ------------------ | ---------- | ----------------------------------------------------------------------------------------------------- |
| Opening            | Intro      | A veil splits open while a ring of Elvish script draws itself (once per session)                     |
| Prologue           | Hero       | Rune rings glow and scale past the viewer over a night valley, runes fly toward the camera in 3D      |
| I · The Architect  | About      | Portrait, story and an animated signature                                                             |
| II · The Works     | Projects   | The four works as a row of stone arches, each opening its own page, and the way to all the works      |
| III · The Journey  | Experience | An illustrated map whose trail travels on its own through each stop of my career, then the timeline  |
| V · Open a Channel | Contact    | Contact form and live API status                                                                      |
| Epilogue           | Epilogue   | A wraith rises from the dark holding a glowing ring; the footer closes the scene                     |

Three more pages complete the site:

- **Workshop** (`/oficina`, chapter IV): a moonlit stone gate draws itself and opens on its own (with a Skip button) onto a hall of the dwarves. Below it, on the dark of the mines, the tool cards (where I use each tool, the projects that use it and its official site), a bridge over the abyss between the two halves, and a fire glow that rises as you go down. The page ends with the forge scene filling the screen together with the footer and a single short line
- **Works** (`/projetos`, chapter II): a white stone city at night fills the first screen and wakes up, its windows lighting one by one from the tower outward. Below it, each project is a stone arch: the main one shows the app standing inside the gate, the others look out over different parts of the city. It ends with the way to the Workshop and to contact
- **Project pages** (`/projetos/:slug`): the city behind the header, tabs between projects, the tech stack carved into a stone wall whose runes light up one by one, an architecture diagram, features with wax seals, technical decisions, an endpoint table and next steps
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
- **Day and night themes**: the first visit follows the device's light or dark mode, and a sun/moon button in the menu switches and remembers the choice (set before the first paint, so there is no flash). Night is the starry sky; day is parchment, with every scene swapping to the same view in daylight (Valinor, the white city, the dwarf hall, the bridge) through a dawn crossfade, and the Inspirations page turning into the Shire by moonlight with blinking fireflies. Only the active theme's images are downloaded. Some places stay in the night on purpose (`.night-zone`): the Moria gate, which only shows by moonlight, the depths of the Workshop past the bridge, the Balrog and the wraith of the epilogue
- **Bilingual (EN/PT)**: language chosen from the `?lang=` URL parameter, then the visitor's saved choice, then the browser language
- **Accessibility**: WCAG AA text contrast in both themes, visible keyboard focus, focus moved to the title on page changes, `prefers-reduced-motion` support (big movement, parallax, zoom and spinning are removed while light, glows, drawing lines and fades remain), decorative runes hidden from screen readers and animated text exposed in its final form
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

`npm run build` runs `vite build` and then `scripts/prerender.mjs`, which:

- writes one HTML per page (`projetos.html`, `oficina.html`, `inspiracoes.html`, `projetos/<slug>.html`) with its own title, description and link preview image (`public/og/*.jpg`, 1200×630). WhatsApp, LinkedIn and the like don't run JavaScript, so without this every link would show the Home preview;
- adds a Content Security Policy to every HTML, with the hashes of the inline scripts computed at build time and the API origin taken from `VITE_API_URL`.

`vercel.json` turns on `cleanUrls` (so `/projetos` serves `projetos.html`), keeps the SPA rewrites as a fallback (an unknown `/projetos/:slug` still opens the app's "work not found" page) and sets long cache and security headers. Any other unknown path gets `404.html`, which Vite builds as a second entry with the site's own fonts.

## ✦ Project Structure

```
src/
├── pages/
│   ├── Home.jsx               # the chapters, in order
│   ├── ProjectsPage.jsx       # the works: the city at night and one arch per project
│   ├── ProjectPage.jsx        # one page per project
│   ├── WorkshopPage.jsx       # the gate and the descent through the mines (tech stack)
│   └── InspirationsPage.jsx   # appendix: credits to Tolkien and the books
├── components/
│   ├── Nav, Footer            # top bar, hamburger menu and footer
│   ├── Hero, About, Projects, Experience, Contact, Epilogue
│   ├── Gate                   # the stone gate that opens the Workshop
│   ├── JourneyMap             # map with the self-drawing career trail
│   ├── ForgeScene             # the forge scene (the Workshop finale)
│   ├── StoneStack             # a project's stack carved into a stone wall
│   ├── ThemedImg              # an image with a day and a night version (crossfade on theme switch)
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
│   ├── hall.js                # Works page copy and the lit windows of the city
│   ├── inspirations.js        # Inspirations page copy
│   ├── workshop.js            # Workshop tools: text, projects and links, by scene
│   ├── seo.js                 # title, description and preview image of each page (app and prerender)
│   ├── icons.js               # tool logos (Simple Icons, CC0)
│   └── cv.js                  # résumé PDF path per language
├── hooks/                     # useRoute, useTheme, useScrollProgress, useInView, useRuneDecode, ...
├── services/
│   └── api.js                 # API URLs derived from VITE_API_URL
├── utils/                     # motion checks, runes
└── styles/
    ├── global.css             # design tokens (night and day), shared utilities and accessibility rules
    ├── day.css                # the day (parchment) adjustments of each component
    ├── fonts.css              # self-hosted fonts (subset woff2 in src/assets/fonts)
    └── not-found.css          # the 404 page
scripts/
├── prerender.mjs              # per-page HTML for link previews + CSP (runs after vite build)
└── asset-stub.mjs             # lets Node import src/data without the image files
404.html                       # the wraith page for unknown paths (always night)
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

# NOVA Hősakadémia

Hungarian reading/listening comprehension practice app for a 10-year-old, set in a superhero academy world.
React 18 + Vite, installable as a PWA (phone, tablet, desktop).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve dist/ (service worker active)
```

## Structure

| Path | What |
| --- | --- |
| `src/App.jsx` | All state and behaviour (practice runner, adaptive levels, mission, parent area, persistence). `renderVals()` builds a flat view-model `v`. |
| `src/AppView.jsx` | Layout shell: rail/bottom nav, active screen, bottom sheet. |
| `src/screens/*.jsx` | One component per screen; pure rendering of `v`. |
| `src/content.js` | Authored content: mission, tools, map hotspots, 17 practice passages (`ACTS`), labels. |
| `src/model.js` | State factories, localStorage load, formatting. |
| `src/narrator.js` | Speech: recorded audio by id (`Narrator.recorded[id]`) or Hungarian browser voice. |
| `src/touchDrag.js` | Finger dragging for the sequencing cards (hold, then drag); mouse uses HTML5 drag-and-drop. |
| `src/styles/` | Global CSS/keyframes and hover/press classes. |
| `public/assets/` | Artwork (WebP, generated). Originals: `design/source-art/app/`. `public/icons/` – PWA icons. |
| `design/` | Original Claude Design export (`NOVA.dc.html`, earlier snapshots, `HANDOFF.md`, source art). |

Design system, screens, practice logic and known limits are documented in [design/HANDOFF.md](design/HANDOFF.md).
Saved progress lives in localStorage under `nova.hosakademia.v1` (same key as the design prototype).

## How this was ported

`scripts/convert-dc.mjs` converted the `.dc.html` template to JSX and split its script into modules; the logic is
unchanged. The port was checked against the original prototype by driving both with identical click sequences and
comparing layout, colours and text of every element (desktop and phone widths, all screens, mission stages,
sheets and parent tabs).

Re-running the converter overwrites the generated files in `src/` — only do that to diff against a newer design export.
It also emits `assets/*.png` paths; switch them back to `.webp`.

## PWA notes

- Everything is precached: app shell, icons and all artwork, ~2.6 MB in total, so the whole app works offline
  after the first visit.
- Artwork is WebP (q90; transparent images keep a lossless alpha channel), ~2.2 MB down from ~15 MB of PNG. The
  original PNGs live in `design/source-art/app/`; after changing one, regenerate with `node scripts/optimize-art.mjs`
  (needs the `sharp` dev dependency) and reference it in code as `assets/<name>.webp`.
- `maximumFileSizeToCacheInBytes` is 3 MB; a single image above that would be silently left out of the precache.
- Earlier builds kept artwork in a runtime `nova-art` cache; `src/main.jsx` deletes it.
- Fonts come from Google Fonts and are cached at runtime.
- `base: './'` makes the build work from any sub-path (e.g. GitHub Pages).

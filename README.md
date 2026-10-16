# NOVA

Hungarian reading and listening comprehension adventures, first for a 10-year-old (Lacika) who likes superheroes.
React 18 + Vite, installable as a PWA (phone, tablet, desktop). Educational practice only: no diagnosis, no claims
about attention or the brain, no speed scoring.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve dist/ (service worker active)
npm run deploy    # build and publish to https://nova-hosakademia.pages.dev (Cloudflare Pages)
```

Add `?noaudio` to the address to simulate a device without a Hungarian voice.

## Architecture

**World → series → adventure → steps.** The academy is the home, adventures are the content, and the learning
system is shared by every topic.

| Path | What |
| --- | --- |
| `src/content/` | All educational content, as data. `worlds.js` (4 worlds), `energymag.js` (the first adventure), `practice.js` (the prototype's practice texts converted to adventures), `tools.js`, `authored.js` (original authored text), `index.js` (registry and parent-made adventures). |
| `src/activities/` | One component per activity type: `passage`, `choice`, `sequence`, `evidence`, `vocabulary`, `retell`, `delayedRecall`, `reflection`. `shared.jsx` holds the common scoring rules (`useScored`). |
| `src/screens/` | Today (Mai kaland), Explore (Felfedezés) + world view, MyWorld (Saját világom) + tool demos, Rest (Pihenő), Adventure (intro, mode choice, step player, help), Complete, Parent. |
| `src/app/store.jsx` | All state, persisted to localStorage (`nova.hosakademia.v2`), with migration from the prototype's v1 save. |
| `src/app/audio.js`, `narrator.js` | Audio provider: recorded files (`Narrator.recorded[id]`) → Hungarian browser voice → none. |
| `src/app/observations.js` | Parent observations derived from recorded events. |
| `src/app/touchDrag.js` | Finger dragging for sequence cards (hold, then drag). |
| `public/assets/` | Artwork (WebP). Originals in `design/source-art/app/`. |
| `design/` | The original Claude Design prototype and its handoff note (historical). |

### Adding an adventure

An adventure is an object (see `src/content/energymag.js`): `id`, `version`, `worldId`, `seriesId`, `title`,
`description`, `format`, `modes`, `objectives`, `passages` (sections of sentences with stable ids) and `steps`.
Each scored step needs a prompt, the correct answer, authored `hints`, and a source passage; a step may also carry a
`guided` quote for the guided explanation and `wrong` (feedback per attempt). Register it in `src/content/index.js`
(`BUILTIN`). Nothing in the activity components knows about a particular story. Factual adventures should add
sources and an adult-review status to the content; fiction is marked `fiction: true`.

### Content model fields

Every adventure carries `classification` (`fiction` | `factual`), `sources` (a list of references) and
`review` (`{ status: 'unreviewed' | 'adult-reviewed', note }`). `validateAdventure` in `src/content/index.js`
holds back a factual adventure that has no sources or no adult review. Sections may declare authored `chunks`
(shorter presentations, offered as "Rövidebb részt kérek"); sentences have stable ids. Decorative badges live in
`src/content/badges.js` and never unlock tools.

### Learning rules in code

- Every scored activity records its first answer, hints, rereads, replays and transcript use separately, and
  completion as **independent**, **supported** or **guided** (`useScored` in `src/activities/shared.jsx`).
- Wrong answers show the authored hint; from the second miss a guided explanation and "Megmutatom a megoldást" appear.
  The child is never required to guess until correct.
- Completion is idempotent: finishing an adventure removes its active run and records one completion.
- Replaying a finished adventure is labelled as practice and does not award the badge again.

### Listening status

Playback ends as `completed` (the audio or speech engine said so), `interrupted` (paused, replaced or left) or
`error`. A device that reports nothing within a length-based time is `unknown` – never "completed". In listening-only
mode the child then confirms „Befejeztem a hallgatást", recorded as self-reported. Narration is stopped whenever the
passage is left, so clips never overlap. Parent observations show these statuses separately.

### Retelling

Completion methods are `self-reported`, `typed` or `adult-observed`. The adult checklist (per-item
Önállóan / Segítséggel / Most nem említette / Nem figyeltem meg) opens behind the parent PIN when one is set; no score is
ever shown to the child.

### Updates

The service worker uses `registerType: 'prompt'`. A new version downloads in the background and the banner
„Új verzió érhető el" → „Frissítés" appears; it is never shown during an adventure and nothing reloads until
someone taps it. Progress lives in localStorage and survives the reload. Limits: the check runs when the app
opens, when it returns to the foreground and hourly, so a device that stays offline or closed keeps the old
version until it next opens online (iOS may only check at launch).

## PWA notes

- Everything is precached (app shell, icons, all artwork, ~2.6 MB), so the whole app works offline after the first visit.
- Fonts come from Google Fonts and are cached at runtime.
- `base: './'` keeps the build working from any sub-path.
- Artwork is WebP generated from the PNGs in `design/source-art/app/` with `node scripts/optimize-art.mjs`
  (needs the `sharp` dev dependency).

## Publishing

Live at **https://nova-hosakademia.pages.dev** (Cloudflare Pages project `nova-hosakademia`, direct upload).
After changing the app: commit, `git push`, then `npm run deploy` (uses `wrangler`; run `npx wrangler login` once per
machine). Installed copies update the next time they are opened online.

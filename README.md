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

Pausing keeps the position only where the audio provider supports it: a recorded file resumes exactly where it
stopped („Folytatom"). Browser speech cannot be relied on to resume, so a pause stops it and the next play starts again
from the beginning („Újra az elejéről"); the event log records `audio_paused` with `positionKept` and the replay as
`restartedFromStart`.

### Recorded narration

`src/content/audio.js` maps clip ids to the MP3 files in `public/audio/`; they are preferred over the device voice and make
listening available even on devices with no Hungarian voice. Clip ids: `<adventureId>:<passageId>:<sectionId>` for a whole
section (e.g. `dino-muddy-footprints-01:story:p1` = `dino-p1.mp3`) and `…:c0`, `…:c1` for the authored shorter parts
(`dino-p1-c0.mp3`, …). Pause and resume keep the exact position for recordings. Replacing a recording: copy the new file
over the old one and raise `V` in `src/content/audio.js`.

**How playback is done, and what is unverified.** Each recording is fetched whole and played from memory (a blob URL),
because the static host answers range requests with the full file. That is an implementation choice, **not proof that
playback works in every browser: iPhone/Safari and Android/Chrome playback is unverified until tested on real devices.**
Only desktop-browser tests have been run.

**Failures.** If a recording cannot be downloaded, opened or started, the child sees „A felvételt most nem sikerült
lejátszani." with the reason in Hungarian (no connection / not downloadable / cannot be opened / not allowed to start) and
the buttons „Újrapróbálom" and „Olvasással folytatom". The step and all progress stay exactly as they were, the failure is
logged as `audio_status` `error` with its reason, it is never counted as completed, and there is no „Befejeztem" shortcut
after a failure.

**Offline readiness.** `src/app/offline.js` checks the device's caches; the app says „Offline is elérhető" for an adventure
**only when** the app shell, its cover picture and every one of its recordings are really cached (`caches.match`). While files
are still arriving it says so; when offline and something is missing it shows an unavailable message and disables listening
(reading still works). Only adventures that have recordings make an offline claim. A device that has *never* loaded the app
online cannot open it offline at all – no web app can show anything then; that is the browser's own offline page.

### Links

Screens can be opened from a link. The dinosaur adventure: **https://nova-hosakademia.pages.dev/#/dino** (long form
`#/kaland/dino-muddy-footprints-01`). Also `#/vilag/dinosaurs`, `#/felfedezes`, `#/mai-kaland`, `#/sajat-vilagom/tools`,
`#/piheno`, `#/szuloi-ter` (still asks for the PIN). Following a link never changes saved progress; an adventure
in progress resumes where it stopped. By hand: Felfedezés → Dinoszaurusz-expedíció → A sáros lábnyomok rejtélye.

### Retelling

Completion methods are `self-reported`, `typed` or `adult-observed`. The adult checklist (per-item
Önállóan / Segítséggel / Most nem említette / Nem figyeltem meg) opens behind the parent PIN when one is set; no score is
ever shown to the child.

### Updates (mandatory behaviour – see CLAUDE.md)

The service worker uses `registerType: 'prompt'`. A new version downloads in the background and an info bar appears
**at the top of the main app**: „Új verzió érhető el" with the button „Frissítés" (`src/app/UpdateBar.jsx`). It is **not**
shown while an adventure is active – the adventure screens and their help panels, a break taken from the adventure, and
the completion screen – and nothing reloads there; it is offered once the child is back in the main app. Nothing ever
reloads until someone taps it, the bar cannot be dismissed, and progress lives in localStorage and survives the reload
(an adventure resumes at its step). Limits: the check runs when the app opens, when it returns to the foreground and
hourly, so a device that stays offline or closed keeps the old version until it next opens online (iOS may only check at
launch). Copies installed before the prompt version need one full close and reopen.

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

## Owner checklist (only the owner ticks these)

- [ ] Listened to all nine recordings: wording matches the text, pronunciation, pace, no clipping
- [ ] Playback tested on a real iPhone
- [ ] Playback tested on a real Android device
- [ ] Pause/resume, replay and shorter parts tested on a real device with the recordings
- [ ] Instructions are clear to Lacika without explanation
- [ ] Dinosaur adventure content review finished (until then it stays „unreviewed")
- [ ] Adventure 2 (Az összecserélt ládák): full Tab-only navigation through activities 1–4 tested and working (pending; the automated test skipped some focus transitions)
- [ ] Adventure 2 content review finished (until then it stays „unreviewed")
- [ ] Adventure 2: listened to all nine recordings (dino2-*.mp3): each says exactly its displayed text, pronunciation, pace, no clipping
- [ ] Adventure 2: recordings and cover checked on a real iPhone and a real Android device
- [ ] Adventure 3 (A Triceratops a kapunál): content review finished (until then it stays „unreviewed")
- [ ] Adventure 3: instructions clear to Lacika (clue selection, prediction, check) and spoken narration checked once recordings exist; real-device keyboard/touch use tested
- [ ] Focus handling (step heading focus, feedback announcements, help panel focus) tested with a real screen reader (VoiceOver/TalkBack) and on real devices
- [ ] Adventure 3: listened to all nine recordings (dino3-*.mp3): each says exactly its displayed text, pronunciation, pace, no clipping
- [ ] Adventure 3: recordings, cover and the prediction boundary (outcome stays hidden until the prediction is submitted) checked on a real iPhone and a real Android device


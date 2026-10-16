> **Historical.** This is the handoff note for the original single-file prototype (`NOVA.dc.html`). The app has since been rebuilt in React; see the root README for the current architecture. The design tokens below still apply.

# NOVA Hősakadémia – handoff

Continue building from this package. Main file: `NOVA.dc.html` (single-file app; open in a browser served from this folder so `assets/` resolves).

## What it is
Hungarian reading/listening comprehension practice app for a 10-year-old (Lacika), wrapped in a superhero academy world. Educational practice only – no diagnosis, no medical/brain claims, no speed scoring.

## Files
- `NOVA.dc.html` – current app (template markup + `class Component` logic in the `<script data-dc-script>` block). Earlier snapshots: `NOVA v1.dc.html`, `NOVA v2.dc.html`.
- `support.js` – runtime for the .dc.html format (needed to open the file).
- `assets/` – images: `command-room.png` (home/splash bg), `hero.png` (transparent hero), `bridge.png`, `observatory.png`, `map.png`, `nova-star.png` (star mark, transparent), `obj-*.png` (6 story objects cut from sheet), `tool-*.png` (5 tools). Originals in `assets/src/` and `uploads/`.

## Design system
Colours: background #102D35, surface #1C454D, reading #FFF4DF, ink #18343A, primary #F3C568, secondary #91D7E8, gold #EBD5A3, sand text #F6EAD2, muted #CFC3A8.
Font: Nunito Sans. Icons: Material Symbols Rounded. Radii 14–28px. Reading text 22px / 1.65, opaque sand panels. Min touch target 48px.
Logo: star mark + "NOVA" set in type (no "Hősakadémia" in the lockup – logo unfinished).

## Responsive
State `w` = window.innerWidth. <600 phone (bottom nav), 600–899 tablet portrait (bottom nav, wider grids), ≥900 left rail, ≥1240 hero column on home. Uses dvh units + env(safe-area-inset-*) for iPhone/Samsung.

## Screens (state.tab)
welcome (animated splash: hero rises → watch pulses → beam → star lands on chest → logo/text) · home (Mai hősküldetés card + 4 practice paths + adventure card) · practice (daily plan runner) · mission (8-stage "Az eltűnt energiamag") · map (6 hotspots, energy station = mission) · gear (5 tools, goggles unlock on mission completion) · rest (quiet / breathing sphere / movement) · parent (PIN gate, overview, settings, Saját szöveg editor).

## Practice system (logic: ACTS, PATHS, STRAT, practiceVals, startSession, pNext, adapt)
- 17 authored passages in `ACTS` across paths read/listen/seq/main, levels 1–3 (2–3, 4, 5 sentences), some `transfer:true` (new stories), some `kind:'instruction'`.
- Task types: understand, recall (text hidden), seq, main, later (delayed recall at end of daily plan).
- Phases: intro (strategy, first 2 sessions) → present → pause (Megállok/Átgondolom) → task → next; break; end.
- Strategy "Megállok → Átgondolom → Elmondom → Ellenőrzöm": full reminders sessions 0–1, compact 2–4, hidden 5+.
- Support ladder: 1st wrong → hint; 2nd → evidence sentence highlighted; Újra elolvasom / Újra meghallgatom / Átirat recorded separately.
- Adaptive length: 2 consecutive independent successes → level up; 2 supported → level down (toggle in parent settings).
- `attempts[]` records: mode, length, transfer, task type, first answer correct, rereads, replays, transcript, hints.
- Listening uses browser speech (Narrator object; `Narrator.recorded[id]` can map to real audio files). No Hungarian voice → adult reads aloud flow.

## Persistence
localStorage key `nova.hosakademia.v1` (settings, mission, events, tools, notes, pinCode, hw, hwSaved, prog, attempts, ps, psSaved).

## Known limits / next steps
- Hotspot positions on map estimated by eye.
- Splash "watch check" is simulated with light effects (single still image); a real pose needs new artwork.
- ~~Touch drag for sequencing relies on tap-to-place on phones~~ Fixed in the React port: hold a card briefly and drag it with a finger (`src/touchDrag.js`); tap-to-place still works.
- Not tested on real devices or with real audio.
- Ideas: recorded Hungarian narration, more passages, parent-adjustable passages per path, export parent report.

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
| `src/content/` | All educational content, as data. `worlds.js` (5 worlds), `energymag.js` (heroes adventure), `dino.js`, `crates.js`, `gate.js` (dinosaur adventures 1–3), `octopus.js` (animals), `space.js` (space), `courage.js` (Bátorság bolygója), `practice.js` (the prototype's 18 short practice texts converted to adventures), `audio.js` (clip id → recording), `badges.js`, `tools.js`, `authored.js` (original authored text), `index.js` (registry and parent-made adventures). |
| `src/activities/` | One component per activity type: `passage`, `choice` (also delayed recall), `sequence`, `evidence`, `vocabulary`, `retell`, `reflection`, `sort`, `instruction`, `correctPlacement`, `selectClues`, `prediction`, `informationCheck`, `fillBlank`, `route`, `outcome`, `storyChoice`. `shared.jsx` holds the common scoring rules (`useScored`). |
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

**Where the recordings come from.** All 59 files in `public/audio/` (the five newer adventures and `heroes.energymag`) carry
embedded content-credential metadata (C2PA) that names ElevenLabs. That is the only evidence in the repository: no account,
plan, licence, voice name or generation settings are recorded, so the provenance beyond "tagged as ElevenLabs" is **not
established**. `heroes.energymag` has 14 clips (`energymag-s1.mp3` … `s3-c3.mp3`): its three sections have no authored shorter
parts, so `…:s1:c0` etc. are the single sentences played one at a time by „Kisebb részekben haladok". The 18 practice texts
have **no recordings**; they use the Hungarian browser voice, or no audio on a device without one. The outcome panel of
adventure 5 is text only by design.

### The journey (unlocking and daily pacing)

`src/content/journey.js` lists the seven ordered full adventures: Az eltűnt energiamag → A sáros lábnyomok rejtélye → A polip
búvóhelye → A marsjáró elveszett üzenete → Az összecserélt ládák → A Triceratops a kapunál → Az első bátor lépés. Only the next unfinished one
opens, and **one new adventure opens per calendar day**:

- The first adventure is open at once. Completing a journey adventure **for the first time** schedules the next unfinished
  one for the **next calendar day** (device local time, midnight to midnight – not 24 hours later). Guided completion counts.
  Replays change nothing.
- A journey adventure is also open when it was completed before (replay) or already has a saved unfinished run (resume).
  An adventure with no unlock day is open, so progress made before pacing existed is **not** held back: pacing starts
  with the next new completion.
- Stored on the device (in `nova.hosakademia.v2`, key `pacing`): `completed` (first-completion day per adventure) and
  `unlocks` (the day each scheduled adventure opens). Refreshing, reopening, replaying and app updates leave them alone.
  Old saves without `pacing` load with empty records.
- Szülői tér → **Napi ütemezés** (behind the parent PIN; if no PIN exists it must be set first): shows the next adventure
  and its unlock day, lets the parent change that day or press „Feloldás most". An adventure unlocked early still
  schedules the following one for the next calendar day after it is completed; a later day chosen by the parent is never
  shortened by a completion.
- The completion screen says „Mára végeztél a kalanddal! A következő kaland holnap lesz elérhető." with the next title and
  date (a journey-complete message after the last one). Today and the locked cards/screens show when the next adventure
  opens and that the daily limit applies to new journey adventures; completed adventures and the practice texts stay open.
- The day is re-read when the app returns to the foreground, when the page is shown again, at the next midnight and once a
  minute (`today` in the store context).
- **The device clock decides.** Changing the clock (or the date) on the device changes what opens, so this is a pacing
  feature, not a tamper-proof parental control.

**Utazás újrakezdése** (Szülői tér → Napi ütemezés, asks for the PIN again and a confirmation): resets only the journey
adventures – their completions, unfinished runs, pacing dates and journey badges – so the child starts again from the first
adventure. PIN, name, settings, notes, own texts, practice progress, favourites, observations and retellings are kept; a
`journey_reset` event is logged. It cannot be undone.

Not locked: the 18 short practice texts (the optional „Gyakorlás (nem kötelező)" series of Hősök városa) and
parent-made texts. One rule, `access`/`canOpen` (with the day), is used by Today, the world cards, favourites, direct links
(a locked adventure shows only its title and what unlocks it, and when) and the store (a locked adventure never gets a
run). Pihenő is no longer in the main navigation or on the home page; „Szünetet tartok" in an adventure's help panel opens
it with a return button and keeps the run. Extend `JOURNEY` when more animal, space and heroes adventures arrive.

### Bátorság bolygója (world 5)

`src/content/courage.js`: „Az első bátor lépés” (`courage-first-step-01`, the 7th journey step), a fiction about **Léna**
(a new character, drawn after her look in the generated prototype video; Nóri's design is unchanged), her companion
robot **Csipp**, and the child (Lacika) who advises her. The text is the owner-approved package (design/world-5-courage-proposal.md).
Two plans remain *only* in that document, with no playable entry: „A félresikerült próba”, „A közös küldetés”.

- **`storyChoice`** (`src/activities/StoryChoice.jsx`): the child advises the character; every option is valid, there is no
  retry or hint ladder, and each option shows its own authored consequence (a section of the `paths` passage, with a
  recording when one exists). It logs `story_choice_made` (ids only) and **never** `activity_completed`, so it does not
  enter the scored observations. Only the three scored recall questions do.
- **Personal reflection** („Egy kis lépés nálad”, `private: true`): one choice, no free text; the parent view shows only that it was done.
- **Optional intro video** (`introVideo` in the adventure, shown by `IntroVideo` in `Adventure.jsx`): introduction screen
  only, started by a tap, never autoplaying, never beside narration, and it says it does not replace the story. **No
  video is set**: the prototype is not a final asset (14.8 MB, 7:4 format, unknown audio, unclear rights).
- **Artwork:** world art (`courage-world`) and the adventure cover (`courage-first-step`), each 1536 × 1024 and 768 × 512
  WebP in `public/assets/`, made by `scripts/optimize-art.mjs` from the masters in `design/source-art/courage/`. **Provenance:**
  generated with OpenAI's image-generation tool from the locked Léna and Csipp reference sheet; **usage rights have not been
  independently verified** (kept separate from the technical integration). The masters are PNG conversions of the WebP files
  delivered in the working session; the generator's original files were not available. The cover appears only on the
  card, the introduction and the Mai kaland card, never inside an activity; `coverPosition` keeps Léna's hair and flower inside
  the 360 px band on wide screens.
- **Recordings:** 15 clips (`courage1-*.mp3`: three passages with their shorter parts, and the six consequence clips
  `courage1-x1a…x2c`). **Production provenance, confirmed by the owner from ElevenLabs' generation history (not from the file
  metadata):** narrator **Adam – Articulate Engineering Professor**; model **Eleven v4**; language Hungarian; stability 50 %,
  similarity 75 %; thoughtful/warm tags; generated 2026-10-17. The files themselves only carry the C2PA credential „Eleven Labs
  Inc.” (no voice or settings). Usage rights/licence: not verified here.
- **Archive discrepancy (recorded accurately):** the owner's package (prepared with ChatGPT) held the clips **renamed to
  `courage1-*`, plus `manifest.json` and `CLAUDE-READ-ME.txt`**. The archive that reached this session
  (`ElevenLabs_Export_2026-10-17T17_10_52.zip`) held only **15 MP3s named by generation time and neither text file**, so
  they were mapped to clip ids by order. The owner confirms this timestamp mapping matches the generation order; the same
  check by duration and sentence-pause positions was consistent. **Spoken content (approved by the owner's listening review; was unverified until then):**
  exact words and the pronunciation of „Léna”, „Csipp”, „pittyentett” — **listening review done by the owner on 2026-10-17: wording, pronunciation and sound approved for all 15 clips.**
- **Trim:** `courage1-p1-c1.mp3` was shortened by 6 MP3 frames (0.157 s of trailing silence), which invalidates that file's embedded
  content credential. The untouched source is kept at `design/source-audio/courage/courage1-p1-c1.untrimmed-source.mp3`.
  `courage1-p3.mp3` is left as generated (its trailing silence meets the 0.3 s limit).
- **Release hold:** the listening review is complete (above); nothing is pushed or deployed until the owner says so.
- **Intro video (optional, integrated):** `public/video/courage-intro.mp4`, set as `introVideo` in `courage.js`. Source: the owner's
  `Nori And The Star Map.mp4`. **Provenance (owner's statement): generated through Hedra's signed-in interface using MiniMax H3 Max.**
  The file's embedded content credentials (C2PA) name **fal.ai** and mark it AI-generated. These describe different parts of the
  production chain; they are not a contradiction, and neither establishes usage rights. The original is untouched (md5
  `4b01099f4b0aaf90d8447c5b0933bccf`, 14.8 MB, 1344 × 768, 15.08 s,
  with audio) and a copy is kept locally in `design/source-video/courage/` (not committed). Final export with
  `scripts/encode-intro-video.swift`: **896 × 512 (exactly the original 7:4), 15.00 s, 24 fps, no audio track, H.264 Main level 3.1
  (8-bit 4:2:0 = yuv420p), moov atom before mdat (fast start), 2,721,049 bytes = 2.72 MB** (under 3 MB). Behaviour: shown only on the
  introduction (`IntroVideo` in `Adventure.jsx`), never inside an activity or a recall question; the cover is shown first and a tap on
  „Megnézem a bevezető videót” loads the file (nothing is downloaded before that) and swaps the cover for the player; browser
  playback controls, **no autoplay, no loop**, „Kihagyom a videót” closes it; it says it does not replace reading or hearing the story;
  the file is fetched whole and played from memory, like the recordings, because the host answers range requests with the whole file; on
  failure a note appears and the adventure starts normally. It is not part of any offline claim.
  **Tested in a desktop browser only** (phone-sized 375 px and desktop 1280 px windows: opens, plays, reaches the end without
  looping, skip returns to the cover, failure note on a blocked download). **Not tested on real iPhone/Android.**
  **Usage rights are not verified** (no licence or terms evidence for Hedra, MiniMax or fal.ai).

- **Content review (2026-10-17), against the approved Hungarian package** (design/world-5-courage-proposal.md §7.2/§7.3 with the owner's
  five corrections, the approved world description, choice note and interface strings): a script compared 61 text items directly and the six consequence
  texts (stored sentence by sentence) through the 15 narration texts, with `courage.js` and `audio.js`: **no deviation** (every narration text equals the sentences/parts the app derives;
  all 15 clip ids point to the right `courage1-*` file; every scored question has a source, hint, guided text and feedback; both
  choices point to existing consequence sections). The owner approved the 15 recordings by listening.
  **All wording reviews are closed (owner, 2026-10-17):** review status set to „adult-reviewed” (the label means that review only –
  not real-device testing and not usage rights); the shared wrong-answer wording („Nem ez”, „Nézd meg újra a szöveget, és próbáld újra.”,
  „Ez a helyes válasz.”) and the „Rövid szövegek” label stay unchanged; the three glossary definitions are approved as written; the
  announcement text „Most már kérheted a megoldás megmutatását.” is approved – **but it is still not implemented** (a shared change
  across the scored activities; today only the guided explanation is announced). **Tested with a real screen reader: no – untested**
  (focus handling, announcements, `storyChoice` consequence, the video player); this is separate from the completed content review.
  Offline: the recordings are covered by the app's offline check, the video is **not** (online only, on tap); real-device playback of
  recordings and video is **untested**.

### Eszközeim: worked examples are locked until the story is completed

All five strategy tools and their steps are open from the start. A worked example that shows the answers of one story
(goggles, glove and crystal use *Az eltűnt energiamag*) stays locked until that adventure is completed, so it cannot give
anything away before the first attempt; the screen explains this (`EXAMPLE_FROM` in `src/screens/MyWorld.jsx`). The shield (Lényeglátó pajzs) now has an approved explanation and a worked example from that story, locked the same
way. The compass (Újratervező iránytű) explains the existing help controls (`HELP_INTRO`, `HELP_EXPLAIN` in
`src/content/tools.js`; they are explanations, not new buttons) and is always shown. Examples for the other five
adventures are still to be authored (see the owner checklist).

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

- The app shell, icons and all artwork (`public/assets/*.webp`, currently about 5.7 MB including the recordings' covers) are precached; recordings are cached separately when first fetched (see Offline readiness). Whether the whole app really works offline has **not** been verified on a real device.
- Fonts come from Google Fonts and are cached at runtime.
- `base: './'` keeps the build working from any sub-path.
- Artwork is WebP generated from the PNGs in `design/source-art/app/` with `node scripts/optimize-art.mjs`
  (needs the `sharp` dev dependency).

## Publishing

Live at **https://nova-hosakademia.pages.dev** (Cloudflare Pages project `nova-hosakademia`, direct upload).
After changing the app: commit, `git push`, then `npm run deploy` (uses `wrangler`; run `npx wrangler login` once per
machine). Installed copies update the next time they are opened online.

### Release checklist – World 5, adventure 1 (scope frozen 2026-10-17)

**Scope is frozen:** no new features before release. The shared solution-button announcement („Most már kérheted a megoldás
megmutatását.”, wording approved) is **deferred to a separate task** and is **not implemented**.

**Private preview (before production):** `npm run build`, then the config `nova-preview-lan` in `.claude/launch.json`
(`npm run preview -- --host 0.0.0.0 --port 4174 --strictPort`) serves `dist/` on the home network at
`http://<this Mac's LAN address>:4174` (private to the Wi-Fi; stop the server when done). Over plain http the phone cannot register a
service worker, so the preview tests **recordings, covers, video and the adventure only** – **not** the update bar and **not** offline use.
The local preview answers range requests (the production host does not); the app loads the video and recordings whole, so this does not change the result.

**Before any production deployment is reported done (mandatory, `CLAUDE.md` §1):** the update-bar proof – `npm run build`, `npm run preview`
(on `localhost`, service worker active), clear the service worker, start an adventure, change a visible string, rebuild, call
`registration.update()`, and confirm (a) no bar in the adventure, its help panel or a break from it, (b) the bar appears after returning to the
main app, (c) „Frissítés” loads the new bundle and keeps the adventure and its step; undo the test change; after `npm run deploy` confirm the
live site serves the new bundle. **Not yet run for this build.** Do not report a deployment complete without it.

**Still marked untested / limited:** real-device playback of recordings and video (iPhone/Safari, Android/Chrome); real screen reader; the
video is online-only (not part of any offline claim); usage rights of the video, artwork and reference sheet are unverified.

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
- [ ] Accessibility (pending, not implemented): announce when the solution becomes available – „Most már kérheted a megoldás megmutatását.” – so a screen-reader user learns that „Megmutatom a megoldást” has appeared after the second miss
- [ ] Adventure 4 (A polip búvóhelye, animal world): content review finished (until then it stays „unreviewed")
- [ ] Adventure 4: instructions of the true / false / not stated activity clear to Lacika; real-device keyboard/touch use tested
- [ ] Adventure 4, pending verification: the update-bar proof for the deploy a53cadf (skipped by the owner's decision: no service worker in the built-in browser, Chrome not connected); listening and combined modes; the guided path (solution reveal) by keyboard only
- [ ] Adventure 4: listened to all nine recordings (octopus1-*.mp3): each says exactly its displayed text, pronunciation, pace, no clipping (only file durations and successful playback in a desktop browser were checked)
- [ ] Adventure 4: recordings, covers and offline readiness checked on a real iPhone and a real Android device (offline readiness needs a service worker, which the test browser could not register)
- [ ] Adventure 5 (A marsjáró elveszett üzenete, space world): content review finished (until then it stays „unreviewed")
- [ ] Adventure 5: instructions of the message-restoring and route activities clear to Lacika; real-device touch and keyboard use tested; the route map checked on real phone screens
- [ ] Adventure 5, pending verification: full Tab-only walk through every step in listening mode; screen-reader announcements of the rover position and the blank
- [ ] Adventure 5: listened to all nine recordings (rover1-*.mp3): each says exactly its displayed text, pronunciation, pace, no clipping (only file durations and successful playback in a desktop browser were checked)
- [ ] Adventure 5: recordings, covers (central 16:9 crop checked on screen only) and offline readiness checked on a real iPhone and a real Android device (offline readiness needs a service worker, which the test browser could not register)
- [ ] Update-bar proof: passed in a desktop browser on the journey build (bar hidden in an adventure, its help panel and a break; shown in the main app; „Frissítés" loaded the new bundle and the adventure resumed at its step). Still to do on real phones/tablets.
- [ ] Journey unlocking checked on real devices; the lock explanations read clearly to Lacika
- [ ] Needed from the owner: authored guided explanations for the practice main-idea texts `m1`, `m2`, `m3` (none exist; nothing was invented)
- [ ] Heroes adventure (Az eltűnt energiamag): listened to all 14 recordings (energymag-*.mp3): each says exactly its displayed text, pronunciation, pace, no clipping (only file durations and successful playback in a desktop browser were checked); checked on a real iPhone and Android device; offline readiness unverified
- [ ] Practice texts have no recordings (browser voice only); decide whether they get recordings
- [ ] Needed from the owner: artwork for the heroes practice texts (a neutral book icon is shown meanwhile)
- [ ] Splash screen fits the first screen without scrolling: checked in a desktop browser at 320×568, 375×667, 390×844, 667×375 (landscape) and 768×1024; still to check on real phones
- [ ] Update-bar proof on the six-step journey build: passed in a desktop browser (same checks as above); still to do on real phones; independently unverified by the owner
- [ ] Daily pacing checked on real devices: the day change at midnight, the foreground recheck, the parent date controls; the device clock is the only clock used
- [ ] „Utazás újrakezdése" tried by the owner on a real device
- [ ] Needed from the owner (to author, nothing invented): worked examples and strategy explanations for the tools, from the six journey adventures – see the list in the report of the Eszközeim check
- [x] Bátorság bolygója, adventure 1: marked „adult-reviewed” on the owner's instruction (text, recordings, interface strings; 2026-10-17). Open points 2–5 of the content-review list remain
- [ ] Adventure 1: usage rights of the generated artwork (and of the video-derived reference) verified; covers checked on real phones; the 15 recordings (`courage1-*.mp3`) listened to: exact wording, pronunciation of Léna/Csipp/pittyentett, pace, clipping (voice: Adam – Articulate Engineering Professor, Eleven v4); only then push/deploy
- [ ] Adventure 1: `storyChoice` instructions clear to Lacika; keyboard/touch and screen-reader announcement of the consequence tested on real devices; listening mode with real recordings
- [ ] Intro video: usage rights confirmed with evidence (generator terms/licence); plays on a real iPhone and Android; its look and length approved
- [ ] Eszközeim: the shield and compass texts read clearly to Lacika; the compass explanations match the controls on a real phone

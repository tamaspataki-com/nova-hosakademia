# NOVA – rules for every change

These are standing rules from the owner. They apply to every future change, deploy and content package.

## 0. Progress reports (mandatory, every task, every message)

Tamás is not a developer and wants to follow along. This is the same rule as in his other projects (babka, popcorn,
gyemantcsepp). Keep a numbered step list for the task and **start every message, including the last, with**

`Status: step X of N · about X%.`

using the real numbers; the last message says `Status: step N of N · 100%. Done.` When not finished, add what is left,
e.g. `Remaining: step 5 (check and deploy) · about 70%.` If something is wrong, say the problem right after the Status
line. A message in the middle of work (when the user asks "where are you at?") gets the same line. Use simple,
non-technical language.

## 1. The update bar (mandatory)

Whenever a new version of the app is available, an info bar must appear **at the top of the app**:
**„Új verzió érhető el" + the button „Frissítés"** (`src/app/UpdateBar.jsx`).

- It appears on **every screen, including during an adventure**, and stays until the app is updated.
- The app **never reloads by itself**. Only a tap on „Frissítés" applies the update.
- Saved progress survives the reload; the bar says „A haladásod megmarad.". An adventure resumes where it stopped.
- Never remove or hide the bar, never add a dismiss/„Később" button, never switch the service worker back to
  automatic updating. Keep `registerType: 'prompt'` and `clientsClaim: true` in `vite.config.js`, and keep
  `src/app/update.js`, `src/main.jsx` (`registerSW`) and `<UpdateBar />` in `src/App.jsx`.
- Sticky elements (side rail, adventure bar) sit below the bar through the `--update-h` CSS variable.

**Before reporting any deploy as done, prove the bar still works**: run `npm run build`, serve it with `npm run preview`,
open it (clear the service worker first), change a visible string, rebuild, call `registration.update()`, and confirm the
bar appears (also while an adventure is open), that tapping „Frissítés" loads the new bundle and keeps the adventure and
its step. Undo the test change. After `npm run deploy`, confirm the live site serves the new bundle.

Known limit to mention when relevant: a device that is closed or offline only sees the bar after the app next
opens online (iOS checks at launch); copies installed before the prompt version need one full close and reopen.

## 2. Content and learning rules

- The dinosaur adventure `dino-muddy-footprints-01` stays marked **unreviewed** until the owner finishes the review.
- Do not add stories, questions or educational content, and do not change supplied text, until a content package arrives.
- Never invent educational content or facts. Flag anything the shared system cannot express before substituting behaviour.
- Listening status is honest: completed / paused / interrupted / unknown / error; never claim playback finished when
  the device did not say so. Recorded audio resumes; speech restarts („Újra az elejéről") and is recorded as such.
- No diagnosis, no claims about attention or the brain, no speed scoring, no improvement claims from repeated texts.

- **Artwork never gives an answer away.** Adventure and world covers appear only in the library and on the
  introduction – never inside an activity (questions, sequencing, evidence, recall, retelling, reflection, completion).
  The dinosaur cover shows the footprints the questions ask about, so it must stay out of the steps.
- **Recorded narration** is mapped in `src/content/audio.js` (clip id → file in `public/audio/`). A recording must
  contain exactly the displayed text of its passage or authored shorter part – no questions, no extras. Raise `V`
  there whenever a recording is replaced (it is part of the cache key). Recordings are preferred over browser speech.

## 3. Data and safety

- **Preserve saved progress.** localStorage key `nova.hosakademia.v2`; any change to its shape needs a migration
  (`src/app/store.jsx`). Never wipe or rename it.
- No test audio or test data in production. Temporary test files must be removed before deploying.
- All primary interactive targets are at least 48 × 48 px.

## 4. Working conventions

- Publish with `npm run deploy` (Cloudflare Pages, https://nova-hosakademia.pages.dev); commit and `git push` first.
- Commit messages end with the co-author line the environment asks for.
- Report **Implemented / Verified / Remaining**, and separate browser tests from real-device and real-audio tests.

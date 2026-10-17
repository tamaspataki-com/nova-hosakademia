# World 5 – „Bátorság bolygója” – proposal and implementation record

**Production order (owner, 2026-10-17):** 1. character reference sheet (Léna and Csipp locked from the actual video); 2. world art and
adventure cover from that approved reference; 3. the 15 recordings (narrator must be identified first); 4. video, adapted or replaced
after the artwork is consistent. `introVideo` stays `null` until a final video meets the export spec and its rights are checked.
**Correction to §9:** the face-size requirement (≥ ~15 % of the image height) applies to the **adventure cover**; the world art may show
smaller characters. **Narrator:** not identifiable from the repository (see the README); the owner must name the voice before any
recording is made. **Approved:** world description „Segíts Lénának elindulni akkor is, amikor bizonytalan! …”, the choice note above,
and „Mi történt?” as the consequence heading.

**Update:** the Hungarian text was approved with five corrections (applied below in §7.2 and §7.3). Adventure 1 is implemented in the app (not deployed, not published); see the README section „Bátorság bolygója”. Still placeholders: world art, cover, the 15 recordings, the intro video.

Status of this file: **a proposal for the owner to approve or correct.** No code, content or asset has been added to the
app. Per `CLAUDE.md` §2 nothing educational may enter the app until it arrives as a content package, so the Hungarian
text below only becomes a package once the owner says "approved" (or sends corrected text). Everything marked
*placeholder* is my suggestion, not a decision.

---

## 0d. Listening review and video (2026-10-17)

The owner's listening review approved all 15 clips (wording, pronunciation, sound). The temporary review page was removed. The optional intro-video player is built; the Hedra video file was not on this machine, so it is not integrated (`introVideo: null`); rights unverified.

## 0c. Recordings integrated (2026-10-17)

15 ElevenLabs clips (`public/audio/courage1-*.mp3`, mono 44.1 kHz 128 kbps) are registered in `src/content/audio.js`. The export contained
no CLAUDE-READ-ME.txt and no manifest.json and named files by generation time; mapping to clip ids is by order, supported by duration and
sentence-pause positions. **Not confirmed by listening:** the exact words and the pronunciation of Léna, Csipp, pittyentett; the
narrator is **Adam – Articulate Engineering Professor** (Eleven v4, Hungarian, stability 50 %, similarity 75 %, thoughtful/warm tags), confirmed by the owner from ElevenLabs' history, not from file metadata. The owner's own package held renamed `courage1-*` files with `manifest.json` and `CLAUDE-READ-ME.txt`; the archive received here did not (timestamp names only); the owner confirms the order mapping. `courage1-p1-c1.mp3` trimmed by 6 frames (0.157 s). Tested in read, listening and combined modes.

## 0b. Covers delivered (2026-10-17)

World art `courage-world` (wide station, table, Léna and Csipp small) and adventure cover `courage-first-step` (close-up, Léna's face
about 36 % of the image height). **The owner's note labelled them the other way round** (first image "world", second
"adventure"); the first image is the close-up and the second the wide room, and the owner's suggested world alt text describes
the wide room, so I used them by content. Both are 1536 × 1024. Provenance: generated with OpenAI's image-generation tool from the locked
reference sheet; **usage rights not independently verified**. Masters: `design/source-art/courage/*.png` (conversions of
the delivered WebP files, not the generator's originals). Output: 1536 × 1024 (308 KB / 177 KB) and 768 × 512 (97 KB / 74 KB).
Character check against the sheet: hair, fringe, freckles, teal headband and flower, white suit with teal shoulders and collar,
orange stripe, round badge, teal glove cuffs, wrist device; Csipp's black faceplate with blue eyes, blue ear discs, antenna, floating glow – all match. The
cover's emotion (uncertain, looking aside) fits "before the presentation"; no audience, stage or result. Small differences: the badge emblem repeats on a
banner in the cover's background; the 3D rendering is slightly softer than the sheet. No mismatch needed artwork changes.

## 0a. Owner's answers (recorded 2026-10-17)

**Update (later the same day):** the owner fixed the names. The girl is **Léna**, a new character introduced in
„Bátorság bolygója”; **Nóri's design stays unchanged**; **Léna's look in the generated video is the visual reference for
all her illustrations and future videos**; the robot (**Csipp**, still a placeholder name) is her companion; and **Lacika
helps her make decisions** (see below). "Panni" in earlier drafts is now Léna everywhere.

Decisions 1 and 2 were answered explicitly: **the girl is a new character**, and the video is the *character reference*
but **not a final asset** (size, framing, audio and rights, §3, are unchanged). For decisions 3–8 the owner said to continue with the recommendations in the table below,
so they are now taken as: 3 approve `storyChoice`; 4 append as the 7th journey step; 5 record the consequence clips
(15 in total); 6 the real-life reflection shows only "completed" to the parent; 7 the Hungarian text is still **to be
approved or corrected** (nothing has been approved as a content package yet); 8 no peek at other options in version 1.
Still not done: no code, art, recordings or video work has started, and nothing is published.

## 0. Decisions needed from the owner (short list)

| # | Decision | My recommendation |
|---|---|---|
| 1 | **Who is the girl in the video?** She is not Nóri (see §3). Redraw her as Nóri, or make her a new character? | **Answered:** new character **Léna** (name given by the owner, "Léna" is not used anywhere else in the app); robot **Csipp** is still my placeholder. |
| 2 | **The video.** Use as final, as concept only, or re-render? | Not final (§3): 14.8 MB, 7:4 format, unknown audio, rights not established. Its *content* (design, camera arc, palette) is a good character and mood reference. |
| 3 | **A small new activity type, `storyChoice`** (unscored choice, different consequence per option). The shared system cannot express this today (§4). | Approve it. ~100 lines, modelled on `Prediction.jsx`. Without it "meaningful choices and consequences" cannot be done honestly. |
| 4 | **Journey placement.** Outside the daily-pacing journey, or the 7th step at its end? | Append as the 7th journey step (no migration needed, §5.3). |
| 5 | **Record the consequence texts?** (6 extra short clips; 15 clips in total instead of 9.) | Yes, otherwise a child in listening mode hears nothing after their own choice. |
| 6 | **Real-life reflection and the parent view.** Show the child's answer to the parent, or only "completed"? | Only "completed". The question is personal and the child should not feel observed on it. |
| 7 | **Approve / correct the Hungarian text** in §7 (it becomes the content package). | – |
| 8 | **Optional:** after choosing, may the child peek at what the other options would have led to? | Leave out of the first version (smaller scope); add later if wanted. |

---

## 1. What I inspected

- `CLAUDE.md` (all standing rules), `README.md`, `design/HANDOFF.md`, `src/content/*` (worlds, journey, audio map, all six
  full adventures), `src/activities/*`, `src/screens/Adventure.jsx`, `Complete.jsx`, `Explore.jsx`, `Today.jsx`,
  `src/app/store.jsx`, `vite.config.js`, `src/styles/app.css` (cover crops), `public/assets`, `public/audio`.
- The video file itself: container, track list, embedded credentials, audio level, nine frames spread over its length,
  and a close-up. I also compared it with the existing character art (`hero.webp`, `rover-message.webp`,
  `space-world.webp`).

### How the app is built (the parts this world must fit)

- **World → series → adventure → steps.** A world is an entry in `src/content/worlds.js`; an adventure is a data object
  registered in `src/content/index.js`; each step has a `type` that maps to one component in `src/activities/`. Nothing in
  the components knows about a particular story.
- **Existing step types:** passage, choice, sequence, evidence, vocabulary, retell, reflection, sort, instruction,
  correctPlacement, selectClues, prediction, informationCheck, fillBlank, route, outcome. Adventures use 8–9 steps and
  three narrated passages of 3–4 sentences, each with two authored shorter parts.
- **Completion rules** (`useScored`): the first answer, hints, rereads, replays and transcript use are recorded
  separately; completion is *independent / supported / guided*; a wrong answer shows an authored hint, from the second
  miss a guided explanation and „Megmutatom a megoldást” appear; the child is never forced to guess until right;
  completion is idempotent; a replay is practice and does not award the badge again. Only scored steps log
  `activity_completed` (the parent observations are built from it).
- **Artwork rule:** covers appear only in the library and on the introduction, never inside an activity.
- **Narration rule:** a recording contains exactly the displayed text of its section or authored part; clip ids are
  `<adventureId>:<passageId>:<sectionId>[:c<i>]` in `src/content/audio.js`; recordings win over browser speech.
- **Journey/pacing** (`src/content/journey.js`): six ordered adventures, one new one per calendar day; adventures outside
  the list are never locked. Today (Mai kaland) only ever suggests the next *journey* adventure.
- **Media:** the PWA precaches `assets/*.webp` (and shell files) and has a runtime cache for `.mp3` only. **There is no
  video support anywhere** (no `<video>`, no cache rule, no `mp4` in the precache pattern; the precache file limit is
  3 MB).

---

## 2. Overlap with existing content

| Area | What exists | Effect on the new world |
|---|---|---|
| **Character name** | **Nóri** is the mission-control character of the space adventure (an adult woman in the cover art). The video is titled „Nori”. | Resolved: the girl is **Léna**, a different person from Nóri; Nóri's design is unchanged (§3a). |
| **Setting** | Space world already has a control room, a ringed planet (`space-world.webp`) and an observation tower; the rover adventure has a *route map*. The video room shows a ringed planet too. | The new station must not look like a copy of the space world. Ask the art for a clearly different place (star-map room) and a different silhouette. |
| **Star motif** | The gold four-point star is the NOVA brand mark and the hero's chest emblem; the dino adventure has a "star-shaped footprint" clue. | Keep a "star map" as a *place*, not a second logo. No second star emblem on characters. |
| **Help theme** | The compass tool, `HELP_INTRO` („Segítséget kérni nem hiba.”), the help sheet („Segítséget kérek”), the guided solution, and „Segítséget kértem.” in every reflection. | Strong fit for adventure 3, but the story must not contradict or duplicate those labels; reuse the same wording. |
| **Mistakes theme** | Adventure 2 „Az összecserélt ládák” (mixed-up crates, correct placement); wrong answers already show kind hints. | Planned adventure 2 must be about *the character's own error and what she does with it*, not another sorting puzzle. |
| **Characters** | Mira (heroes), Bence (dinosaurs), Nóri (space), the animals adventure has none; Lacika is the child. | No other clash. |
| **Existing wording** | „Megállok → Átgondolom → Elmondom → Ellenőrzöm” method banner, badges are decorative. | New badge stays decorative. |

No existing text is reused or contradicted by the proposed text.

---

## 3. The prototype video, inspected

**Facts (measured):** `Nori And The Star Map.mp4`, 14.8 MB, 1344 × 768 (7:4), video 15.08 s and a stereo AAC audio track of
15.10 s at 32 kHz.

**Provenance:** it carries embedded content credentials (C2PA) that mark it as AI-generated (IPTC *trainedAlgorithmicMedia*),
signed by *fal.ai*, created 2026-10-17 16:01 UTC. The generator model, licence and usage rights are **not** recorded, so
whether it may be shipped commercially is **not established** (same situation as the ElevenLabs note in the README).

**CORRECTION (2026-10-17):** an earlier version of this section described the video as static, with tiny faces and no
recognisable map. That was **wrong**: those frames were taken in a hidden browser pane that does not update video frames, so
every sample was the same first frame. The description below comes from 11 frames decoded with the macOS video decoder
(AVFoundation, at 0.1 s … 14.9 s; all 11 differ).

**What the video shows (11 decoded frames, 0.1–14.9 s):**
- **Camera:** a steady dolly-in. At the start the whole room is visible (a cream/orange control room, an oval window with a large
  ringed planet, orange chairs, a round table); by the end the camera is close on Léna's face and shoulders. Faces are large and
  readable from about 7 s onwards (roughly 25–35 % of the frame height in the last third).
- **Léna:** a young girl with child proportions, a brown bob with a fringe, freckles, big brown eyes and a **teal headband
  with a small flower bow**. Her suit is **white with turquoise/teal panels and trim, an orange stripe at the chest and a small
  round badge**; white gloves. Her expression follows a clear arc: worried/uncertain (closed or lowered eyes, small frown) →
  hand on a glowing button on the table → a gold constellation of linked light points lights up around her head → a calm,
  pleased smile.
- **Csipp:** a round, white, glossy robot head/body with turquoise accents, a **dark glass faceplate with glowing blue eyes**
  (heart-shaped eyes in the last frames), a small antenna with a ball on top, and a small body that floats beside her.
- **The star map:** the round table top is a dark-blue star map with constellation lines, orbits and a glowing pad in the
  middle. At the end a gold constellation appears in the air. So the "star map" **is** recognisable, and the motion matches
  the story (nervous first step → something lights up → relief).
- Not seen: gold trim or the NOVA star emblem on Léna.

**Audio:** the first ~10 s sit at a very low steady level (ambient hum); the last ~5 s are 3–6× louder. I cannot tell
whether that is speech or music. **If it is speech, its language and wording are unknown**, and a spoken line that is not
the displayed text would break the narration rule. The owner needs to listen to it once.

**Character design vs Nova:**

| | Nóri (space cover) | Hero / avatar (`hero.webp`) | Video girl („Nori”) |
|---|---|---|---|
| Age | adult | about 10–12, boy | young child, girl |
| Look | cinematic, realistic painterly | stylised 3D animation | stylised 3D animation, rounder, more cartoon (same family as the hero, different palette) |
| Palette | dark teal, cream, gold trim, gold badge | dark teal, cream, gold, gold star emblem | white with turquoise trim and an orange stripe, teal headband; orange/cream room; **no gold trim or star emblem** |
| Verdict | – | – | **Not Nóri. Related to the hero only loosely (same animation family, different palette).** |

**Technical fit:**
- 7:4 is not the app's 3:2 cover ratio. As a 3:2 poster the sides are cut by about 14 %; the characters survive, but on
  desktop (`.cover` max-height 360 px) the table's lower edge is trimmed.
- 14.8 MB is five times the size of a good result. It is above the 3 MB precache limit, so it would never be available
  offline, and the README states that the host answers range requests with the whole file – iPhones can refuse to play
  video served that way. A re-encode is needed in any case. I cannot do it here: `ffmpeg` is not installed on this machine.

### 3a. Léna and Csipp – canon (owner's decision)

- **Léna** is a new character, first seen in „Bátorság bolygója”. Her look in the generated video is the reference for every
  illustration and future video: child proportions, brown bob with fringe, freckles, big brown eyes, teal headband with a small
  flower bow, white spacesuit with turquoise trim, an orange chest stripe and a small round badge, white gloves, stylised
  3D-animation rendering. **Nóri is untouched** (adult, realistic cover style, teal/gold uniform); the two must be
  clearly different people and are never drawn as the same person.
- **Csipp** (placeholder name) is Léna's companion robot: round, white and glossy with turquoise accents, a dark glass faceplate with glowing blue eyes, a small antenna with a ball, floating beside her, as in the video.
- **Lacika helps Léna decide.** Lacika is the child using the app; his name is a setting (default „Hős”) and the recordings
  are fixed files, so **no narrated sentence can contain his name**. The role lives in the *unnarrated* prompts („Mit
  tanácsolsz Lénának…”, „Két döntésben segítettél Lénának”) and in the two choices, which are his. Léna and Csipp never
  decide those two things themselves.
- Open issues the reference brings along: the video's rights
  are not established (fal.ai credentials only), which now matters more because it becomes the basis for a whole character;
  the room's bright orange/cream palette differs from Nova's dark teal/gold, so the station needs a deliberate look of its
  own (this is also what keeps it apart from the space world).

### 3b. Locked character reference sheet (owner-supplied, 2026-10-17)

`design/source-art/courage-reference/lena-csipp-character-sheet.png` (1659 × 948, the copy pasted into the session; the
original full-resolution file stays with the owner). It is a **production reference, not an in-app illustration**, and the
reference for all World 5 artwork. It is not committed (rights of the AI-generated sources are not established). What it fixes:

- **Léna, three views** (front, three-quarter, side) and **three expressions** (worried; thinking, finger at the chin; calm
  with a slight smile). Brown bob with a side-swept fringe, big brown eyes, freckles, rosy cheeks, a **teal headband with a
  teal flower on her right**. Suit: **white with teal shoulders, collar and chest panel, orange stripes (chest, arms, legs),
  teal knee pads, teal glove cuffs and boot soles, a silver neck ring, a small round chest badge (blue/orange emblem) and a
  small teal device on one forearm**. Child proportions, a head about a quarter of the body height.
- **Csipp, three views:** white rounded head with a **black glass faceplate and two round glowing blue eyes**, blue ear discs,
  a thin antenna with a white ball, a small white body with blue rounded panels and short arms, **no legs: it floats on a soft
  blue glow**.
- Look: soft stylised 3D animation, warm cream background, rounded shapes. No NOVA gold star on Léna; none of Nóri's dark
  teal/gold uniform, bun or realistic style.
- The sheet matches the video except small details (the video's chest has an orange stripe and badge; the sheet adds teal
  knee pads and glove cuffs): **where they differ, the sheet wins.**

Rules for every later image: same face, hair, colours and proportions as this sheet; Csipp always floating; the cover shows
Léna's face at ≥ ~15 % of the image height (world art may show her smaller); no text in pictures.

**Verdict (the video as a file):** not a final asset. It is the character reference, not something to ship. Where it could sit if re-made: the **introduction screen
only** (like the covers), started by the child, never inside an activity and never autoplaying with sound.

---

## 4. Required changes to the brief

1. **Character identity** (decision 1) – the brief treats the video's character as given; it conflicts with Nóri.
2. **Choices and consequences need one new shared activity.** Today: `choice` is scored right/wrong; `prediction` accepts
   any option but its feedback is only "best supported" / "other"; `route` has a correct path; `outcome` is a static text.
   Nothing lets the child pick among valid options and see a *different* consequence per option. Per `CLAUDE.md` §2 I am
   flagging this instead of faking it with `choice`. Proposal: `storyChoice` – options (shuffled once, stable ids), no
   right/wrong styling, no hints ladder, an authored consequence panel per option (with its own recording), then „Tovább”.
   It logs `story_choice_made` (ids only) and must **not** log `activity_completed`, so choices never enter the scored
   observations. All paths converge on the same next passage, so the three narrated passages stay identical for every child.
3. **"Confidence must not depend on always choosing correctly"** is met by: (a) the two choices have no wrong option;
   (b) the scored questions test understanding of the story, never the child's bravery; (c) a wrong answer gets the
   existing kind hint, and the story's own lesson is that stumbling is information.
4. **Wording rules** (`CLAUDE.md` §2): no claim that the app builds confidence, no improvement claim, no diagnosis. The
   texts speak about the character only. Parent-facing descriptions must say "reading and listening practice with a story
   about small steps", not "builds confidence".
5. **Planned adventures stay out of the code.** Even an `upcoming` object would be a hidden entry in `BUILTIN`; the two
   planned adventures live only in this document (§6). The world then shows exactly one adventure.
6. **Video** needs its own work (a `<video>` component on the introduction, a cache rule, captions if it speaks, a
   re-encode). I recommend deferring it until the character decision is made; the adventure works without it.
7. **Docs to update at implementation:** the comment "The four worlds" in `worlds.js`, README ("4 worlds", clip counts,
   owner checklist), `CLAUDE.md` §3b (new unverified items).

---

## 5. World 5 – data and visuals

### 5.1 World entry

```
id: 'courage'
name: 'Bátorság bolygója'
description: 'Kis lépések, próbák és közös küldetések egy csillagtérkép-állomáson.'   (placeholder)
icon: 'flag'            (only shown when there is no art)
art: 'assets/courage-world.webp', artSet 768w/1536w
artAlt: (written when the art exists)
series: [{ id: 'star-map-station', name: 'A csillagtérkép-állomás' }]
```

The Explore grid is `auto-fill`, so a fifth card needs no layout change. A world with one available adventure shows
„1 kaland”; the existing „Az első kaland előkészületben van.” is only for an empty world.

### 5.2 Adventure fields (adventure 1)

`id: 'courage-first-step-01'`, `worldId: 'courage'`, `seriesId: 'star-map-station'`, `format: 'story'`,
`classification: 'fiction'`, `review: unreviewed` (until the owner finishes the review), `modes: read/listen/combined`,
`objectives: ['detail','mainIdea']` (parent area only, `hideObjectives`), `badge: 'elso-lepes'` (decorative; name „Első
lépés”, Material icon `directions_walk`, never unlocks anything), `stepWords: true`.

### 5.3 Journey placement (decision 4)

- *Append as the 7th journey step:* no migration. `access()` opens it at once for a child who has finished the six, and
  locks it as „order” for others until they reach it. Today then suggests it; „Utazás újrakezdése” resets it with the others
  (the parent screen already reads `JOURNEY`). Cost: one more calendar day per new adventure for children who are mid-journey.
- *Outside the journey:* never locked, but Today never suggests it, and Today still says „Végigjártad az összes jelenlegi
  kalandot!” while a new world exists. Worse discoverability.
- Saved progress: `nova.hosakademia.v2` needs **no migration** – history and step state are keyed by adventure/step id.

---

## 6. The three adventures

| | 1 · „Az első bátor lépés” | 2 · „A félresikerült próba” | 3 · „A közös küldetés” |
|---|---|---|---|
| Status | **Full proposal below** | Planned only | Planned only |
| Idea | Léna has to present something and is nervous; she and Csipp find a very small first action. | Léna's test of the star-map equipment fails. What happens next: hide it, rush a fix, or look at what actually went wrong. | The team task is too big for one person. Who to ask, and how to ask a clear question. |
| Reading skills | detail recall, main idea | cause and effect, sequence, evidence | connecting information from several speakers, following instructions |
| Choices | two unscored choices (first step; getting stuck) | one unscored choice about the mistake, scored cause/sequence questions | one unscored choice of *whom* and *how* to ask |
| Closing reflection | a small step in the child's own life | "what can a mistake tell us" | "who could I ask" |
| Needs | `storyChoice` | `storyChoice`, existing `sequence`/`evidence` | `storyChoice`, existing `informationCheck` |
| Watch out | – | must not repeat the crate-sorting puzzle; the error is the character's, small and fixable | reuse the compass wording („Segítséget kérni nem hiba.”); do not duplicate the help buttons |

Texts, questions and recordings for 2 and 3 are **not** written. No playable entry exists for them.

---

## 7. Adventure 1 – complete proposal

### 7.1 Screen sequence

| Screen | What the child sees | Notes |
|---|---|---|
| Felfedezés | Fifth world card „Bátorság bolygója” (art, „1 kaland”). | New world art (§9). |
| World view | Cover, description, series „A csillagtérkép-állomás”, one adventure card with thumbnail, modes, status. | |
| Introduction | Cover (or the intro video, if approved later), chips (Történet, Kitalált kaland, Rövid szövegek), title, intro text, start button „Elindulok Lénával”. | Cover shows Léna and Csipp *before* anything happens: no applause, no stage, nothing that gives away an ending. |
| Mode choice | Olvasok / Hallgatok / Olvasok és hallgatok. | Shared screen. |
| 1 | A történet – 1. rész | passage · narrated (full + 2 parts) |
| 2 | Felidézés | choice · scored |
| 3 | Az első lépés | **storyChoice** · unscored · 3 consequences, each narrated |
| 4 | A történet – 2. rész | passage · narrated |
| 5 | Felidézés | choice · scored |
| 6 | Elakadás | **storyChoice** · unscored · 3 consequences, each narrated |
| 7 | A történet – 3. rész | passage · narrated |
| 8 | Összefoglalás | choice · scored |
| 9 | Visszatekintés | reflection · unscored (the standard „Mi segített most?”) |
| 10 | Egy kis lépés nálad | reflection · unscored, single choice (real-life) |
| Completion | Title, text, discovery card, decorative badge, next-adventure/pacing card if journey, buttons. | Shared screen. |

Help (the „Segítséget kérek” sheet) works as everywhere: hint, reread/transcript, replay, shorter part, break. The update bar
is hidden throughout the adventure, as the rules require.

### 7.2 Hungarian text (all of it is a proposal)

**Cím:** Az első bátor lépés
**Leírás (kártya):** Léna ma először mutat be valamit a csapatnak. Segíts neki kis lépésekkel elindulni!
**Bevezető:** Léna az űrállomás csillagtérképénél áll. Ma neki kell bemutatnia az első csillagképet, és kicsit izgul. Segíts neki megtalálni az első kis lépést!
**Indító gomb:** Elindulok Lénával
**Kép leírása (alt):** Léna és Csipp, a kis robot a csillagtérkép asztalánál az űrállomáson *(to be matched to the real art)*

**Szómagyarázat (glossary):**
- csillagkép – Az égbolton egymáshoz közelinek látszó csillagok csoportja, amelynek nevet adtak.
- beszámoló – Rövid előadás arról, amit megtudtunk vagy elvégeztünk.
- segítőrobot – Olyan robot, amely a munkában segít.

**A történet**

*1. rész* (két rövidebb rész: mondat 1–2 és 3–4)
1. Léna az űrállomás csillagtérképe előtt állt.
2. Ma neki kellett bemutatnia a csapatnak az első csillagképet.
3. A keze kicsit remegett, a szíve pedig gyorsabban vert.
4. Csipp, a kis segítőrobot odagurult mellé.

**1. lépés → 2. lépés – Felidézés**
Kérdés: Mit kellett Lénának bemutatnia a csapatnak?
Válaszok: *Az első csillagképet.* ✓ · Egy új űrhajót. · Egy új bolygót.
Támpont: A történet első mondatai elmondják, mit kellett bemutatnia.
Irányított magyarázat: Lénának az első csillagképet kellett bemutatnia a csapatnak.
Visszajelzés (helyes): Jól felidézted, mi volt Léna feladata.

**3. lépés – Az első lépés** (storyChoice)
Cím a képernyőn: Mit tanácsolsz Lénának: mi legyen az első kis lépése?
Segítő sor: Válassz egy lehetőséget, és nézd meg, mi történik utána!
Gomb: Ezt választom

| Válasz | Következmény (felolvasható szöveg) |
|---|---|
| Csak az első mondatot mondja el halkan Csippnek. | Léna halkan elmondta az első mondatot. Csipp vidáman pittyentett. Léna úgy érezte, hogy most már könnyebb lesz kimondania a következőt. |
| Végigpróbálja az egész beszámolót Csipp előtt. | Léna elmondta az egész beszámolót, de a közepén elakadt. Csipp azt mondta: „Most már tudjuk, melyik részt érdemes még átnézni.” Léna még egyszer átnézte azt a részt, mielőtt megérkezett a csapat. |
| Megvárja, amíg egyáltalán nem izgul. | Léna várt, de az izgulás nem múlt el magától. Közben a csapat gyülekezni kezdett. Csipp halkan azt javasolta: induljon egy nagyon kicsi lépéssel. Léna megpróbálta, és halkan elmondta az első mondatot. |

*2. rész* (két rövidebb rész: mondat 1–2 és 3–4)
1. A csapat összegyűlt a térkép körül.
2. Léna megérintette a legelső csillagot, az pedig halványkéken felvillant.
3. Elkezdte mondani a csillagkép nevét és a történetét, de közben elakadt.
4. Egy pillanatra elhallgatott.

**5. lépés – Felidézés**
Kérdés: Mi történt, amikor Léna megérintette az első csillagot?
Válaszok: *Halványkéken felvillant.* ✓ · Kialudt a térkép. · Csipp elgurult.
Támpont: Nézd meg, mi történt a csillaggal!
Irányított magyarázat: Amikor Léna megérintette a legelső csillagot, az halványkéken felvillant.
Visszajelzés (helyes): Jól felidézted a részletet.

**6. lépés – Elakadás** (storyChoice)
Cím a képernyőn: Léna elakadt. Mit tanácsolsz neki?
Segítő sor és gomb: ugyanaz, mint a 3. lépésnél.

| Válasz | Következmény (felolvasható szöveg) |
|---|---|
| Mély levegőt vesz, és újrakezdi az utolsó mondatot. | Léna mély levegőt vett, és újrakezdte az utolsó mondatot. Másodszorra már végig tudta mondani. |
| Ránéz a jegyzetkártyájára. | Léna elővette a zsebéből a jegyzetkártyát. Megtalálta rajta, hol tartott, és folytatta. |
| Rövidebben mondja el a többit. | Léna rövidebben mondta el a többit. Néhány részletet kihagyott, de elmondta, melyik csillagképet mutatja, és miről kapta a nevét. |

*3. rész* (két rövidebb rész: mondat 1 és 2–3)
1. Léna befejezte a beszámolót.
2. Nem lett tökéletes, de elkezdte, elakadt, és mégis folytatta.
3. Csipp beírta az állomás naplójába: „Ma Léna megtette az első lépést.”

**8. lépés – Összefoglalás**
Kérdés: Melyik mondat foglalja össze legjobban a történetet?
Válaszok: *Léna kis lépésekkel elkezdte a beszámolót, és akkor is folytatta, amikor elakadt.* ✓ · Léna hibátlanul elmondott mindent, ezért nem kellett izgulnia. · Léna úgy döntött, hogy inkább nem mutatja be a csillagképet.
Támpont: Melyik válasz szól az egész történetről, az elejétől a végéig?
Irányított magyarázat: Léna kis lépésekkel elkezdte a beszámolót, és akkor is folytatta, amikor elakadt.
Visszajelzés (helyes): Összefoglaltad a történet lényegét.

**9. lépés – Visszatekintés** (több választható, nincs pontozás)
Cím: Mi segített most?
- Elképzeltem, mi lehet az első kis lépés.
- Megnéztem, mi történt a választásom után.
- Visszakerestem a történetben.
- Újra meghallgattam a szöveget. *(csak ha volt hallgatás)*
- Segítséget kértem.
- Most még nem tudom. *(kizárólagos)*

**10. lépés – Egy kis lépés nálad** (egy választás, nincs pontozás, nincs szabad szöveg)
Cím: Mi lehetne neked az első kis lépés valamiben, ami nehéznek tűnik?
- Elmondanám valakinek, akiben bízom.
- Kipróbálnám egy nagyon kicsi részét.
- Felírnám vagy lerajzolnám az első lépést.
- Most nem szeretnék válaszolni. *(kizárólagos)*

Választás után: Ezt most nem kell megtenned. Egyelőre elég kigondolnod, mi lehetne az első kis lépésed.

**Felfedezés (kitalált történetből):**
A kis lépés is lépés – Léna nem várta meg, hogy az izgulás teljesen elmúljon. Egy kicsi lépéssel kezdett, és folytatta, amikor elakadt.

**Befejezés:**
Cím: Léna megtette az első lépést!
Szöveg: Végigkövetted, hogyan kezdett el Léna kis lépésekkel valamit, ami nehéznek tűnt. Két helyzetben segítettél neki dönteni. Láttad, hogyan tudott elindulni, majd folytatni, amikor elakadt.
Gombok: Vissza a kalandokhoz · Megnézem a felfedezésemet
Jelvény: Első lépés (csak dísz).

### 7.3 Narration script (what is recorded, word for word)

Rule: each file holds exactly the displayed text, nothing else. Questions, answer options, hints, the choice prompts and
the reflections are **not** recorded (as in every existing adventure). Format as the existing files: mono, 44.1 kHz,
128 kbps CBR MP3. Same voice as the five newer adventures for consistency (the repository does not record which voice
that is – the owner must supply it).

| File | Clip id (`courage-first-step-01:…`) | Text |
|---|---|---|
| `courage1-p1.mp3` | `story:p1` | Léna az űrállomás csillagtérképe előtt állt. Ma neki kellett bemutatnia a csapatnak az első csillagképet. A keze kicsit remegett, a szíve pedig gyorsabban vert. Csipp, a kis segítőrobot odagurult mellé. |
| `courage1-p1-c0.mp3` | `story:p1:c0` | Léna az űrállomás csillagtérképe előtt állt. Ma neki kellett bemutatnia a csapatnak az első csillagképet. |
| `courage1-p1-c1.mp3` | `story:p1:c1` | A keze kicsit remegett, a szíve pedig gyorsabban vert. Csipp, a kis segítőrobot odagurult mellé. |
| `courage1-p2.mp3` | `story:p2` | A csapat összegyűlt a térkép körül. Léna megérintette a legelső csillagot, az pedig halványkéken felvillant. Elkezdte mondani a csillagkép nevét és a történetét, de közben elakadt. Egy pillanatra elhallgatott. |
| `courage1-p2-c0.mp3` | `story:p2:c0` | A csapat összegyűlt a térkép körül. Léna megérintette a legelső csillagot, az pedig halványkéken felvillant. |
| `courage1-p2-c1.mp3` | `story:p2:c1` | Elkezdte mondani a csillagkép nevét és a történetét, de közben elakadt. Egy pillanatra elhallgatott. |
| `courage1-p3.mp3` | `story:p3` | Léna befejezte a beszámolót. Nem lett tökéletes, de elkezdte, elakadt, és mégis folytatta. Csipp beírta az állomás naplójába: „Ma Léna megtette az első lépést.” |
| `courage1-p3-c0.mp3` | `story:p3:c0` | Léna befejezte a beszámolót. |
| `courage1-p3-c1.mp3` | `story:p3:c1` | Nem lett tökéletes, de elkezdte, elakadt, és mégis folytatta. Csipp beírta az állomás naplójába: „Ma Léna megtette az első lépést.” |
| `courage1-x1a.mp3` | `paths:x1a` | Léna halkan elmondta az első mondatot. Csipp vidáman pittyentett. Léna úgy érezte, hogy most már könnyebb lesz kimondania a következőt. |
| `courage1-x1b.mp3` | `paths:x1b` | Léna elmondta az egész beszámolót, de a közepén elakadt. Csipp azt mondta: „Most már tudjuk, melyik részt érdemes még átnézni.” Léna még egyszer átnézte azt a részt, mielőtt megérkezett a csapat. |
| `courage1-x1c.mp3` | `paths:x1c` | Léna várt, de az izgulás nem múlt el magától. Közben a csapat gyülekezni kezdett. Csipp halkan azt javasolta: induljon egy nagyon kicsi lépéssel. Léna megpróbálta, és halkan elmondta az első mondatot. |
| `courage1-x2a.mp3` | `paths:x2a` | Léna mély levegőt vett, és újrakezdte az utolsó mondatot. Másodszorra már végig tudta mondani. |
| `courage1-x2b.mp3` | `paths:x2b` | Léna elővette a zsebéből a jegyzetkártyát. Megtalálta rajta, hol tartott, és folytatta. |
| `courage1-x2c.mp3` | `paths:x2c` | Léna rövidebben mondta el a többit. Néhány részletet kihagyott, de elmondta, melyik csillagképet mutatja, és miről kapta a nevét. |

15 clips (about 1.5 MB, comparable to one existing adventure). The consequence sections live in a second passage
(`paths`) so they use the same playback and replay machinery; their transcripts are shown in listening mode on request,
exactly as for the story sections. Pronunciation to check: „Csipp”, „Léna”, „pittyentett”.

---

## 8. Implementation work list (only after approval)

1. `src/activities/StoryChoice.jsx` + registration in `activities/index.jsx` (not in `SCORED`); focus and live-region
   handling as in `Prediction.jsx`; targets ≥ 48 px; consequence announced once; playback of the consequence clip.
2. `src/content/courage.js` (the adventure, text exactly as approved), `worlds.js` (world 5), `index.js` (register),
   `audio.js` (15 clips), `badges.js` (`elso-lepes`), `journey.js` (decision 4).
3. Artwork and recordings (§9) into `public/assets`, `public/audio`; originals in `design/source-art/courage/`.
4. Parent view: make sure `story_choice_made` and the real-life reflection do not appear as scores; show only "completed"
   for step 10 (decision 6).
5. README, `CLAUDE.md` §3b and the owner checklist updated.
6. Verification (browser): all three modes, wrong answers → hints → solution reveal on steps 2, 5, 8; both choices with all
   six options; keyboard-only walk; 320 × 568 and 375 × 667; listening mode with and without a Hungarian device voice
   (`?noaudio`); resume mid-adventure; completion idempotent; badge once; replay labelled practice; the existing five
   adventures unchanged. Then the update-bar proof on the built version, as `CLAUDE.md` §1 requires, before any deploy.

**Will be reported as unverified until the owner tests on real devices** (same standing as the existing adventures):
recordings on iPhone/Safari and Android/Chrome, their spoken content, the new activity with a real screen reader,
touch use, and the instructions' clarity to Lacika.

---

## 9. Asset manifest and exact specifications

| # | Asset | Spec | Notes |
|---|---|---|---|
| 1 | **World art** `courage-world.webp` + `courage-world-768.webp` | 1536 × 1024 (3:2) and 768 × 512, lossy WebP q90 via `scripts/optimize-art.mjs`; ≤ ~450 KB / ≤ ~100 KB; master PNG in `design/source-art/courage/`. | Shows the star-map station as a place. **Keep everything important inside the central 16:9 band** (the world card crops to 16:8 on wide screens). No text or letters in the picture. Must not look like the space-world picture. |
| 2 | **Adventure cover** `courage-first-step.webp` + `-768.webp` | Same specs. Subjects inside the central 16:9 band; the library thumbnail (108 × 72) shows the centre. | Léna and Csipp at the star-map table, drawn after the video (§3a), **before** the presentation: no stage, audience, applause or finished result. Appears only in library and introduction. |
| 3 | **Character reference sheet** (not shipped) | Léna and Csipp: front, ¾, side; three expressions (nervous, thinking, relieved); **drawn from the video** (§3: Léna's face, brown bob and fringe, freckles, teal headband with bow, white suit with turquoise trim and orange chest stripe; Csipp's glossy white body, dark faceplate with glowing blue eyes, antenna); flat background. | Needed before adventures 2 and 3 so the characters stay the same. Léna must not borrow Nóri's teal/gold uniform, bun or realistic style. |
| 4 | **Narration**, 15 MP3 | §7.3; mono, 44.1 kHz, 128 kbps CBR, no silence > 0.3 s at either end, exactly the text. | `V` in `audio.js` only needs raising when a file is *replaced*. |
| 5 | **Badge** | None (Material icon `directions_walk`). | Decorative only. |
| 6 | **Intro video** (optional, deferred) `courage-intro.mp4` (+ `.vtt`) | MP4, H.264 (Main), yuv420p, AAC-LC mono ≤ 64 kbps *or no audio track*, ≤ 15 s, 24 fps, 7:4 or 3:2, longest side ≤ 960 px, **≤ 3 MB**, `moov` at the front (faststart), no loop. Hungarian WebVTT captions if anyone speaks. | Child-started, muted by default, controls visible, respects reduced-motion, falls back to the cover. Loaded whole and played from memory like the audio (iOS and the host's range behaviour), and **not** part of any „Offline is elérhető” claim until it really is cached. Needs `ffmpeg` (not installed here) to produce from the prototype. |
| 7 | Alt texts (Hungarian) | Written when the art exists. | |

Precache effect: the two new `.webp` pairs (~1.7 MB) are picked up by the existing `assets/*.webp` pattern; the
recordings follow the existing warm-up and offline rules.

---

## 10. Owner checklist additions (the owner ticks these)

- [ ] World 5 decisions 1–8 answered
- [ ] Hungarian text of adventure 1 approved or corrected; content review finished (until then „unreviewed”)
- [ ] Character design approved against Nova
- [ ] Recordings listened to: wording, pronunciation of Csipp/Léna, pace, clipping
- [ ] `storyChoice`: instructions clear to Lacika; keyboard/touch and screen reader on real devices
- [ ] Recordings, covers and offline readiness checked on a real iPhone and Android
- [ ] Intro video (if kept): rights confirmed, audio content checked, plays on real iPhone and Android

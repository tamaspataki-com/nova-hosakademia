// Recorded narration (Hungarian), preferred over the device voice. A clip id is
//   <adventureId>:<passageId>:<sectionId>        the whole section      e.g. dino-muddy-footprints-01:story:p1
//   <adventureId>:<passageId>:<sectionId>:c<i>   an authored shorter part (chunk i)
// and must hold exactly the displayed text of that section or part – nothing else. Files live in public/audio/.
// The ?v= number is part of the cache key: raise it whenever a recording is replaced.
const V = 1;
const file = (name) => `audio/${name}.mp3?v=${V}`;
const DINO = 'dino-muddy-footprints-01:story';
const CRATES = 'dino-mixed-crates-02:story';

export const RECORDINGS = {
  [`${DINO}:p1`]: file('dino-p1'),
  [`${DINO}:p1:c0`]: file('dino-p1-c0'),
  [`${DINO}:p1:c1`]: file('dino-p1-c1'),
  [`${DINO}:p2`]: file('dino-p2'),
  [`${DINO}:p2:c0`]: file('dino-p2-c0'),
  [`${DINO}:p2:c1`]: file('dino-p2-c1'),
  [`${DINO}:p3`]: file('dino-p3'),
  [`${DINO}:p3:c0`]: file('dino-p3-c0'),
  [`${DINO}:p3:c1`]: file('dino-p3-c1'),
  // Adventure 2 (Az összecserélt ládák). Each file must hold exactly the displayed passage text or authored part.
  // p3:c1 contains two sentences (the message and the one after it), so it is never used for the quote-only support.
  [`${CRATES}:p1`]: file('dino2-p1'),
  [`${CRATES}:p1:c0`]: file('dino2-p1-c0'),
  [`${CRATES}:p1:c1`]: file('dino2-p1-c1'),
  [`${CRATES}:p2`]: file('dino2-p2'),
  [`${CRATES}:p2:c0`]: file('dino2-p2-c0'),
  [`${CRATES}:p2:c1`]: file('dino2-p2-c1'),
  [`${CRATES}:p3`]: file('dino2-p3'),
  [`${CRATES}:p3:c0`]: file('dino2-p3-c0'),
  [`${CRATES}:p3:c1`]: file('dino2-p3-c1')
};

// Recording keys prepared for adventure 3 (A Triceratops a kapunál). No files exist yet, so none is listed in
// RECORDINGS: until they are supplied the adventure uses the device's Hungarian voice, with the usual honest fallback.
// Only the displayed passage text belongs in a recording (never questions or extras).
const GATE = 'dino-gate-clues-03:story';
export const PREPARED_GATE_KEYS = ['p1', 'p2', 'p3'].flatMap((p) => [
  `${GATE}:${p}`,
  `${GATE}:${p}:c0`,
  `${GATE}:${p}:c1`
]);

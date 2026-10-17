// Recorded narration (Hungarian), preferred over the device voice. A clip id is
//   <adventureId>:<passageId>:<sectionId>        the whole section      e.g. dino-muddy-footprints-01:story:p1
//   <adventureId>:<passageId>:<sectionId>:c<i>   an authored shorter part (chunk i)
// and must hold exactly the displayed text of that section or part – nothing else. Files live in public/audio/.
// The ?v= number is part of the cache key: raise it whenever a recording is replaced.
const V = 1;
const file = (name) => `audio/${name}.mp3?v=${V}`;
const DINO = 'dino-muddy-footprints-01:story';

export const RECORDINGS = {
  [`${DINO}:p1`]: file('dino-p1'),
  [`${DINO}:p1:c0`]: file('dino-p1-c0'),
  [`${DINO}:p1:c1`]: file('dino-p1-c1'),
  [`${DINO}:p2`]: file('dino-p2'),
  [`${DINO}:p2:c0`]: file('dino-p2-c0'),
  [`${DINO}:p2:c1`]: file('dino-p2-c1'),
  [`${DINO}:p3`]: file('dino-p3'),
  [`${DINO}:p3:c0`]: file('dino-p3-c0'),
  [`${DINO}:p3:c1`]: file('dino-p3-c1')
};

// Recording keys prepared for adventure 2 (Az összecserélt ládák). No files exist yet, so none is listed in RECORDINGS:
// until they are supplied the adventure uses the device's Hungarian voice, with the usual honest fallback. When a file
// is added, map its key above. Only the displayed passage text belongs in a recording (never questions or extras).
// Adventure 1's recordings are not reused.
const CRATES = 'dino-mixed-crates-02:story';
export const PREPARED_KEYS = ['p1', 'p2', 'p3'].flatMap((p) => [
  `${CRATES}:${p}`,
  `${CRATES}:${p}:c0`,
  `${CRATES}:${p}:c1`
]);

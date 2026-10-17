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

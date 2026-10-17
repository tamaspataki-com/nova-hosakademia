// Recorded narration (Hungarian), preferred over the device voice. A clip id is
//   <adventureId>:<passageId>:<sectionId>        the whole section      e.g. dino-muddy-footprints-01:story:p1
//   <adventureId>:<passageId>:<sectionId>:c<i>   an authored shorter part (chunk i)
// and must hold exactly the displayed text of that section or part – nothing else. Files live in public/audio/.
// The ?v= number is part of the cache key: raise it whenever a recording is replaced.
const V = 1;
const file = (name) => `audio/${name}.mp3?v=${V}`;
const DINO = 'dino-muddy-footprints-01:story';
const CRATES = 'dino-mixed-crates-02:story';
const GATE = 'dino-gate-clues-03:story';
const OCTOPUS = 'animals-octopus-hideout-01:story';
const ROVER = 'space-rover-message-01:story';

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
  [`${CRATES}:p3:c1`]: file('dino2-p3-c1'),
  // Adventure 3 (A Triceratops a kapunál). Each file must hold exactly the displayed passage text or authored part.
  // The p3 recordings belong to the outcome: the interface only offers them after the prediction is submitted (see
  // `unlockAfter` in src/content/gate.js); keeping them cached on the device does not expose them.
  [`${GATE}:p1`]: file('dino3-p1'),
  [`${GATE}:p1:c0`]: file('dino3-p1-c0'),
  [`${GATE}:p1:c1`]: file('dino3-p1-c1'),
  [`${GATE}:p2`]: file('dino3-p2'),
  [`${GATE}:p2:c0`]: file('dino3-p2-c0'),
  [`${GATE}:p2:c1`]: file('dino3-p2-c1'),
  [`${GATE}:p3`]: file('dino3-p3'),
  [`${GATE}:p3:c0`]: file('dino3-p3-c0'),
  [`${GATE}:p3:c1`]: file('dino3-p3-c1'),
  // Adventure 4 (A polip búvóhelye). Each file must hold exactly the displayed passage text or authored part.
  [`${OCTOPUS}:p1`]: file('octopus1-p1'),
  [`${OCTOPUS}:p1:c0`]: file('octopus1-p1-c0'),
  [`${OCTOPUS}:p1:c1`]: file('octopus1-p1-c1'),
  [`${OCTOPUS}:p2`]: file('octopus1-p2'),
  [`${OCTOPUS}:p2:c0`]: file('octopus1-p2-c0'),
  [`${OCTOPUS}:p2:c1`]: file('octopus1-p2-c1'),
  [`${OCTOPUS}:p3`]: file('octopus1-p3'),
  [`${OCTOPUS}:p3:c0`]: file('octopus1-p3-c0'),
  [`${OCTOPUS}:p3:c1`]: file('octopus1-p3-c1'),
  // Adventure 5 (A marsjáró elveszett üzenete). Each file must hold exactly the displayed passage text or authored part.
  // The outcome panel has no recording and never uses one of these.
  [`${ROVER}:p1`]: file('rover1-p1'),
  [`${ROVER}:p1:c0`]: file('rover1-p1-c0'),
  [`${ROVER}:p1:c1`]: file('rover1-p1-c1'),
  [`${ROVER}:p2`]: file('rover1-p2'),
  [`${ROVER}:p2:c0`]: file('rover1-p2-c0'),
  [`${ROVER}:p2:c1`]: file('rover1-p2-c1'),
  [`${ROVER}:p3`]: file('rover1-p3'),
  [`${ROVER}:p3:c0`]: file('rover1-p3-c0'),
  [`${ROVER}:p3:c1`]: file('rover1-p3-c1')
};

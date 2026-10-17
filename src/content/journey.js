// The journey: the ordered full adventures. Only the next unfinished one opens; every other rule keeps what the child
// already has. This file is pure data and pure functions (no content imports), so the store can use it too.
//
// An adventure outside the journey (the optional Gyakorlás texts, parent-made texts) is never locked. Inside the
// journey an adventure opens when
//   · it is the next unfinished step, or
//   · it was completed before (completed adventures stay replayable), or
//   · it already has a saved unfinished run (existing runs stay resumable).
// Guided completion is a completion, so it unlocks the next step like any other.
// When more animal, space and heroes adventures arrive, extend this list to improve the rotation.
export const JOURNEY = [
  'heroes.energymag',
  'dino-muddy-footprints-01',
  'animals-octopus-hideout-01',
  'space-rover-message-01',
  'dino-mixed-crates-02',
  'dino-gate-clues-03'
];

export const inJourney = (id) => JOURNEY.includes(id);

const completions = (state, id) => state.history?.[id]?.completions || 0;

// The next unfinished journey adventure, or null when the whole journey has been completed.
export const journeyCurrent = (state) => JOURNEY.find((id) => completions(state, id) === 0) ?? null;

export function canOpen(state, id) {
  if (!inJourney(id)) return true;
  return completions(state, id) > 0 || !!state.progress?.[id] || id === journeyCurrent(state);
}

// What a locked adventure is waiting for: { before, current } – the adventure right before it in the journey, and the
// one that is open now.
export function waitingFor(state, id) {
  const i = JOURNEY.indexOf(id);
  return { before: i > 0 ? JOURNEY[i - 1] : null, current: journeyCurrent(state) };
}

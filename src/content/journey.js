// The journey: the ordered full adventures, opened one new adventure per calendar day.
// This file is pure data and pure functions (no content imports), so the store can use it too.
//
// An adventure outside the journey (the optional Gyakorlás texts, parent-made texts) is never locked. Inside the
// journey an adventure opens when
//   · it was completed before (completed adventures stay replayable), or
//   · it already has a saved unfinished run (existing runs stay resumable), or
//   · it is the next unfinished step AND its unlock day (if it has one) has come.
// Guided completion is a completion, so it unlocks the next step like any other.
//
// Daily pacing: completing a journey adventure for the first time schedules the next unfinished one for the next
// calendar day (local time, not 24 hours later). Replays never change anything. An adventure with no unlock day is
// open, so progress made before pacing existed is not held back. A parent can change the unlock day or open the next
// adventure now (Szülői tér). Days are 'YYYY-MM-DD' strings in the device's local time zone. The device clock decides,
// so this is a pacing feature, not a tamper-proof control.
// When more animal, space and heroes adventures arrive, extend this list to improve the rotation.
export const JOURNEY = [
  'heroes.energymag',
  'dino-muddy-footprints-01',
  'animals-octopus-hideout-01',
  'space-rover-message-01',
  'dino-mixed-crates-02',
  'dino-gate-clues-03',
  'courage-first-step-01' // the first adventure of Bátorság bolygója
];

export const inJourney = (id) => JOURNEY.includes(id);

// ---- local calendar days ----
const pad = (n) => String(n).padStart(2, '0');
export const dayOf = (ms = Date.now()) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
export const addDays = (day, n) => {
  const [y, m, d] = day.split('-').map(Number);
  return dayOf(new Date(y, m - 1, d + n).getTime()); // calendar arithmetic: safe across daylight-saving changes
};
export const isDay = (s) =>
  typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && dayOf(new Date(`${s}T12:00:00`).getTime()) === s;
const later = (a, b) => (!a ? b : !b ? a : a > b ? a : b);

const completions = (state, id) => state.history?.[id]?.completions || 0;
export const unlockDay = (state, id) => state.pacing?.unlocks?.[id] || null;

// The next unfinished journey adventure, or null when the whole journey has been completed.
export const journeyCurrent = (state) => JOURNEY.find((id) => completions(state, id) === 0) ?? null;

// The first unfinished journey adventure after `id` (what its completion makes next), or null.
export const journeyAfter = (state, id) => {
  const i = JOURNEY.indexOf(id);
  return JOURNEY.slice(i + 1).find((x) => completions(state, x) === 0) ?? null;
};

// -> { open, reason: null | 'order' | 'date', day } ; `today` is a local day string.
export function access(state, id, today = dayOf()) {
  if (!inJourney(id)) return { open: true, reason: null, day: null };
  if (completions(state, id) > 0 || state.progress?.[id]) return { open: true, reason: null, day: null };
  if (id !== journeyCurrent(state)) return { open: false, reason: 'order', day: null };
  const day = unlockDay(state, id);
  if (day && day > today) return { open: false, reason: 'date', day };
  return { open: true, reason: null, day };
}

export const canOpen = (state, id, today = dayOf()) => access(state, id, today).open;

// What a locked adventure is waiting for: the adventure right before it, the one that is next now, and its day.
export function waitingFor(state, id) {
  const i = JOURNEY.indexOf(id);
  const current = journeyCurrent(state);
  return { before: i > 0 ? JOURNEY[i - 1] : null, current, currentDay: current ? unlockDay(state, current) : null };
}

// The pacing records after a journey adventure was completed (`ms` = the completion time). Only the first completion
// counts; the next unfinished adventure is scheduled for the following calendar day (never earlier than a day a
// parent already chose for it).
export function paceAfterCompletion(state, id, ms) {
  const first = completions(state, id) === 0;
  const pacing = { completed: { ...(state.pacing?.completed || {}) }, unlocks: { ...(state.pacing?.unlocks || {}) } };
  if (!first || !inJourney(id)) return pacing;
  const day = dayOf(ms);
  pacing.completed[id] = day;
  const next = journeyAfter(state, id);
  if (next) pacing.unlocks[next] = later(pacing.unlocks[next], addDays(day, 1));
  return pacing;
}

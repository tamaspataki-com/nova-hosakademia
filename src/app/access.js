import { findAdventure } from '../content/index.js';
import { access, addDays, journeyCurrent, waitingFor } from '../content/journey.js';

const title = (id) => findAdventure(id, [])?.title || '';

const MONTHS = [
  'január',
  'február',
  'március',
  'április',
  'május',
  'június',
  'július',
  'augusztus',
  'szeptember',
  'október',
  'november',
  'december'
];
// 'YYYY-MM-DD' -> '2026. október 18.'
export function fmtDay(day) {
  const [y, m, d] = day.split('-').map(Number);
  return `${y}. ${MONTHS[m - 1]} ${d}.`;
}
// How a day is named next to today: 'ma', 'holnap' or the date.
export function whenText(day, today) {
  if (day <= today) return 'ma';
  if (day === addDays(today, 1)) return 'holnap';
  return fmtDay(day);
}

export const PACING_NOTE =
  'Új kalandot naponta egyet nyithatsz meg. A befejezett kalandokat és a gyakorló szövegeket bármikor újrajátszhatod.';

// The Hungarian explanation shown wherever a journey adventure is locked: what unlocks it, and when.
export function lockText(state, id, today) {
  const a = access(state, id, today);
  if (a.reason === 'date') {
    const w = whenText(a.day, today);
    return w === 'holnap' ? 'Holnap nyílik meg.' : `Ekkor nyílik meg: ${w}`; // a date already ends with a full stop
  }
  const { before, current, currentDay } = waitingFor(state, id);
  const w = currentDay && currentDay > today ? whenText(currentDay, today) : null;
  const when = w ? (w === 'holnap' ? ' (holnap nyílik meg)' : ` (ekkor nyílik meg: ${w})`) : '';
  if (before && before === current && !w) return `Akkor nyílik meg, ha befejezted ezt: „${title(before)}”.`;
  return `A kalandok sorrendben nyílnak meg, naponta egy. Előbb ez következik: „${title(current)}”${when}.`;
}

export { journeyCurrent };

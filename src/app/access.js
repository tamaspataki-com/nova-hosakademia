import { findAdventure } from '../content/index.js';
import { journeyCurrent, waitingFor } from '../content/journey.js';

const title = (id) => findAdventure(id, [])?.title || '';

// The Hungarian explanation shown wherever a journey adventure is locked: what unlocks it.
export function lockText(state, id) {
  const { before, current } = waitingFor(state, id);
  if (before && before === current) return `Akkor nyílik meg, ha befejezted ezt: „${title(before)}”.`;
  return `A kalandok sorrendben nyílnak meg. Előbb ezt fejezd be: „${title(current)}”.`;
}

export { journeyCurrent };

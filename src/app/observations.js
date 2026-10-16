// Parent observations are derived from the recorded events only. Nothing is estimated, and nothing is
// collapsed into an "attention" or "memory" score: results stay separated by activity type and mode.
export const ATYPE = {
  choice: 'Kérdés',
  sequence: 'Sorrend',
  evidence: 'Bizonyíték',
  vocabulary: 'Szómagyarázat',
  delayedRecall: 'Későbbi felidézés',
  retell: 'Elmesélés'
};
export const COMPLETION = {
  independent: 'Önállóan',
  supported: 'Támogatással',
  guided: 'Vezetett megoldással'
};
export const MODE_SHORT = { read: 'Olvasás', listen: 'Hallgatás', combined: 'Olvasás és hallgatás' };

export const completed = (events) => events.filter((e) => e.type === 'activity_completed');

export function groupByTypeAndMode(list) {
  const groups = new Map();
  for (const e of list) {
    const key = `${e.atype}|${e.mode}`;
    const g = groups.get(key) || {
      atype: e.atype,
      mode: e.mode,
      n: 0,
      firstCorrect: 0,
      independent: 0,
      supported: 0,
      guided: 0,
      scored: 0,
      repeat: 0
    };
    g.n++;
    if (e.atype !== 'retell') {
      g.scored++;
      if (e.firstCorrect) g.firstCorrect++;
    }
    if (e.completion in g) g[e.completion]++;
    if (e.repeat) g.repeat++;
    groups.set(key, g);
  }
  return [...groups.values()].sort(
    (a, b) => a.atype.localeCompare(b.atype) || String(a.mode).localeCompare(String(b.mode))
  );
}

export const count = (events, type) => events.filter((e) => e.type === type).length;

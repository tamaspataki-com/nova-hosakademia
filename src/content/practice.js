import { ACTS, PATHS, TASK_CHILD } from './authored.js';

// The prototype's 18 practice passages, converted to the shared adventure format. The texts, questions, answers and
// hints are the authored originals; nothing here is new educational content. No adult review is recorded for them
// (see `review` below). They have no artwork of their own, so they carry a neutral book icon.
const LETTERS = ['a', 'b', 'c', 'd'];
const OBJECTIVE = { understand: 'detail', recall: 'detail', seq: 'sequence', main: 'mainIdea', later: 'delayedRecall' };

function convert(actId, a) {
  const sentences = a.sentences.map((text, i) => ({ id: `s1.${i + 1}`, text }));
  const sid = (i) => (i == null ? undefined : sentences[i]?.id);
  const src = { passageId: 'text', sectionId: 's1' };
  const objectives = new Set();

  const choice = (type, t, id) => ({
    id,
    type: type === 'later' ? 'delayedRecall' : 'choice',
    title: TASK_CHILD[type],
    objective: OBJECTIVE[type],
    prompt: t.prompt,
    options: t.options.map((text, i) => ({ id: LETTERS[i], text })),
    correct: LETTERS[t.correct],
    source: src,
    hints: [t.hint],
    guided: t.ev != null ? { quote: { ...src, sentenceId: sid(t.ev) } } : undefined
  });

  const steps = [{ id: 'p1', type: 'passage', title: 'A szöveg', passageId: 'text', sectionId: 's1' }];
  a.tasks.forEach((t, i) => {
    objectives.add(OBJECTIVE[t.type]);
    if (t.type === 'seq') {
      const items = t.events.map((text, k) => ({ id: `i${k + 1}`, text }));
      steps.push({
        id: `t${i + 1}`,
        type: 'sequence',
        title: TASK_CHILD.seq,
        objective: 'sequence',
        prompt: t.prompt,
        labels: a.kind === 'instruction' ? ['1. lépés', '2. lépés', '3. lépés'] : ['Először', 'Azután', 'Végül'],
        items,
        correctOrder: items.map((x) => x.id),
        source: src,
        hints: [t.hint]
      });
    } else steps.push(choice(t.type, t, `t${i + 1}`));
  });
  if (a.later) {
    objectives.add('delayedRecall');
    steps.push(choice('later', a.later, 'later'));
  }

  const n = a.sentences.length;
  return {
    id: `heroes.practice.${actId}`,
    version: 1,
    worldId: 'heroes',
    seriesId: 'practice',
    title: a.title,
    description: `${PATHS[a.path].label} – ${n} mondat`,
    classification: 'fiction',
    sources: [],
    review: {
      status: 'unreviewed',
      note: 'Az előző változatból átvett tartalom; felnőtt általi felülvizsgálat nincs rögzítve.'
    },
    format: a.kind === 'instruction' ? 'instructions' : 'story',
    status: 'available',
    context: 'practice',
    level: a.level,
    transfer: !!a.transfer,
    coverIcon: 'menu_book', // neutral placeholder until artwork is supplied
    defaultMode: a.path === 'listen' ? 'listen' : 'read',
    modes: ['read', 'listen', 'combined'],
    objectives: [...objectives],
    passages: [{ id: 'text', title: a.title, sections: [{ id: 's1', label: 'A szöveg', sentences }] }],
    steps,
    discoveries: []
  };
}

// Level first, then the path order of the prototype, so the library reads from easy to longer texts.
const PATH_ORDER = ['read', 'seq', 'listen', 'main'];
export const PRACTICE = Object.entries(ACTS)
  .sort(([, x], [, y]) => x.level - y.level || PATH_ORDER.indexOf(x.path) - PATH_ORDER.indexOf(y.path))
  .map(([id, a]) => convert(id, a));

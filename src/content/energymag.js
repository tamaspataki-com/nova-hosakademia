import { MISSION } from './authored.js';

// "Az eltűnt energiamag" – the first adventure, migrated from the prototype's MISSION data.
// Story, questions, hints and feedback are the authored originals; this file only gives them stable ids and
// arranges them as steps for the shared activity components.
const M = MISSION;
const sentenceId = (s, i) => `s${s + 1}.${i + 1}`;

const sections = M.sections.map((sents, s) => ({
  id: `s${s + 1}`,
  label: `${s + 1}. rész`,
  sentences: sents.map((text, i) => ({ id: sentenceId(s, i), text }))
}));

const source = (sec) => ({ passageId: 'story', sectionId: `s${sec + 1}` });

export const ENERGYMAG = {
  id: 'heroes.energymag',
  version: 1,
  worldId: 'heroes',
  seriesId: 'academy',
  title: 'Az eltűnt energiamag',
  description: 'Derítsd ki, miért aludtak ki a fényhíd lámpái!',
  intro:
    'A lebegő város két része között kialudtak a fényhíd lámpái. Mira, az akadémia fiatal hőse, elindul kideríteni, mi történt. Segíts neki összegyűjteni és összekapcsolni a nyomokat!',
  classification: 'fiction',
  sources: [],
  review: {
    status: 'unreviewed',
    note: 'Az előző változatból átvett tartalom; felnőtt általi felülvizsgálat nincs rögzítve.'
  },
  format: 'story',
  status: 'available',
  context: 'practice',
  level: 1,
  modes: ['read', 'listen', 'combined'],
  objectives: ['detail', 'sequence', 'cause', 'retell'],
  coverAsset: 'assets/bridge.webp',
  coverAlt: 'A kialudt fényhíd és a kapu melletti üres energiaállvány',
  badge: 'goggles',
  completion: {
    title: 'Újra világít a fényhíd!',
    text: 'Összegyűjtötted a nyomokat, sorrendbe rendezted az eseményeket, és elmesélted a megoldást.'
  },
  glossary: M.glossary,
  passages: [{ id: 'story', title: 'Az eltűnt energiamag', sections }],
  steps: [
    { id: 'p1', type: 'passage', title: 'A történet – 1. rész', passageId: 'story', sectionId: 's1' },
    { id: 'p2', type: 'passage', title: 'A történet – 2. rész', passageId: 'story', sectionId: 's2' },
    { id: 'p3', type: 'passage', title: 'A történet – 3. rész', passageId: 'story', sectionId: 's3' },
    {
      id: 'q1',
      type: 'choice',
      title: 'A probléma',
      objective: 'cause',
      prompt: 'Miért aludtak ki a híd lámpái?',
      options: M.question.options.map((o) => ({ id: o.id, text: o.text })),
      correct: 'a',
      source: source(1),
      hints: [M.hints[3]],
      guided: {
        quote: { ...source(1), sentenceId: sentenceId(1, 0) },
        text: 'Hol volt akkor az energiamag?'
      },
      feedback: { correct: 'Jól összekapcsoltad a nyomokat. Az energiamag hiányzott a foglalatból.' }
    },
    {
      id: 'sq1',
      type: 'sequence',
      title: 'Sorrend',
      objective: 'sequence',
      prompt: 'Tedd sorrendbe az eseményeket!',
      labels: M.sequence.labels,
      items: Object.entries(M.sequence.events).map(([id, e]) => ({ id, text: e.text, src: e.src })),
      correctOrder: M.sequence.correct,
      source: { passageId: 'story', sectionId: 's1' },
      hints: [M.hints[4]],
      feedback: { correct: 'Pontos sorrend! Végigkövetted, hogyan oldódott meg a probléma.' }
    },
    {
      id: 'ev1',
      type: 'evidence',
      title: 'Bizonyíték',
      objective: 'detail',
      prompt: 'Melyik mondatból tudjuk, hogy a szerelő befejezte a munkát?',
      instruction: 'Koppints a mondatra, amely a bizonyítékot tartalmazza.',
      passageId: 'story',
      sectionId: 's2',
      correctSentenceId: sentenceId(1, 2),
      source: source(1),
      hints: [M.hints[5]],
      wrong: [M.evidence.wrong1, M.evidence.wrong2],
      feedback: { correct: 'Megtaláltad a mondatot, amely segít megérteni a történetet.' }
    },
    {
      id: 'rt1',
      type: 'retell',
      title: 'Elmesélés',
      objective: 'retell',
      prompt: 'Most te vagy a küldetés mesélője. Mondd el a saját szavaiddal, mi történt!',
      guideQuestions: ['Mi volt a probléma?', 'Mit derített ki Mira?', 'Hogyan oldódott meg a helyzet?'],
      starter: 'A probléma az volt, hogy…',
      hints: [M.hints[6]]
    }
  ],
  discoveries: []
};

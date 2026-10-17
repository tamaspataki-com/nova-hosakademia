import { WORLDS } from './worlds.js';
import { ENERGYMAG } from './energymag.js';
import { PRACTICE } from './practice.js';
import { DINO } from './dino.js';
import { CRATES } from './crates.js';
import { GATE } from './gate.js';
import { OCTOPUS } from './octopus.js';
import { SPACE } from './space.js';

// Built-in adventures, in the order they are suggested. Parent-created adventures are added at runtime.
const RAW = [ENERGYMAG, DINO, CRATES, GATE, OCTOPUS, SPACE, ...PRACTICE];

// Content rules for the model. A factual adventure must carry sources and an adult review before it can be shown;
// anything that breaks the rules is held back as "upcoming" and reported in the console.
export function validateAdventure(a) {
  const problems = [];
  if (!['fiction', 'factual', 'unspecified'].includes(a.classification)) problems.push('classification missing');
  if (!Array.isArray(a.sources)) problems.push('sources must be a list');
  if (!['unreviewed', 'adult-reviewed'].includes(a.review?.status)) problems.push('review status missing');
  if (a.classification === 'factual') {
    if (!a.sources?.length) problems.push('factual content needs source references');
    if (a.review?.status !== 'adult-reviewed') problems.push('factual content needs adult review');
  }
  return problems;
}

export const BUILTIN = RAW.map((a) => {
  const problems = validateAdventure(a);
  if (!problems.length) return a;
  console.error(`[NOVA content] ${a.id} held back: ${problems.join('; ')}`);
  return { ...a, status: 'upcoming' };
});

export const classLabel = (a) =>
  a.classification === 'fiction' ? 'Kitalált kaland' : a.classification === 'factual' ? 'Valós információ' : null;
export const REVIEW_LABEL = { 'adult-reviewed': 'Felnőtt ellenőrizte', unreviewed: 'Felülvizsgálat nincs rögzítve' };
export { BADGES } from './badges.js';

export { WORLDS };
export { TOOLS, ROUTINE, HELP_INTRO, HELP_EXPLAIN } from './tools.js';
export { UPCOMING_TEXT, FORMATS, MODE_NAMES, OBJECTIVE_NAMES } from './worlds.js';

export const LEVELS = [
  { id: 1, label: 'Rövid szövegek', hint: '2–3 mondat' },
  { id: 2, label: 'Közepes szövegek', hint: '4 mondat' },
  { id: 3, label: 'Hosszabb szövegek', hint: '5 mondat' }
];

export function allAdventures(custom = []) {
  return [...BUILTIN, ...custom];
}

export function findAdventure(id, custom = []) {
  return allAdventures(custom).find((a) => a.id === id) || null;
}

export const worldById = (id) => WORLDS.find((w) => w.id === id) || null;

export function sectionOf(adv, passageId, sectionId) {
  const p = adv.passages.find((x) => x.id === passageId);
  return p?.sections.find((s) => s.id === sectionId) || null;
}

export const sectionText = (sec) => sec.sentences.map((s) => s.text).join(' ');

export function availableIn(worldId, custom = []) {
  return allAdventures(custom).filter((a) => a.worldId === worldId && a.status === 'available');
}

// ---- parent-created adventures (Szülői tér → Saját szöveg) ----
const splitSentences = (t) => (t.match(/[^.!?…]+[.!?…]+["”»]?|[^.!?…]+$/g) || [t]).map((x) => x.trim()).filter(Boolean);

export function customAdventures(saved = []) {
  return saved.map((h) => {
    const sections = h.sections.map((text, i) => ({
      id: `s${i + 1}`,
      label: `${i + 1}. rész`,
      sentences: splitSentences(text).map((t, k) => ({ id: `s${i + 1}.${k + 1}`, text: t }))
    }));
    const options = h.options.map((o, i) => ({ id: 'abcdef'[i], text: o.text }));
    return {
      id: `custom.${h.id}`,
      version: 1,
      worldId: null,
      custom: true,
      title: h.title || 'Saját szöveg',
      description: 'Szülő által készített szöveg',
      classification: 'unspecified',
      origin: 'parent',
      sources: [],
      review: { status: 'unreviewed', note: 'Szülő készítette.' },
      format: 'story',
      status: 'available',
      context: 'practice',
      level: 1,
      modes: ['read', 'listen', 'combined'],
      objectives: ['detail'],
      passages: [{ id: 'text', title: h.title || 'Saját szöveg', sections }],
      steps: [
        ...sections.map((s) => ({
          id: `p-${s.id}`,
          type: 'passage',
          title: sections.length > 1 ? `A szöveg – ${s.label}` : 'A szöveg',
          passageId: 'text',
          sectionId: s.id
        })),
        {
          id: 'q1',
          type: 'choice',
          title: 'Kérdés',
          objective: 'detail',
          prompt: h.question,
          options,
          correct: 'abcdef'[h.options.findIndex((o) => o.correct)],
          hints: h.hint ? [h.hint] : []
        }
      ],
      discoveries: []
    };
  });
}

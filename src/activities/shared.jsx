import { sectionOf } from '../content/index.js';
import { Icon } from '../app/ui.jsx';
import { tone } from '../app/tone.js';
import { useRef } from 'react';
import { useAnnounceChange, useAnnounceOnMount } from './live.jsx';

// Sections a step refers to: its authored source, else (e.g. parent-made text) the whole first passage.
export function sourceSections(adv, step) {
  // `sources`: several authored sections (e.g. only the parts told so far); never the whole passage
  if (step.sources) return step.sources.map((s) => sectionOf(adv, s.passageId, s.sectionId)).filter(Boolean);
  if (step.source) {
    const sec = sectionOf(adv, step.source.passageId, step.source.sectionId);
    return sec ? [sec] : [];
  }
  return adv.passages[0]?.sections || [];
}

// The passage step that presents a step's source section (null when the step has no single source).
export const passageStepFor = (adv, src) =>
  src
    ? adv.steps.find((x) => x.type === 'passage' && x.passageId === src.passageId && x.sectionId === src.sectionId)
    : null;

// Glossary entries whose word occurs in the given sentences (offered as large buttons under the text).
export function wordsIn(glossary = [], sentences = []) {
  const words = sentences
    .flatMap((s) => s.text.split(/\s+/))
    .map((w) => w.replace(/^[„"(]+|[.,!?…:;"”)]+$/g, '').toLowerCase());
  return glossary.filter((g) => words.some((w) => w.startsWith(g.key)));
}

// Passage text with the glossary words tappable (opens the word explanation).
export function GlossText({ text, glossary = [], onWord }) {
  if (!glossary.length) return text;
  return text.split(/(\s+)/).map((tok, i) => {
    const bare = tok.replace(/^[„"(]+|[.,!?…:;"”)]+$/g, '').toLowerCase();
    const g = bare && glossary.find((x) => bare.startsWith(x.key));
    if (!g) return tok;
    return (
      <button key={i} type="button" className="gloss" tabIndex={-1} aria-hidden="true" onClick={() => onWord(g)}>
        {tok}
      </button>
    );
  });
}

// A passage section as sentences, optionally with one sentence highlighted.
export function SectionText({ sec, mark, glossary, onWord }) {
  return (
    <p className="read-text">
      {sec.sentences.map((s) => (
        <span key={s.id} className={s.id === mark ? 'mark' : ''}>
          <GlossText text={s.text} glossary={glossary} onWord={onWord} />{' '}
        </span>
      ))}
    </p>
  );
}

export function Reference({ adv, step, mark, glossary, onWord, only, allow }) {
  // `only`: show a single sentence of the source (e.g. just the quoted instruction).
  const secs = sourceSections(adv, step)
    .filter((sec) => !allow || allow(sec))
    .map((sec) =>
      only
        ? {
            ...sec,
            // just the quoted words when the sentence has a quotation („…”), else the whole sentence
            sentences: sec.sentences
              .filter((x) => x.id === only)
              .map((x) => ({ ...x, text: x.text.match(/„[^”]*”/)?.[0] ?? x.text }))
          }
        : sec
    );
  const words = wordsIn(
    glossary,
    secs.flatMap((sec) => sec.sentences)
  );
  return (
    <div className="stack">
      {secs.map((sec) => (
        <article key={sec.id} className="reading">
          {secs.length > 1 ? <div className="reading-label">{sec.label}</div> : null}
          <SectionText sec={sec} mark={mark} glossary={glossary} onWord={onWord} />
        </article>
      ))}
      {words.length ? (
        <div className="stack tight" aria-label="Szómagyarázat">
          <span className="eyebrow">Szavak, ha kíváncsi vagy rájuk</span>
          <div className="chips">
            {words.map((g) => (
              <button key={g.key} type="button" className="pill" onClick={() => onWord(g)}>
                {g.word}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Glossary words that occur in a step's own wording (task activities have no passage text to tap).
export function StepWords({ api }) {
  const { adv, step, openWord } = api;
  const whole = JSON.stringify({ ...step, guided: null, hints: null, feedback: null, after: null }).toLowerCase();
  const words = (adv.glossary || []).filter((g) => whole.includes(g.key));
  if (!words.length) return null;
  return (
    <div className="stack tight" aria-label="Szómagyarázat">
      <span className="eyebrow">Szavak, ha kíváncsi vagy rájuk</span>
      <div className="chips">
        {words.map((g) => (
          <button key={g.key} type="button" className="pill" onClick={() => openWord(g)}>
            {g.word}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Hints({ shown }) {
  useAnnounceChange(shown?.length ? shown[shown.length - 1] : ''); // the newest hint, once
  if (!shown?.length) return null;
  return (
    <div className="stack tight">
      {shown.map((h, i) => (
        <div key={i} className="note hint">
          <Icon name="lightbulb" />
          <span>{h}</span>
        </div>
      ))}
    </div>
  );
}

// Guided explanation after repeated misses: the authored quote from the story, highlighted, plus an authored
// leading question when there is one.
export function Guided({ adv, step }) {
  const ref = useRef(null);
  useAnnounceOnMount(ref);
  const g = step.guided;
  if (!g) return null;
  const sec = g.quote ? sectionOf(adv, g.quote.passageId, g.quote.sectionId) : null;
  const sent = sec?.sentences.find((s) => s.id === g.quote.sentenceId);
  return (
    <div className="note guided" ref={ref}>
      <Icon name="menu_book" />
      <div className="stack tight">
        {sent ? <span>Nézd meg ezt a mondatot: „{sent.text}”</span> : null}
        {g.text ? <strong>{g.text}</strong> : null}
      </div>
    </div>
  );
}

export const sentenceCount = (adv, step) => sourceSections(adv, step).reduce((n, s) => n + s.sentences.length, 0);

// Supports that make a completion "supported": hints, rereads, replays, a shown transcript and a shorter section.
// What the child did while the passage was presented counts too, so help on the passage affects the question after it.
export function supportOf(adv, run, step, st) {
  const src = passageStepFor(adv, step.source);
  const passageSteps = src ? [src] : adv.steps.filter((x) => x.type === 'passage');
  const ps = passageSteps.map((x) => run.steps[x.id] || {});
  const sum = (k) => ps.reduce((n, p) => n + (p[k] || 0), 0);
  const out = {
    hints: st.shown?.length || 0,
    rereads: st.rereads || 0,
    replays: (st.replays || 0) + sum('replays'),
    transcript: !!(st.transcript || ps.some((p) => p.transcript)),
    shorter: ps.some((p) => p.chunked),
    retellPrompts: !!st.promptsOpened,
    quote: !!st.quoteShown // only the quoted instruction was shown again
  };
  out.used =
    out.hints > 0 ||
    out.rereads > 0 ||
    out.replays > 0 ||
    out.transcript ||
    out.shorter ||
    out.retellPrompts ||
    out.quote;
  return out;
}

const INTERVENING = [
  'passage_reread',
  'audio_replayed',
  'retell_prompts_opened',
  'transcript_opened',
  'shorter_section_used'
];

// Shared rules for scored activities (choice, evidence, sequence, recall):
//   · every submission is logged, and the first answer is recorded before any feedback;
//   · a wrong submission shows its authored hint;
//   · from the second miss a guided explanation and an option to see the solution appear;
//   · completion is recorded once, as independent / supported / guided.
export function useScored(api) {
  const { adv, step, st, patch, log, run } = api;
  const attempts = st.attempts || 0;

  const complete = (extra) => {
    if (st.logged) return;
    patch({ logged: true });
    const sup = supportOf(adv, run, step, st);
    const evs = api.events || [];
    const lastDone = [...evs].reverse().find((e) => e.type === 'activity_completed');
    const since = lastDone ? lastDone.t : run.startedAt;
    const guided = extra.guided || !!st.guidedPlacement;
    const detail = {
      activity: step.id,
      atype: step.type,
      objective: step.objective,
      mode: run.mode,
      length: sentenceCount(adv, step),
      repeat: !!run.repeat,
      hints: Math.max(sup.hints, extra.shown.length),
      rereads: sup.rereads,
      replays: sup.replays,
      transcript: sup.transcript,
      shorter: sup.shorter,
      definitions: evs.filter((e) => e.type === 'word_opened' && e.t >= since).length,
      guidedPlacement: !!st.guidedPlacement,
      quoteShown: sup.quote,
      // a check against the child's own earlier prediction records that prediction next to the outcome answer
      ...(step.recallFrom
        ? { priorPrediction: run.steps[step.recallFrom.step]?.[step.recallFrom.field] ?? null }
        : null),
      ...(typeof step.record === 'function' ? step.record(run) : step.record), // e.g. a checking task with a visible reference is recorded as such
      attempts: extra.attempts,
      firstCorrect: extra.first,
      completion: guided ? 'guided' : extra.first && !sup.used ? 'independent' : 'supported'
    };
    if (step.type === 'delayedRecall') {
      // Supports used since the story was presented, other than on this question itself.
      detail.intervening = Object.fromEntries(
        INTERVENING.map((t) => [t, evs.filter((e) => e.type === t && e.activity !== step.id).length])
      );
    }
    log('activity_completed', detail);
  };

  // ok: the submission was right. detail: extra fields for the event (choice, order…).
  const submit = (ok, detail = {}, kind = 'answer_submitted') => {
    const n = attempts + 1;
    const shown = st.shown || [];
    const text = ok ? null : (step.wrong?.[n - 1] ?? step.hints?.[n - 1] ?? null);
    const nextShown = text && !shown.includes(text) ? [...shown, text] : shown;
    patch({ attempts: n, shown: nextShown, solved: ok || !!st.solved, fallback: !ok && !text });
    log(kind, { activity: step.id, atype: step.type, attempt: n, ok, first: n === 1, ...detail });
    if (ok) {
      tone(api.settings.sound, 'ok');
      complete({ first: n === 1, guided: false, attempts: n, shown: nextShown });
    }
    return n;
  };

  const reveal = () => {
    patch({ solved: true, guided: true });
    log('solution_shown', { activity: step.id, atype: step.type, attempt: attempts });
    complete({ first: false, guided: true, attempts, shown: st.shown || [] });
  };

  return {
    attempts,
    solved: !!st.solved,
    guided: !!st.guided,
    submit,
    reveal,
    // wrong submissions so far (the final correct one is not a miss)
    misses: st.solved && !st.guided ? attempts - 1 : attempts
  };
}

export function Feedback({ ok, children }) {
  const ref = useRef(null);
  useAnnounceOnMount(ref);
  return (
    <div className={`note ${ok ? 'good' : 'soft'}`} ref={ref}>
      <Icon name={ok ? 'check_circle' : 'info'} />
      <span>{children}</span>
    </div>
  );
}

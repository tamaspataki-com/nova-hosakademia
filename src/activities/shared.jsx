import { sectionOf } from '../content/index.js';
import { Icon } from '../app/ui.jsx';
import { tone } from '../app/tone.js';

// Sections a step refers to: its authored source, else (e.g. parent-made text) the whole first passage.
export function sourceSections(adv, step) {
  if (step.source) {
    const sec = sectionOf(adv, step.source.passageId, step.source.sectionId);
    return sec ? [sec] : [];
  }
  return adv.passages[0]?.sections || [];
}

// Passage text with the glossary words tappable (opens the word explanation).
export function GlossText({ text, glossary = [], onWord }) {
  if (!glossary.length) return text;
  return text.split(/(\s+)/).map((tok, i) => {
    const bare = tok.replace(/^[„"(]+|[.,!?…:;"”)]+$/g, '').toLowerCase();
    const g = bare && glossary.find((x) => bare.startsWith(x.key));
    if (!g) return tok;
    return (
      <button key={i} type="button" className="gloss" onClick={() => onWord(g)}>
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

export function Reference({ adv, step, mark, glossary, onWord }) {
  const secs = sourceSections(adv, step);
  return (
    <div className="stack">
      {secs.map((sec) => (
        <article key={sec.id} className="reading">
          {secs.length > 1 ? <div className="reading-label">{sec.label}</div> : null}
          <SectionText sec={sec} mark={mark} glossary={glossary} onWord={onWord} />
        </article>
      ))}
    </div>
  );
}

export function Hints({ shown }) {
  if (!shown?.length) return null;
  return (
    <div className="stack tight" aria-live="polite">
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
  const g = step.guided;
  if (!g) return null;
  const sec = g.quote ? sectionOf(adv, g.quote.passageId, g.quote.sectionId) : null;
  const sent = sec?.sentences.find((s) => s.id === g.quote.sentenceId);
  return (
    <div className="note guided" aria-live="polite">
      <Icon name="menu_book" />
      <div className="stack tight">
        {sent ? <span>Nézd meg ezt a mondatot: „{sent.text}”</span> : null}
        {g.text ? <strong>{g.text}</strong> : null}
      </div>
    </div>
  );
}

export const supportUsed = (st) =>
  (st.shown?.length || 0) > 0 || (st.rereads || 0) > 0 || (st.replays || 0) > 0 || !!st.transcript;

export const sentenceCount = (adv, step) => sourceSections(adv, step).reduce((n, s) => n + s.sentences.length, 0);

// Shared rules for scored activities (choice, evidence, sequence, recall):
//   · every submission is logged;  · a wrong submission shows its authored hint;
//   · from the second miss a guided explanation and an option to see the solution appear;
//   · completion is recorded once, as independent / supported / guided.
export function useScored(api) {
  const { adv, step, st, patch, log, run } = api;
  const attempts = st.attempts || 0;

  const complete = (extra) => {
    if (st.logged) return;
    patch({ logged: true });
    log('activity_completed', {
      activity: step.id,
      atype: step.type,
      objective: step.objective,
      mode: run.mode,
      length: sentenceCount(adv, step),
      repeat: !!run.repeat,
      hints: extra.shown.length,
      rereads: st.rereads || 0,
      replays: st.replays || 0,
      transcript: !!st.transcript,
      attempts: extra.attempts,
      firstCorrect: extra.first,
      completion: extra.guided
        ? 'guided'
        : extra.first && !extra.shown.length && !supportUsed(st)
          ? 'independent'
          : 'supported'
    });
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
  return (
    <div className={`note ${ok ? 'good' : 'soft'}`} role="status">
      <Icon name={ok ? 'check_circle' : 'info'} />
      <span>{children}</span>
    </div>
  );
}

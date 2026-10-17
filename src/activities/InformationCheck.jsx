import { useEffect, useRef } from 'react';
import { Btn, Icon } from '../app/ui.jsx';
import { tone } from '../app/tone.js';
import { Feedback, Hints, sentenceCount, supportOf } from './shared.jsx';
import { useAnnounceOnMount } from './live.jsx';

// "What does the story tell us?" – authored statements, shown one at a time, each answered with one of three
// categories: true (the story says so), false (the story says the opposite) or not stated (the story does not tell).
// "Nem derül ki" means the information is absent; it is never treated as a form of "false".
//
// The category explanations stay on screen for every statement. The story can be opened at any time ("Történet
// megnyitása"); opening it, a hint, a replay or a shown solution make that statement "supported", never wrong.
// Each statement is recorded separately: its answers (one event per submission) and its own completion.
// A selection can be changed until it is submitted. Two misses on one statement offer the solution.
export default function InformationCheck({ api }) {
  const { adv, step, st, run, patch, log, next, openStory, settings } = api;
  const items = st.items || {};
  const index = Math.min(st.index || 0, step.statements.length - 1);
  const stmt = step.statements[index];
  const it = items[stmt.id] || {};
  const last = index === step.statements.length - 1;
  const done = !!it.solved;
  const wrong = it.wrongIds || [];
  const misses = done && !it.guided ? (it.attempts || 1) - 1 : it.attempts || 0;
  const showGuided = (!done && misses >= 2) || it.guided;

  const setItem = (p) =>
    patch((cur) => ({
      ...cur,
      items: { ...(cur.items || {}), [stmt.id]: { ...(cur.items?.[stmt.id] || {}), ...p } }
    }));

  const headRef = useRef(null);
  const nextRef = useRef(null);
  const mounted = useRef(false);
  useEffect(() => {
    // A new statement: focus its heading (the step player has already handled the first one).
    if (mounted.current) headRef.current?.focus({ preventScroll: true });
    mounted.current = true;
  }, [index]);
  const seenAttempts = useRef(it.attempts || 0);
  useEffect(() => {
    // After a wrong submission the pressed button is disabled: focus goes to the first answer still available.
    const n = it.attempts || 0;
    if (n > seenAttempts.current && !done) {
      const a = document.activeElement;
      if (!a || a === document.body || a.disabled) document.querySelector('.runner .option:not(:disabled)')?.focus();
    }
    seenAttempts.current = n;
  }, [it.attempts, done]);
  useEffect(() => {
    if (done && !last) nextRef.current?.focus();
  }, [done, last]);

  const finishStatement = (extra) => {
    const sup = supportOf(adv, run, step, st);
    const supported = extra.hints > 0 || !!it.opened || !!it.replayed || extra.guided;
    log('activity_completed', {
      activity: step.id,
      statement: stmt.id,
      atype: step.type,
      objective: step.objective,
      mode: run.mode,
      length: sentenceCount(adv, step),
      repeat: !!run.repeat,
      correctAnswer: stmt.correct,
      hints: Math.max(it.shown?.length || 0, extra.hints),
      storyOpened: !!it.opened,
      replays: it.replayed ? 1 : 0,
      transcript: sup.transcript,
      attempts: extra.attempts,
      firstCorrect: extra.first,
      completion: extra.guided ? 'guided' : extra.first && !supported ? 'independent' : 'supported'
    });
  };

  const choose = (id) => {
    if (!done) setItem({ selected: id });
  };

  const check = () => {
    const sel = it.selected;
    if (!sel || done) return;
    const ok = sel === stmt.correct;
    const n = (it.attempts || 0) + 1;
    const shown = it.shown || [];
    const hint = ok ? null : stmt.hint;
    const nextShown = hint && !shown.includes(hint) ? [...shown, hint] : shown;
    setItem({
      attempts: n,
      shown: nextShown,
      solved: ok,
      wrongIds: ok ? wrong : [...wrong, sel],
      selected: ok ? sel : null
    });
    patch((cur) => ({ ...cur, attempts: (cur.attempts || 0) + 1 }));
    log('answer_submitted', {
      activity: step.id,
      statement: stmt.id,
      atype: step.type,
      attempt: n,
      ok,
      first: n === 1,
      choice: sel
    });
    if (ok) {
      tone(settings.sound, 'ok');
      finishStatement({ first: n === 1, guided: false, attempts: n, hints: nextShown.length });
      if (last) patch({ solved: true });
    }
  };

  const reveal = () => {
    setItem({ solved: true, guided: true, selected: stmt.correct });
    log('solution_shown', { activity: step.id, statement: stmt.id, atype: step.type, attempt: it.attempts || 0 });
    finishStatement({ first: false, guided: true, attempts: it.attempts || 0, hints: it.shown?.length || 0 });
    if (last) patch({ solved: true });
  };

  const advance = () => patch({ index: index + 1 });

  return (
    <div className="stack">
      <section className="card stack tight" aria-label="Válaszkategóriák">
        <strong>{step.intro}</strong>
        <ul className="cat-list">
          {step.categories.map((c) => (
            <li key={c.id}>
              <strong>{c.label}:</strong> {c.text}
            </li>
          ))}
        </ul>
      </section>

      <div>
        <Btn kind="ghost" icon="menu_book" onClick={openStory}>
          Történet megnyitása
        </Btn>
      </div>

      <p className="eyebrow">
        {index + 1}/{step.statements.length}. állítás
      </p>
      <h2 className="h2" tabIndex={-1} ref={headRef}>
        {stmt.text}
      </h2>

      <div className="stack tight" role="group" aria-label="Válaszlehetőségek">
        {step.categories.map((c) => {
          const isWrong = wrong.includes(c.id);
          const right = done && c.id === stmt.correct;
          const on = it.selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              className={`option ${on ? 'on' : ''} ${isWrong ? 'wrong' : ''} ${right ? 'right' : ''}`}
              aria-pressed={on}
              disabled={done || isWrong}
              onClick={() => choose(c.id)}
            >
              <span className="option-text">{c.label}</span>
              {right ? <Icon name="check_circle" fill /> : null}
              {isWrong ? <span className="option-tag">Nem ez</span> : null}
            </button>
          );
        })}
      </div>

      <Hints shown={it.shown} />
      {showGuided ? <GuidedStatement text={stmt.guided} /> : null}

      {done ? (
        <>
          <Feedback ok>{it.guided ? 'Ez a helyes válasz.' : stmt.feedback}</Feedback>
          {last ? (
            <Btn iconAfter="arrow_forward" onClick={next}>
              Tovább
            </Btn>
          ) : (
            <button type="button" className="btn btn-primary" ref={nextRef} onClick={advance}>
              Következő állítás <Icon name="arrow_forward" />
            </button>
          )}
        </>
      ) : (
        <div className="row">
          <Btn disabled={!it.selected} onClick={check}>
            Ezt választom
          </Btn>
          {misses >= 2 ? (
            <Btn kind="ghost" icon="visibility" onClick={reveal}>
              Megmutatom a megoldást
            </Btn>
          ) : null}
        </div>
      )}
    </div>
  );
}

function GuidedStatement({ text }) {
  const ref = useRef(null);
  useAnnounceOnMount(ref);
  return (
    <div className="note guided" ref={ref}>
      <Icon name="menu_book" />
      <strong>{text}</strong>
    </div>
  );
}

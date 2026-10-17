import { useEffect, useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { Feedback, Guided, Hints, Reference, useScored } from './shared.jsx';
import { ReflectionCard } from './Reflection.jsx';

// Restore a message by filling its blank from a reference text (reference-based retrieval, not a memory test).
// Selecting a word card puts it into the blank; the choice can be changed until it is submitted. A wrong submission
// keeps the card marked "Nem ez" and shows the authored hint; from the second miss a guided explanation and the
// solution are offered.
// The reference stays visible while reading or reading and listening. In listening-only mode it stays hidden until
// the child asks for the transcript (here or in the help panel); that use is recorded as support.
export default function FillBlank({ api }) {
  const { adv, step, st, run, patch, log, next, openWord } = api;
  const rules = useScored(api);
  const [order] = useState(() => st.order || shuffle(step.options.map((o) => o.id)));
  useEffect(() => {
    if (!st.order) patch({ order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const byId = Object.fromEntries(step.options.map((o) => [o.id, o]));
  const wrongIds = st.wrongIds || [];
  const selected = st.selected;
  const done = rules.solved;
  const listenOnly = run.mode === 'listen';
  const showRef = !listenOnly || !!st.transcript;

  const check = () => {
    if (!selected) return;
    const ok = selected === step.correct;
    if (!ok) patch({ wrongIds: [...wrongIds, selected], selected: null });
    rules.submit(ok, { choice: selected });
  };
  const showTranscript = () => {
    patch({ transcript: true });
    log('passage_reread', { activity: step.id, transcript: true });
  };

  const filled = done ? step.correct : selected;
  const showGuided = !done && rules.misses >= 2;
  const lastHint = !done && st.fallback && rules.misses > 0 && !showGuided;

  return (
    <div className="stack">
      {showRef ? (
        <section className="card stack tight" aria-label={step.referenceLabel}>
          <span className="eyebrow">{step.referenceLabel}</span>
          <Reference adv={adv} step={step} glossary={adv.glossary} onWord={openWord} />
        </section>
      ) : (
        <div>
          <Btn kind="ghost" icon="subtitles" onClick={showTranscript}>
            Megmutatom a szöveget
          </Btn>
        </div>
      )}

      <section className="card stack tight" aria-label="A hiányos üzenet">
        <span className="eyebrow">{step.messageLabel}</span>
        <p className="read-text" aria-live="polite">
          {step.before}{' '}
          <span className={`blank ${filled ? 'filled' : ''}`}>
            {filled ? byId[filled].text : <span aria-label="üres hely">________</span>}
          </span>
          {step.after}
        </p>
      </section>

      <h2 className="h2">{step.prompt}</h2>

      <div className="stack tight" role="group" aria-label="Szókártyák">
        {order.map((id) => {
          const o = byId[id];
          const wrong = wrongIds.includes(id);
          const right = done && id === step.correct;
          const on = selected === id;
          return (
            <button
              key={id}
              type="button"
              className={`option ${on ? 'on' : ''} ${wrong ? 'wrong' : ''} ${right ? 'right' : ''}`}
              aria-pressed={on}
              disabled={done || wrong}
              onClick={() => patch({ selected: id })}
            >
              <span className="option-text">{o.text}</span>
              {right ? <Icon name="check_circle" fill /> : null}
              {wrong ? <span className="option-tag">Nem ez</span> : null}
            </button>
          );
        })}
      </div>

      <Hints shown={st.shown} />
      {lastHint ? <Feedback>Nézd meg újra a szöveget, és próbáld újra.</Feedback> : null}
      {showGuided || rules.guided ? <Guided adv={adv} step={step} /> : null}

      {done ? (
        <>
          <Feedback ok>{rules.guided ? 'Ez a helyes válasz.' : step.feedback.correct}</Feedback>
          {rules.guided ? <ReflectionCard api={api} /> : null}
          <Btn iconAfter="arrow_forward" onClick={next}>
            Tovább
          </Btn>
        </>
      ) : (
        <div className="row">
          <Btn disabled={!selected} onClick={check}>
            {step.submitLabel}
          </Btn>
          {showGuided ? (
            <Btn kind="ghost" icon="visibility" onClick={rules.reveal}>
              Megmutatom a megoldást
            </Btn>
          ) : null}
        </div>
      )}
    </div>
  );
}

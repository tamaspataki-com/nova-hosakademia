import { useEffect, useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { Feedback, Guided, Hints, StepWords, useScored } from './shared.jsx';
import { ReflectionCard } from './Reflection.jsx';

// Multiple choice (also used for delayed recall and vocabulary questions).
// Selecting only highlights; the answer is submitted with "Ellenőrzöm". Options are shuffled once per attempt
// and keep their stable ids.
export default function Choice({ api, variant = 'choice' }) {
  const { adv, step, st, run, patch, next } = api;
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

  const check = () => {
    if (!selected) return;
    const ok = selected === step.correct;
    if (!ok) patch({ wrongIds: [...wrongIds, selected], selected: null });
    rules.submit(ok, { choice: selected });
  };

  // A check against the child's own earlier prediction (saved in another step): shown above the question.
  const prior = step.recallFrom ? run.steps[step.recallFrom.step]?.[step.recallFrom.field] : null;
  const priorText = prior
    ? adv.steps.find((x) => x.id === step.recallFrom.step)?.options.find((o) => o.id === prior)?.text
    : null;
  const correctText = (step.feedback?.correctBy && step.feedback.correctBy[prior]) ?? step.feedback?.correct;

  const showGuided = !done && rules.misses >= 2;
  const lastHint = !done && st.fallback && rules.misses > 0 && !showGuided;

  return (
    <div className="stack">
      {priorText ? (
        <section className="card stack tight" aria-label={step.recallFrom.label}>
          <span className="eyebrow">{step.recallFrom.label}</span>
          <p className="read-text">{priorText}</p>
        </section>
      ) : null}
      {step.cards ? (
        <section className="stack tight" aria-label={step.cardsLabel || 'Leírások'}>
          <ul className="ref-cards">
            {step.cards.map((c) => (
              <li key={c.id} className="card stack tight">
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <h2 className="h2">{step.prompt}</h2>
      {step.description ? <p className="lead">{step.description}</p> : null}

      <div className="stack tight" role="group" aria-label="Válaszlehetőségek">
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

      {adv.stepWords ? <StepWords api={api} /> : null}
      <Hints shown={st.shown} />
      {lastHint ? <Feedback>Nézd meg újra a szöveget, és próbáld újra.</Feedback> : null}
      {showGuided || rules.guided ? <Guided adv={adv} step={step} /> : null}

      {done ? (
        <>
          <Feedback ok>{rules.guided ? 'Ez a helyes válasz.' : (correctText ?? 'Jól válaszoltál.')}</Feedback>
          {rules.guided ? <ReflectionCard api={api} /> : null}
          <Btn iconAfter="arrow_forward" onClick={next}>
            Tovább
          </Btn>
        </>
      ) : (
        <div className="row">
          <Btn disabled={!selected} onClick={check}>
            {step.submitLabel || 'Ellenőrzöm'}
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

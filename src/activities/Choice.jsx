import { useEffect, useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { Feedback, Guided, Hints, useScored } from './shared.jsx';
import { ReflectionCard } from './Reflection.jsx';

// Multiple choice (also used for delayed recall and vocabulary questions).
// Selecting only highlights; the answer is submitted with "Ellenőrzöm". Options are shuffled once per attempt
// and keep their stable ids.
export default function Choice({ api, variant = 'choice' }) {
  const { adv, step, st, patch, next } = api;
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

  const showGuided = !done && rules.misses >= 2;
  const lastHint = !done && st.fallback && rules.misses > 0 && !showGuided;

  return (
    <div className="stack">
      <h2 className="h2">{step.prompt}</h2>

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

      <Hints shown={st.shown} />
      {lastHint ? <Feedback>Nézd meg újra a szöveget, és próbáld újra.</Feedback> : null}
      {showGuided || rules.guided ? <Guided adv={adv} step={step} /> : null}

      {done ? (
        <>
          <Feedback ok>
            {rules.guided ? 'Ez a helyes válasz.' : (step.feedback?.correct ?? 'Jól válaszoltál.')}
          </Feedback>
          {rules.guided ? <ReflectionCard api={api} /> : null}
          <Btn iconAfter="arrow_forward" onClick={next}>
            Tovább
          </Btn>
        </>
      ) : (
        <div className="row">
          <Btn disabled={!selected} onClick={check}>
            Ellenőrzöm
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

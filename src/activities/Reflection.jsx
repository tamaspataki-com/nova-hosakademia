import { useState } from 'react';
import { TOOLS } from '../content/index.js';
import { Btn, Icon } from '../app/ui.jsx';

// "Which strategy helped?" – offered after a guided solution and usable as a step of its own.
// Nothing is scored: the choice is only recorded for the parent.
export function ReflectionCard({ api, prompt = 'Mi segíthetne legközelebb?' }) {
  const { st, patch, log, step } = api;
  const [pick, setPick] = useState(st.reflection || null);
  const done = !!st.reflection;
  const save = () => {
    patch({ reflection: pick });
    log('reflection_saved', { activity: step.id, tool: pick });
  };
  return (
    <section className="card stack" aria-label="Gondolkodj el">
      <h3 className="h3">{prompt}</h3>
      <div className="chips">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`pill ${pick === t.id ? 'on' : ''}`}
            aria-pressed={pick === t.id}
            disabled={done}
            onClick={() => setPick(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>
      {done ? (
        <span className="muted">
          <Icon name="check_circle" /> Elmentve.
        </span>
      ) : (
        <Btn kind="ghost" disabled={!pick} onClick={save}>
          Elmentem
        </Btn>
      )}
    </section>
  );
}

// Reflection as its own step: choose a strategy, then continue.
export default function Reflection({ api }) {
  const { step, st, next } = api;
  return (
    <div className="stack">
      <h2 className="h2">{step.prompt || 'Melyik módszer segített?'}</h2>
      <ReflectionCard api={api} prompt="Válassz egy eszközt" />
      <Btn iconAfter="arrow_forward" disabled={!st.reflection} onClick={next}>
        Tovább
      </Btn>
    </div>
  );
}

import { useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { useAnnounce } from './live.jsx';

// Light the stars of the bridge in the order of the story. Every star is a large button; a star out of turn does not light
// and says so gently. No timer, no points, no hints ladder: unscored, recorded as `constellation_done` (ids only) and never
// as `activity_completed`. Content: step.stars [{ id, text }] in the authored (story) order, step.prompt, optional step.after.
export default function Constellation({ api }) {
  const { step, st, patch, log, next } = api;
  const announce = useAnnounce();
  const [order] = useState(() => st.order || shuffle(step.stars.map((s) => s.id)));
  const lit = st.lit || [];
  const [msg, setMsg] = useState('');
  const byId = Object.fromEntries(step.stars.map((s) => [s.id, s]));
  const done = lit.length === step.stars.length;

  const tap = (id) => {
    if (done || lit.includes(id)) return;
    if (id === step.stars[lit.length].id) {
      const now = [...lit, id];
      patch({ lit: now, order, ...(now.length === step.stars.length ? { done: true } : null) });
      setMsg('');
      if (now.length === step.stars.length) {
        log('constellation_done', { activity: step.id });
        announce(step.doneText || 'Mind a csillag felgyúlt.');
      } else {
        announce('Ez a csillag felgyúlt.');
      }
    } else {
      patch({ order, misses: (st.misses || 0) + 1 });
      setMsg('Ez a csillag még nem következik. Gondold végig a történetet, és próbáld újra!');
      announce('Ez a csillag még nem következik. Gondold végig a történetet, és próbáld újra!');
    }
  };

  return (
    <div className="stack">
      <h2 className="h2">{step.prompt}</h2>
      <p className="lead">{step.lead || 'Koppints a csillagokra abban a sorrendben, ahogyan a történetben megtörtént.'}</p>
      <div className="stack tight" role="group" aria-label="Csillagok">
        {order.map((id) => {
          const on = lit.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={`option ${on ? 'on right' : ''}`}
              aria-pressed={on}
              disabled={on}
              onClick={() => tap(id)}
            >
              <Icon name="star" fill={on} />
              <span className="option-text">{byId[id].text}</span>
              {on ? <span className="option-tag on">{lit.indexOf(id) + 1}</span> : null}
            </button>
          );
        })}
      </div>
      {msg ? (
        <div className="note soft">
          <Icon name="lightbulb" />
          <span>{msg}</span>
        </div>
      ) : null}
      {done ? (
        <>
          {step.after ? <p className="lead">{step.after}</p> : null}
          <Btn iconAfter="arrow_forward" onClick={next}>
            {step.nextLabel || 'Tovább'}
          </Btn>
        </>
      ) : null}
    </div>
  );
}

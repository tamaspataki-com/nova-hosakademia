import { useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { useAnnounce } from './live.jsx';

// Join what one character says with the answer of the other. Tap a sentence on the left, then its answer on the right;
// a right pair stays joined, a wrong one is released with a short note. No timer, no points. Unscored: recorded as
// `match_pairs_done` (ids only). Content: step.pairs [{ id, left, right }], step.leftLabel, step.rightLabel.
export default function MatchPairs({ api }) {
  const { step, st, patch, log, next } = api;
  const announce = useAnnounce();
  const [rightOrder] = useState(() => st.rightOrder || shuffle(step.pairs.map((p) => p.id)));
  const joined = st.joined || [];
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState('');
  const byId = Object.fromEntries(step.pairs.map((p) => [p.id, p]));
  const done = joined.length === step.pairs.length;

  const pickLeft = (id) => {
    if (done || joined.includes(id)) return;
    setSel(sel === id ? null : id);
    setMsg('');
  };
  const pickRight = (id) => {
    if (done || joined.includes(id) || !sel) return;
    if (sel === id) {
      const now = [...joined, id];
      patch({ joined: now, rightOrder, ...(now.length === step.pairs.length ? { done: true } : null) });
      setSel(null);
      setMsg('');
      if (now.length === step.pairs.length) {
        log('match_pairs_done', { activity: step.id, misses: st.misses || 0 });
        announce('Minden pár összetalálkozott.');
      } else announce('Ez a két mondat összetartozik.');
    } else {
      patch({ rightOrder, misses: (st.misses || 0) + 1 });
      setSel(null);
      const text = 'Ez a két mondat nem tartozik össze. Gondold végig, ki mit mondott a történetben, és próbáld újra!';
      setMsg(text);
      announce(text);
    }
  };

  const Card = ({ id, text, side }) => {
    const on = joined.includes(id);
    const picked = side === 'l' && sel === id;
    return (
      <button
        type="button"
        className={`option sentence ${on ? 'on right' : ''} ${picked ? 'on' : ''}`}
        aria-pressed={on || picked}
        disabled={on}
        onClick={() => (side === 'l' ? pickLeft(id) : pickRight(id))}
      >
        <span className="option-text">{text}</span>
        {on ? <Icon name="check_circle" fill /> : null}
      </button>
    );
  };

  return (
    <div className="stack">
      <h2 className="h2">{step.prompt}</h2>
      <p className="lead">{step.lead || 'Koppints egy mondatra, majd arra, amelyik hozzá tartozik.'}</p>
      <div className="stack tight" role="group" aria-label={step.leftLabel || 'Első mondatok'}>
        <span className="eyebrow">{step.leftLabel}</span>
        {step.pairs.map((p) => (
          <Card key={p.id} id={p.id} text={p.left} side="l" />
        ))}
      </div>
      <div className="stack tight" role="group" aria-label={step.rightLabel || 'Válaszok'}>
        <span className="eyebrow">{step.rightLabel}</span>
        {rightOrder.map((id) => (
          <Card key={id} id={id} text={byId[id].right} side="r" />
        ))}
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

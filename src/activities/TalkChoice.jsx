import { useState } from 'react';
import { Btn, Icon } from '../app/ui.jsx';
import { useAnnounce } from './live.jsx';

// A decision inside a conversation: the child picks a sentence or a statement, gets a short authored response, and may
// try again after a response that points elsewhere. Options keep their authored order (the letters A, B, C are part of
// the text). Exactly one option has `correct: true`; every option may carry its own `feedback`. Unscored: no hints, no
// solution reveal, no score; it is recorded as `talk_choice_made` (ids only) and never as `activity_completed`.
export default function TalkChoice({ api }) {
  const { step, st, patch, log, next } = api;
  const announce = useAnnounce();
  const [selected, setSelected] = useState(null);
  const tried = st.tried || [];
  const byId = Object.fromEntries(step.options.map((o) => [o.id, o]));
  const last = st.last ? byId[st.last] : null; // the option submitted most recently
  const solved = !!st.done;

  const submit = () => {
    const o = byId[selected];
    if (!o || solved) return;
    const right = !!o.correct;
    patch({
      last: o.id,
      tried: [...tried, o.id],
      attempts: (st.attempts || 0) + 1,
      ...(right ? { done: true, choice: o.id } : null)
    });
    log('talk_choice_made', { activity: step.id, choice: o.id, correct: right });
    if (o.feedback) announce(o.feedback);
    setSelected(null);
  };

  return (
    <div className="stack">
      <h2 className="h2">{step.prompt}</h2>
      {step.lead ? <p className="lead">{step.lead}</p> : null}
      <div className="stack tight" role="group" aria-label="Lehetőségek">
        {step.options.map((o) => {
          const was = tried.includes(o.id) && !o.correct;
          const on = solved ? st.choice === o.id : selected === o.id;
          return (
            <button
              key={o.id}
              type="button"
              className={`option ${step.sentences ? 'sentence' : ''} ${on ? 'on' : ''} ${was ? 'wrong' : ''} ${solved && on ? 'right' : ''}`}
              aria-pressed={on}
              disabled={solved}
              onClick={() => setSelected(o.id)}
            >
              {o.letter ? <span className="option-tag">{o.letter}</span> : null}
              <span className="option-text">{o.text}</span>
              {on ? <Icon name="check_circle" fill /> : null}
            </button>
          );
        })}
      </div>
      {last?.feedback ? (
        <div className={`note ${last.correct ? 'good' : 'soft'}`}>
          <Icon name={last.correct ? 'check_circle' : 'lightbulb'} />
          <span>{last.feedback}</span>
        </div>
      ) : null}
      {solved ? (
        <Btn iconAfter="arrow_forward" onClick={next}>
          Tovább
        </Btn>
      ) : (
        <div className="row">
          <Btn disabled={!selected} onClick={submit}>
            {step.submitLabel || 'Ezt választom'}
          </Btn>
        </div>
      )}
    </div>
  );
}

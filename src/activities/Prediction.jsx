import { useEffect, useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { Feedback, StepWords, supportOf } from './shared.jsx';

// Make a prediction from the clues so far. Any option may be chosen and submitted, there is no right or wrong and no
// retry: the first prediction is saved, answered with authored feedback, and the story continues. It is recorded as
// "best-supported" or "not best-supported" by the clues, never as a fact about the animal's intention. The outcome is
// not part of this step; it is recorded separately by the later check.
export default function Prediction({ api }) {
  const { adv, step, st, run, patch, log, next } = api;
  const [order] = useState(() => st.order || shuffle(step.options.map((o) => o.id)));
  useEffect(() => {
    if (!st.order) patch({ order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const byId = Object.fromEntries(step.options.map((o) => [o.id, o]));
  const submitted = st.prediction || null;
  const selected = st.selected || null;

  const submit = () => {
    if (!selected || submitted) return;
    const best = !!byId[selected].best;
    const sup = supportOf(adv, run, step, st);
    patch({ prediction: selected, bestSupported: best });
    log('prediction_submitted', { activity: step.id, prediction: selected, bestSupported: best, mode: run.mode });
    log('activity_completed', {
      activity: step.id,
      atype: step.type,
      objective: step.objective,
      mode: run.mode,
      prediction: selected,
      bestSupported: best,
      rereads: sup.rereads,
      replays: sup.replays,
      transcript: sup.transcript,
      completion: sup.used ? 'supported' : 'independent'
    });
  };

  return (
    <div className="stack">
      <section className="card stack tight" aria-label="Eddigi nyomok">
        <span className="eyebrow">Eddigi nyomok</span>
        <p className="read-text">{step.summary}</p>
      </section>
      <h2 className="h2">{step.prompt}</h2>

      <div className="stack tight" role="group" aria-label="Feltételezések">
        {order.map((id) => {
          const on = (submitted || selected) === id;
          return (
            <button
              key={id}
              type="button"
              className={`option ${on ? 'on' : ''}`}
              aria-pressed={on}
              disabled={!!submitted}
              onClick={() => patch({ selected: id })}
            >
              <span className="option-text">{byId[id].text}</span>
              {on ? <Icon name="check_circle" fill /> : null}
            </button>
          );
        })}
      </div>

      <StepWords api={api} />

      {submitted ? (
        <>
          <Feedback ok>{st.bestSupported ? step.feedback.best : step.feedback.other}</Feedback>
          <Btn iconAfter="arrow_forward" onClick={next}>
            Tovább
          </Btn>
        </>
      ) : (
        <div className="row">
          <Btn disabled={!selected} onClick={submit}>
            {step.submitLabel}
          </Btn>
        </div>
      )}
    </div>
  );
}

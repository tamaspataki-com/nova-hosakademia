import { Btn, Icon } from '../app/ui.jsx';
import { Feedback, Hints, StepWords, useScored } from './shared.jsx';

// Carry out one short instruction that was read or heard earlier: choose what, then choose where.
// The passage is not shown here. Rereading, replaying and "only the quoted instruction" are in the help panel and are
// recorded as support. Every submission records whether each of the two components was kept independently.
export default function Instruction({ api }) {
  const { step, st, patch, next } = api;
  const rules = useScored(api);
  const what = st.what || null;
  const where = st.where || null;
  const done = rules.solved;

  const check = () => {
    if (!what || !where) return;
    const whatOk = what === step.correct.what;
    const whereOk = where === step.correct.where;
    rules.submit(whatOk && whereOk, { what, where, whatOk, whereOk });
  };

  const reveal = () => {
    patch({ what: step.correct.what, where: step.correct.where });
    rules.reveal();
  };

  const group = (key, title, options, chosen) => (
    <div className="stack tight" role="group" aria-label={title}>
      <span className="eyebrow">{title}</span>
      {options.map((o) => {
        const on = chosen === o.id;
        return (
          <button
            key={o.id}
            type="button"
            className={`option ${on ? 'on' : ''} ${done && on ? 'right' : ''}`}
            aria-pressed={on}
            disabled={done}
            onClick={() => patch({ [key]: o.id })}
          >
            {o.swatch ? <i className="swatch big" style={{ background: o.swatch }} aria-hidden="true" /> : null}
            <span className="option-text">{o.text}</span>
            {on ? <Icon name="check_circle" fill /> : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="stack">
      <h2 className="h2">{step.heading}</h2>
      <p className="lead">{step.prompt}</p>
      {group('what', 'Melyik láda?', step.what, what)}
      {group('where', 'Hová kerüljön?', step.where, where)}
      <StepWords api={api} />
      <Hints shown={st.shown} />
      {!done && rules.misses >= 2 && st.fallback ? (
        <Feedback>Nézd meg újra a szöveget, és próbáld újra.</Feedback>
      ) : null}

      {done ? (
        <>
          <Feedback ok>{rules.guided ? step.guided.text : step.feedback.correct}</Feedback>
          <p className="lead">{step.after}</p>
          <Btn iconAfter="arrow_forward" onClick={next}>
            Tovább
          </Btn>
        </>
      ) : (
        <div className="row">
          <Btn disabled={!what || !where} onClick={check}>
            {step.submitLabel}
          </Btn>
          {rules.misses >= 2 ? (
            <Btn kind="ghost" icon="visibility" onClick={reveal}>
              {step.revealLabel}
            </Btn>
          ) : null}
        </div>
      )}
    </div>
  );
}

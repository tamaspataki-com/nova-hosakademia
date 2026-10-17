import { Btn } from '../app/ui.jsx';

// A short outcome shown after a task: text only, never a scored passage. It has no recording of its own, so nothing
// is played here; when the child is listening the panel says so instead of implying that audio exists.
export default function Outcome({ api }) {
  const { step, run, next } = api;
  return (
    <div className="stack">
      <section className="card stack tight" aria-label={step.heading}>
        <span className="eyebrow">{step.heading}</span>
        <p className="read-text">{step.text}</p>
      </section>
      {run.mode !== 'read' ? <p className="muted">Ehhez a részhez nincs felvétel, ezért itt csak olvasható.</p> : null}
      <Btn iconAfter="arrow_forward" onClick={next}>
        Tovább
      </Btn>
    </div>
  );
}

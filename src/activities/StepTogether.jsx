import { Btn, Icon } from '../app/ui.jsx';
import { useAnnounce } from './live.jsx';

// Two characters step onto the bridge. A star of the bridge lights only when both have stepped, in either order, so the
// child cannot "win" by tapping fast: tapping the same character twice only asks to wait. No timer, no points. Unscored,
// recorded as `step_together_done` (ids only). Content: step.who [{ id, label }] (two characters), step.rounds (number of
// stars), step.waitText (function-free: `{name}` is replaced), step.prompt, step.lead.
export default function StepTogether({ api }) {
  const { step, st, patch, log, next } = api;
  const announce = useAnnounce();
  const stars = st.stars || 0;
  const ready = st.ready || null; // who has already stepped in this round
  const done = stars >= step.rounds;
  const other = (id) => step.who.find((w) => w.id !== id);

  const go = (w) => {
    if (done) return;
    if (!ready) {
      patch({ ready: w.id });
      announce(`${w.name} lépett. Most ${other(w.id).name} következik.`);
    } else if (ready === w.id) {
      announce(`${w.name} már lépett. Most ${other(w.id).name} következik.`);
    } else {
      const now = stars + 1;
      patch({ stars: now, ready: null, ...(now >= step.rounds ? { done: true } : null) });
      if (now >= step.rounds) {
        log('step_together_done', { activity: step.id });
        announce(step.doneText || 'A híd minden csillaga felgyulladt.');
      } else announce(`Együtt léptek. Felgyulladt a(z) ${now}. csillag.`);
    }
  };

  const waiting = ready ? other(ready) : null;
  return (
    <div className="stack">
      <h2 className="h2">{step.prompt}</h2>
      <p className="lead">{step.lead}</p>
      <div className="row center" aria-label={`A híd csillagai: ${stars} a(z) ${step.rounds} közül`} role="img">
        {Array.from({ length: step.rounds }, (_, i) => (
          <Icon key={i} name="star" fill={i < stars} size={40} />
        ))}
      </div>
      <div className="row">
        {step.who.map((w) => (
          <Btn
            key={w.id}
            kind={ready === w.id ? 'ghost' : 'primary'}
            icon={ready === w.id ? 'check_circle' : 'directions_walk'}
            disabled={done}
            onClick={() => go(w)}
          >
            {w.label}
          </Btn>
        ))}
      </div>
      {waiting && !done ? (
        <div className="note soft">
          <Icon name="hourglass_top" />
          <span>{`${other(waiting.id).name} már lépett. Várd meg, hogy ${waiting.name} is lépjen!`}</span>
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

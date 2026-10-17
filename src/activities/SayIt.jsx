import { useState } from 'react';
import { Btn, Icon } from '../app/ui.jsx';

// "Try it yourself": the child thinks of a situation and says their own sentence aloud. Picking a sentence starter is
// optional and nothing is typed or recorded (no free text, no audio): the parent view shows only that it was done
// (`private` on the step). Content: step.prompt, step.starters [{id,text}], step.doneLabel.
export default function SayIt({ api }) {
  const { step, st, log, next } = api;
  const [picked, setPicked] = useState(st.starter || null);
  const done = () => {
    log('sentence_practice_done', { activity: step.id, starter: picked || null });
    next();
  };
  return (
    <div className="stack">
      <h2 className="h2">{step.heading || step.title}</h2>
      <p className="lead">{step.prompt}</p>
      <div className="stack tight" role="group" aria-label="Mondatkezdetek">
        {step.starters.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`option sentence ${picked === s.id ? 'on' : ''}`}
            aria-pressed={picked === s.id}
            onClick={() => setPicked(picked === s.id ? null : s.id)}
          >
            <span className="option-text">{s.text}</span>
            {picked === s.id ? <Icon name="check_circle" fill /> : null}
          </button>
        ))}
      </div>
      <Btn iconAfter="arrow_forward" onClick={done}>
        {step.doneLabel}
      </Btn>
    </div>
  );
}

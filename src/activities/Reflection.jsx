import { useState } from 'react';
import { TOOLS } from '../content/index.js';
import { Btn, Icon } from '../app/ui.jsx';
import { canPlayAdventure } from '../app/audio.js';

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

// Reflection as its own step. With authored multi-choice options (step.options) the child may pick several
// ("Mi segített a történet megértésében?"); an option with `requires` is only shown when that support was
// available to the child. This is a preference report, never a measure of which strategy works.
// Without options it falls back to choosing one of the strategy tools.
export default function Reflection({ api }) {
  const { adv, step, st, patch, log, run, voiceReady, next } = api;
  const [picked, setPicked] = useState(st.choices || []);
  const done = !!st.reflected;

  if (!step.options) {
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

  const listening = run.mode === 'listen' || run.mode === 'combined';
  const available = {
    chunks: adv.passages.some((p) => p.sections.some((sec) => sec.chunks?.length)),
    reread: true, // the story can always be opened again (as a transcript in listening mode)
    replay: listening && canPlayAdventure(voiceReady, adv)
  };
  const options = step.options.filter((o) => !o.requires || available[o.requires]);

  const toggle = (o) => {
    if (done) return;
    if (step.single) return setPicked([o.id]); // one answer, unscored
    setPicked((cur) =>
      o.exclusive
        ? cur.includes(o.id)
          ? []
          : [o.id]
        : cur.includes(o.id)
          ? cur.filter((x) => x !== o.id)
          : [...cur.filter((x) => !options.find((y) => y.id === x)?.exclusive), o.id]
    );
  };
  const save = () => {
    patch({ reflected: true, choices: picked });
    log('reflection_saved', { activity: step.id, choices: picked });
  };

  return (
    <div className="stack">
      <h2 className="h2">{step.heading}</h2>
      <div className="stack tight" role="group" aria-label="Válaszd ki, ami igaz (többet is választhatsz)">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`option ${picked.includes(o.id) ? 'on' : ''}`}
            aria-pressed={picked.includes(o.id)}
            disabled={done}
            onClick={() => toggle(o)}
          >
            <span className="option-text">{o.text}</span>
            {picked.includes(o.id) ? <Icon name="check_circle" fill /> : null}
          </button>
        ))}
      </div>
      {done ? (
        <span className="muted">
          <Icon name="check_circle" /> Elmentve.
        </span>
      ) : (
        <Btn kind="ghost" disabled={!picked.length} onClick={save}>
          Elmentem
        </Btn>
      )}
      {picked.length && step.after ? (
        <div className="note good" role="status">
          <Icon name="lightbulb" />
          <span>{step.after}</span>
        </div>
      ) : null}
      <Btn iconAfter="arrow_forward" disabled={!done} onClick={next}>
        Tovább
      </Btn>
    </div>
  );
}

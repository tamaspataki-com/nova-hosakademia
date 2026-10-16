import { sectionOf } from '../content/index.js';
import { Btn, Icon } from '../app/ui.jsx';
import { Feedback, Hints, useScored } from './shared.jsx';
import { ReflectionCard } from './Reflection.jsx';

// "Which sentence tells us that…?" – the child selects one sentence of the passage, then submits it.
export default function Evidence({ api }) {
  const { adv, step, st, patch, next } = api;
  const rules = useScored(api);
  const sec = sectionOf(adv, step.passageId, step.sectionId);
  const wrongIds = st.wrongIds || [];
  const selected = st.selected;
  const done = rules.solved;

  const check = () => {
    if (!selected) return;
    const ok = selected === step.correctSentenceId;
    if (!ok) patch({ wrongIds: [...wrongIds, selected], selected: null });
    rules.submit(ok, { sentence: selected });
  };

  return (
    <div className="stack">
      <h2 className="h2">{step.prompt}</h2>
      {step.instruction ? <p className="lead">{step.instruction}</p> : null}

      <div className="stack tight" role="group" aria-label="A szöveg mondatai">
        {sec.sentences.map((s) => {
          const wrong = wrongIds.includes(s.id);
          const right = done && s.id === step.correctSentenceId;
          const on = selected === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`option sentence ${on ? 'on' : ''} ${wrong ? 'wrong' : ''} ${right ? 'right' : ''}`}
              aria-pressed={on}
              disabled={done || wrong}
              onClick={() => patch({ selected: s.id })}
            >
              <span className="option-text">{s.text}</span>
              {right ? <Icon name="check_circle" fill /> : null}
              {wrong ? <span className="option-tag">Nem ez</span> : null}
            </button>
          );
        })}
      </div>

      <Hints shown={st.shown} />

      {done ? (
        <>
          <Feedback ok>{step.feedback?.correct ?? 'Megtaláltad a mondatot.'}</Feedback>
          {rules.guided ? <ReflectionCard api={api} /> : null}
          <Btn iconAfter="arrow_forward" onClick={next}>
            Tovább
          </Btn>
        </>
      ) : (
        <div className="row">
          <Btn disabled={!selected} onClick={check}>
            Ellenőrzöm
          </Btn>
          {rules.misses >= 2 ? (
            <Btn kind="ghost" icon="visibility" onClick={rules.reveal}>
              Megmutatom a megoldást
            </Btn>
          ) : null}
        </div>
      )}
    </div>
  );
}

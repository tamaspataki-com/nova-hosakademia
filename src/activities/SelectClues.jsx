import { useEffect, useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { Feedback, Hints, SectionText, StepWords, useScored } from './shared.jsx';
import { sectionOf } from '../content/index.js';

// Choose exactly `pick` relevant details from a list, with the story so far kept visible (a relevance task, not a
// memory task). Selections can be changed until the answer is submitted; a wrong submission keeps the child's choice
// and shows the authored hint. Cards are never marked "unimportant": only the chosen pair is checked.
export default function SelectClues({ api }) {
  const { adv, step, st, patch, next, openWord } = api;
  const rules = useScored(api);
  const need = step.pick;
  const [order] = useState(() => st.order || shuffle(step.options.map((o) => o.id)));
  useEffect(() => {
    if (!st.order) patch({ order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const byId = Object.fromEntries(step.options.map((o) => [o.id, o]));
  const picked = st.picked || [];
  const done = rules.solved;
  const full = picked.length === need;

  const toggle = (id) => {
    if (done) return;
    if (picked.includes(id)) return patch({ picked: picked.filter((x) => x !== id) });
    if (picked.length < need) patch({ picked: [...picked, id] });
  };
  const check = () => {
    if (!full) return;
    const ok = step.correct.every((id) => picked.includes(id));
    rules.submit(ok, { selected: [...picked].sort() });
  };
  const reveal = () => {
    patch({ picked: [...step.correct] });
    rules.reveal();
  };

  const showFallback = !done && st.fallback && rules.misses > 0 && rules.misses < 2;

  return (
    <div className="stack">
      <section className="card stack tight" aria-label="A történet eddig">
        <span className="eyebrow">A történet eddig</span>
        {step.reference.map((r) => {
          const sec = sectionOf(adv, r.passageId, r.sectionId);
          return sec ? <SectionText key={sec.id} sec={sec} glossary={adv.glossary} onWord={openWord} /> : null;
        })}
      </section>

      <h2 className="h2">{step.prompt}</h2>
      <p className="lead" aria-live="polite">
        Kiválasztva: {picked.length}/{need}
      </p>

      <div className="stack tight" role="group" aria-label="Megfigyelések">
        {order.map((id) => {
          const on = picked.includes(id);
          const locked = done || (!on && picked.length >= need);
          return (
            <button
              key={id}
              type="button"
              className={`option ${on ? 'on' : ''} ${done && on ? 'right' : ''}`}
              aria-pressed={on}
              disabled={locked}
              onClick={() => toggle(id)}
            >
              <span className="option-text">{byId[id].text}</span>
              {on ? <Icon name="check_circle" fill /> : null}
            </button>
          );
        })}
      </div>
      {!done && picked.length >= need ? (
        <p className="muted">Ha másik nyomot választanál, koppints egy kiválasztottra, hogy visszavond.</p>
      ) : null}

      <StepWords api={api} />
      <Hints shown={st.shown} />
      {showFallback ? <Feedback>Nézd meg újra a szöveget, és próbáld újra.</Feedback> : null}

      {done ? (
        <>
          <Feedback ok>{rules.guided ? step.guided.text : step.feedback.correct}</Feedback>
          <Btn iconAfter="arrow_forward" onClick={next}>
            Tovább
          </Btn>
        </>
      ) : (
        <div className="row">
          <Btn disabled={!full} onClick={check}>
            {step.submitLabel}
          </Btn>
          {rules.misses >= 2 ? (
            <Btn kind="ghost" icon="visibility" onClick={reveal}>
              Megmutatom a megoldást
            </Btn>
          ) : null}
        </div>
      )}
    </div>
  );
}

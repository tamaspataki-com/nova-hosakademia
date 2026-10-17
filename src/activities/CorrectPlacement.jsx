import { useEffect, useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { Feedback, Hints, StepWords, useScored } from './shared.jsx';

// Check a list against a reference that stays visible: which two objects are in the wrong place?
// This is a checking task, not a memory test (step.record is added to the completion event). The guided solution
// marks the two misplaced objects in the note and shows the corrected note.
export default function CorrectPlacement({ api }) {
  const { step, st, patch, next } = api;
  const rules = useScored(api);
  const [order] = useState(() => st.order || shuffle(step.options.map((o) => o.id)));
  useEffect(() => {
    if (!st.order) patch({ order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const byId = Object.fromEntries(step.options.map((o) => [o.id, o]));
  const wrongIds = st.wrongIds || [];
  const selected = st.selected;
  const done = rules.solved;
  const showSolution = rules.guided;

  const check = () => {
    if (!selected) return;
    const ok = selected === step.correct;
    if (!ok) patch({ wrongIds: [...wrongIds, selected], selected: null });
    rules.submit(ok, { choice: selected });
  };

  return (
    <div className="stack">
      <h2 className="h2">{step.heading}</h2>

      <section className="card stack tight" aria-label={step.reference.title}>
        <span className="eyebrow">{step.reference.title}</span>
        {step.reference.rows.map((r) => (
          <p key={r.id} className="note-row">
            <strong>{r.place}:</strong> {r.contents}
          </p>
        ))}
      </section>

      <NoteTable title={step.note.title} rows={step.note.rows} marks={showSolution ? step.note.wrongMarks : null} />

      <h3 className="h2">{step.prompt}</h3>
      <div className="stack tight" role="group" aria-label="Válaszlehetőségek">
        {order.map((id) => {
          const o = byId[id];
          const wrong = wrongIds.includes(id);
          const right = done && id === step.correct;
          const on = selected === id;
          return (
            <button
              key={id}
              type="button"
              className={`option ${on ? 'on' : ''} ${wrong ? 'wrong' : ''} ${right ? 'right' : ''}`}
              aria-pressed={on}
              disabled={done || wrong}
              onClick={() => patch({ selected: id })}
            >
              <span className="option-text">{o.text}</span>
              {right ? <Icon name="check_circle" fill /> : null}
              {wrong ? <span className="option-tag">Nem ez</span> : null}
            </button>
          );
        })}
      </div>

      <StepWords api={api} />
      <Hints shown={st.shown} />

      {showSolution ? (
        <>
          <NoteTable
            title="A helyes szállítólevél"
            rows={step.note.fixed}
            marks={Object.fromEntries(step.note.fixed.map((r) => [r.id, r.marks[0]]))}
          />
          <p className="muted">
            <Icon name="swap_horiz" /> A kiemelt két tárgy cserélt helyet.
          </p>
        </>
      ) : null}

      {done ? (
        <>
          <Feedback ok>{rules.guided ? step.guided.text : step.feedback.correct}</Feedback>
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

// A small two-column note. `marks` maps a row id to the object (lower-case word) to highlight in that row.
function NoteTable({ title, rows, marks }) {
  return (
    <table className="note-table">
      <caption>{title}</caption>
      <thead>
        <tr>
          <th scope="col">Hová</th>
          <th scope="col">Tárgyak</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <th scope="row">{r.place}</th>
            <td>{marks?.[r.id] ? mark(r.contents, marks[r.id]) : r.contents}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function mark(text, word) {
  const i = text.toLowerCase().indexOf(word.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="swap">{text.slice(i, i + word.length)}</mark>
      {text.slice(i + word.length)}
    </>
  );
}

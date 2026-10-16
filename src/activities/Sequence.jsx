import { useEffect, useRef, useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { touchDrag } from '../app/touchDrag.js';
import { Feedback, Hints, useScored } from './shared.jsx';
import { ReflectionCard } from './Reflection.jsx';

// Arrange event cards into labelled positions. Works by mouse drag, finger drag (hold, then drag) and by tapping
// a card and then a position. Placed cards can be removed or changed; "Újrakezdem" clears the board before a check.
export default function Sequence({ api }) {
  const { adv, step, st, patch, next } = api;
  const rules = useScored(api);
  const items = Object.fromEntries(step.items.map((i) => [i.id, i]));
  const n = step.items.length;
  const hideArt = adv.context === 'independentCheck' && !rules.solved; // art can give the answer away

  const [pool0] = useState(() => {
    if (st.order) return st.order;
    let o;
    do o = shuffle(step.items.map((i) => i.id));
    while (o.join() === step.correctOrder.join());
    return o;
  });
  useEffect(() => {
    if (!st.order) patch({ order: pool0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slots = st.slots || Array(n).fill(null);
  const result = st.result || null; // per slot true / false after a check
  const sel = st.sel || null;
  const done = rules.solved;
  const pool = pool0.filter((id) => !slots.includes(id));
  const dragId = useRef(null);

  const place = (id, i) => {
    if (done || result?.[i]) return;
    const placed = slots.map((x) => (x === id ? null : x));
    placed[i] = id;
    patch({ slots: placed, sel: null, result: null });
  };
  const remove = (id) => {
    if (done) return;
    patch({ slots: slots.map((x) => (x === id ? null : x)), sel: null, result: null });
  };
  const tapSlot = (i) => {
    if (done) return;
    if (sel) return place(sel, i);
    if (slots[i] && !result?.[i]) remove(slots[i]);
  };
  const tapCard = (id) => {
    if (!done) patch({ sel: sel === id ? null : id });
  };
  const drop = (id, to) => (to === 'pool' ? remove(id) : place(id, Number(to)));

  const check = () => {
    if (slots.some((x) => !x)) return;
    const res = slots.map((id, i) => id === step.correctOrder[i]);
    const ok = res.every(Boolean);
    patch({ result: res });
    rules.submit(ok, { order: slots.join(','), correctCount: res.filter(Boolean).length }, 'sequence_submitted');
  };
  const retry = () => patch({ slots: slots.map((id, i) => (result?.[i] ? id : null)), result: null, sel: null });
  const reset = () => patch({ slots: Array(n).fill(null), result: null, sel: null });
  const reveal = () => {
    patch({ slots: [...step.correctOrder], result: step.correctOrder.map(() => true), sel: null });
    rules.reveal();
  };

  const filledAny = slots.some(Boolean);
  const full = slots.every(Boolean);

  const Card = ({ id, placed }) => (
    <>
      {!hideArt && items[id].src ? <img src={items[id].src} alt="" className="seq-img" /> : null}
      <span className="option-text">{items[id].text}</span>
      {placed ? null : sel === id ? <span className="option-tag on">Kiválasztva</span> : null}
    </>
  );

  return (
    <div className="stack">
      <h2 className="h2">{step.prompt}</h2>
      <p className="lead">
        Koppints egy kártyára, majd a helyére, vagy húzd oda. Ha meggondolod magad, koppints a behelyezett kártyára, és
        visszakerül.
      </p>

      <div className="stack tight">
        {step.labels.map((label, i) => {
          const id = slots[i];
          const r = result ? result[i] : null;
          return (
            <div
              key={i}
              className="slot-wrap"
              data-drop={i}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId.current) place(dragId.current, i);
                dragId.current = null;
              }}
            >
              <div className="slot-head">
                <span className="eyebrow">{label}</span>
                {r !== null ? (
                  <span className={`slot-status ${r ? 'ok' : 'no'}`}>
                    <Icon name={r ? 'check_circle' : 'swap_vert'} /> {r ? 'Jó helyen' : 'Próbáld máshova'}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                data-drag=""
                className={`slot ${id ? 'filled' : 'empty'} ${sel && !id ? 'ready' : ''} ${r === true ? 'ok' : ''} ${r === false ? 'no' : ''}`}
                aria-label={id ? `${label}: ${items[id].text}. Koppints a visszavételhez.` : `${label}: üres hely`}
                draggable={!!id && !done && !r}
                onDragStart={() => (dragId.current = id)}
                onTouchStart={id && !done && !r ? touchDrag((to) => drop(id, to)) : undefined}
                onClick={() => tapSlot(i)}
              >
                {id ? (
                  <Card id={id} placed />
                ) : (
                  <span className="slot-empty">
                    {sel ? 'Koppints ide a kiválasztott kártyáért' : 'Ide tedd a kártyát'}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {pool.length ? (
        <div
          className="pool"
          data-drop="pool"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (dragId.current) remove(dragId.current);
            dragId.current = null;
          }}
        >
          <span className="pool-title">Eseménykártyák</span>
          {pool.map((id) => (
            <button
              key={id}
              type="button"
              data-drag=""
              className={`card-opt ${sel === id ? 'on' : ''}`}
              aria-pressed={sel === id}
              draggable={!done}
              onDragStart={() => (dragId.current = id)}
              onTouchStart={!done ? touchDrag((to) => drop(id, to)) : undefined}
              onClick={() => tapCard(id)}
            >
              <Card id={id} />
            </button>
          ))}
        </div>
      ) : null}

      <Hints shown={st.shown} />

      {done ? (
        <>
          <Feedback ok>
            {rules.guided ? 'Így történtek az események.' : (step.feedback?.correct ?? 'Pontos sorrend!')}
          </Feedback>
          {rules.guided ? <ReflectionCard api={api} /> : null}
          <Btn iconAfter="arrow_forward" onClick={next}>
            Tovább
          </Btn>
        </>
      ) : (
        <div className="row">
          {result ? (
            <Btn kind="ghost" icon="undo" onClick={retry}>
              Újra próbálom
            </Btn>
          ) : (
            <Btn disabled={!full} onClick={check}>
              Ellenőrzöm
            </Btn>
          )}
          {!result && filledAny ? (
            <Btn kind="ghost" icon="restart_alt" onClick={reset}>
              Újrakezdem
            </Btn>
          ) : null}
          {rules.misses >= 2 ? (
            <Btn kind="ghost" icon="visibility" onClick={reveal}>
              Megmutatom a sorrendet
            </Btn>
          ) : null}
        </div>
      )}
    </div>
  );
}

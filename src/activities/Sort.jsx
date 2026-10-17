import { useEffect, useRef, useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { touchDrag } from '../app/touchDrag.js';
import { Feedback, Hints, StepWords, useScored } from './shared.jsx';

// Sort cards into labelled destinations (boxes or places). Works by mouse drag, finger drag (hold, then drag) and by
// tapping a card and then a destination. Cards can be moved or taken back until the work is solved.
//   · A check never moves the child's work: cards stay where they were put and are marked "Jó helyen" or
//     "Nézd meg újra". Moving a card removes only that card's mark.
//   · Step content: destinations[{id,label,swatch?,icon?}], items[{id,text,to,swatch?}], optional capacity (cards per
//     destination), submitLabel, partialText, revealAt (misses before the solution is offered), revealLabel.
//   · Colour is only ever a small swatch next to a written label.
export default function Sort({ api }) {
  const { step, st, patch, next } = api;
  const rules = useScored(api);
  const items = Object.fromEntries(step.items.map((i) => [i.id, i]));
  const dests = step.destinations;
  const [pool0] = useState(() => st.order || shuffle(step.items.map((i) => i.id)));
  useEffect(() => {
    if (!st.order) patch({ order: pool0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placement = st.placement || {}; // itemId -> destinationId
  const result = st.result || null; // itemId -> true | false after a check
  const sel = st.sel || null;
  const done = rules.solved;
  const pool = pool0.filter((id) => !placement[id]);
  const dragId = useRef(null);
  const root = useRef(null);
  const focusNext = useRef(null); // selector to focus after the next render (cards move between lists)
  const [said, setSaid] = useState(''); // spoken status for screen readers
  useEffect(() => {
    if (!focusNext.current) return;
    root.current?.querySelector(focusNext.current)?.focus();
    focusNext.current = null;
  });
  const revealAt = step.revealAt ?? 2;
  const n = step.items.length;
  const full = Object.keys(placement).length === n;

  const place = (id, to) => {
    if (done || !items[id]) return;
    const moved = { ...placement };
    const touched = [id];
    const from = moved[id];
    if (from === to) return patch({ sel: null });
    if (step.capacity) {
      // A full destination hands its card back (or swaps it into the place the moved card came from).
      const inside = Object.keys(moved).filter((k) => moved[k] === to && k !== id);
      if (inside.length >= step.capacity) {
        touched.push(inside[0]);
        if (from) moved[inside[0]] = from;
        else delete moved[inside[0]];
      }
    }
    moved[id] = to;
    focusNext.current = `[data-card="${id}"]`;
    setSaid(`${items[id].text}: ${label(to)}.`);
    patch({ placement: moved, sel: null, result: clearMarks(result, touched) });
  };
  const take = (id) => {
    if (done || !placement[id]) return patch({ sel: null });
    const { [id]: _gone, ...rest } = placement;
    focusNext.current = `[data-card="${id}"]`;
    setSaid(`${items[id].text}: visszatéve a kártyák közé.`);
    patch({ placement: rest, sel: null, result: clearMarks(result, [id]) });
  };
  const drop = (id, to) => (to === 'pool' ? take(id) : place(id, to));
  const tapDest = (d) => {
    if (sel) place(sel, d);
  };
  const tapCard = (id) => {
    if (done) return;
    const on = sel !== id;
    // Selecting moves the focus to the first destination button; cancelling returns it to the card.
    focusNext.current = on ? '[data-dest-btn]' : `[data-card="${id}"]`;
    setSaid(
      on ? `${items[id].text} kiválasztva. Válaszd ki, hová tegyük.` : `${items[id].text} kiválasztása megszűnt.`
    );
    patch({ sel: on ? id : null });
  };
  const onKeyDown = (e) => {
    if (e.key === 'Escape' && sel && !done) {
      e.stopPropagation();
      focusNext.current = `[data-card="${sel}"]`;
      patch({ sel: null });
    }
  };

  const check = () => {
    if (!full) return;
    const res = Object.fromEntries(step.items.map((i) => [i.id, placement[i.id] === i.to]));
    const ok = Object.values(res).every(Boolean);
    patch({ result: res });
    // Each card's placement is recorded on every submission; the first submission is the independent one.
    rules.submit(ok, {
      placement: Object.fromEntries(step.items.map((i) => [i.id, placement[i.id]])),
      cards: res,
      correctCount: Object.values(res).filter(Boolean).length
    });
  };
  const reset = () => {
    focusNext.current = '[data-card]';
    patch({ placement: {}, result: null, sel: null });
  };
  const reveal = () => {
    patch({
      placement: Object.fromEntries(step.items.map((i) => [i.id, i.to])),
      result: Object.fromEntries(step.items.map((i) => [i.id, true])),
      sel: null
    });
    rules.reveal();
  };

  const correctCount = result ? Object.values(result).filter(Boolean).length : 0;
  const partial = !done && result && correctCount > 0 && correctCount < n;
  const label = (id) => dests.find((d) => d.id === id)?.label;

  const Card = ({ id }) => {
    const it = items[id];
    const r = result ? result[id] : null;
    return (
      <>
        {it.swatch ? <i className="swatch" style={{ background: it.swatch }} aria-hidden="true" /> : null}
        <span className="option-text">{it.text}</span>
        {r === true ? (
          <span className="slot-status ok">
            <Icon name="check_circle" /> Jó helyen
          </span>
        ) : r === false ? (
          <span className="slot-status no">
            <Icon name="swap_vert" /> Nézd meg újra
          </span>
        ) : sel === id ? (
          <span className="option-tag on">Kiválasztva</span>
        ) : null}
      </>
    );
  };

  const cardBtn = (id) => (
    <button
      key={id}
      type="button"
      data-drag=""
      data-card={id}
      className={`card-opt ${sel === id ? 'on' : ''} ${result?.[id] === true ? 'ok' : ''} ${result?.[id] === false ? 'no' : ''}`}
      aria-pressed={sel === id}
      aria-label={
        placement[id]
          ? `${items[id].text}, itt: ${label(placement[id])}${result ? (result[id] ? ', jó helyen' : ', nézd meg újra') : ''}`
          : undefined
      }
      draggable={!done}
      onDragStart={() => (dragId.current = id)}
      onTouchStart={!done ? touchDrag((to) => drop(id, to)) : undefined}
      onClick={() => tapCard(id)}
    >
      <Card id={id} />
    </button>
  );

  return (
    <div className="stack" ref={root} onKeyDown={onKeyDown}>
      <div className="sr-only" role="status" aria-live="polite">
        {said}
      </div>
      <h2 className="h2">{step.prompt}</h2>
      <p className="lead">
        Koppints egy kártyára, majd arra a helyre, ahová tartozik, vagy húzd oda. Ha meggondolod magad, a kártyát
        átteheted máshová.
      </p>

      {sel && !done ? (
        <div className="place-bar" role="group" aria-label="Hová tegyük a kiválasztott kártyát?">
          <span className="eyebrow">{items[sel].text} – hová tegyük?</span>
          <div className="row">
            {dests
              .filter((d) => placement[sel] !== d.id)
              .map((d, k) => (
                <Btn key={d.id} kind="ghost" icon="move_to_inbox" data-dest-btn="" onClick={() => tapDest(d.id)}>
                  Ide teszem: {d.label}
                </Btn>
              ))}
          </div>
        </div>
      ) : null}

      <div className="sort-dests">
        {dests.map((d) => {
          const inside = step.items.filter((i) => placement[i.id] === d.id).map((i) => i.id);
          return (
            <div
              key={d.id}
              className={`dest ${sel && placement[sel] !== d.id ? 'ready' : ''}`}
              data-drop={d.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId.current) place(dragId.current, d.id);
                dragId.current = null;
              }}
            >
              <div className="dest-head">
                {d.swatch ? <i className="swatch big" style={{ background: d.swatch }} aria-hidden="true" /> : null}
                {d.icon ? <Icon name={d.icon} size={30} /> : null}
                <strong className="h3">{d.label}</strong>
              </div>
              {inside.map(cardBtn)}
              {!inside.length ? <span className="slot-empty">Ide tedd a kártyát</span> : null}
            </div>
          );
        })}
      </div>

      <div
        className="pool"
        data-drop="pool"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (dragId.current) take(dragId.current);
          dragId.current = null;
        }}
      >
        <span className="pool-title">{step.poolTitle || 'Tárgyak'}</span>
        {pool.length ? pool.map(cardBtn) : <span className="muted">Minden kártya a helyén van.</span>}
        {sel && placement[sel] && !done ? (
          <Btn kind="ghost" icon="undo" onClick={() => take(sel)}>
            Visszateszem a kártyák közé
          </Btn>
        ) : null}
      </div>

      <StepWords api={api} />
      <Hints shown={st.shown} />
      {partial && step.partialText ? <Feedback>{step.partialText}</Feedback> : null}

      {done ? (
        <>
          <Feedback ok>
            {rules.guided
              ? (step.guided?.text ?? 'Így tartoznak össze.')
              : (step.feedback?.correct ?? 'Jól dolgoztál.')}
          </Feedback>
          <Btn iconAfter="arrow_forward" onClick={next}>
            Tovább
          </Btn>
        </>
      ) : (
        <div className="row">
          <Btn disabled={!full} onClick={check}>
            {step.submitLabel || 'Ellenőrzöm'}
          </Btn>
          {Object.keys(placement).length ? (
            <Btn kind="ghost" icon="restart_alt" onClick={reset}>
              Újrakezdem
            </Btn>
          ) : null}
          {rules.misses >= revealAt ? (
            <Btn kind="ghost" icon="visibility" onClick={reveal}>
              {step.revealLabel || 'Megmutatom a megoldást'}
            </Btn>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Drop the check marks of the cards that were moved (all other cards keep theirs until the next check).
function clearMarks(result, ids) {
  if (!result) return null;
  const r = { ...result };
  ids.forEach((id) => delete r[id]);
  return Object.keys(r).length ? r : null;
}

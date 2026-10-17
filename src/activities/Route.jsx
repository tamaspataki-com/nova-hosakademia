import { useEffect, useMemo, useRef } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { tone } from '../app/tone.js';
import { Feedback, Hints, sentenceCount } from './shared.jsx';
import { useAnnounceOnMount } from './live.jsx';

// A route made of authored nodes and paths, followed one decision at a time. The map is drawn in code with a fixed
// orientation (the same on every screen size) and every place is named in words and has its own shape, never colour
// alone. The rover only ever stands on a place the child has already reached with a correct (or guided) decision:
// a wrong choice never moves it. Each decision is chosen first and then submitted ("Erre megyek"); a choice can be
// changed until it is submitted. A place that was wrong stays selectable (there are only two choices, and two
// misses are what offer the guided solution). No timer, no steering, no score. Two misses on a decision offer the solution.

// Shapes are drawn around (0,0); the group is moved to the node's position.
const SHAPE = {
  flag: (
    <>
      <line x1="0" y1="0" x2="0" y2="-34" strokeWidth="3" />
      <polygon points="0,-34 24,-26 0,-18" className="fill-flag" />
    </>
  ),
  rock: <polygon points="-24,12 -16,-12 0,-20 18,-10 26,12" className="fill-rock" />,
  research: (
    <>
      <rect x="-20" y="-16" width="40" height="32" rx="5" className="fill-research" />
      <circle cx="0" cy="0" r="7" fill="none" strokeWidth="3" />
    </>
  ),
  solar: (
    <>
      <polygon points="-24,12 -16,-14 24,-14 16,12" className="fill-solar" />
      <line x1="-4" y1="-14" x2="-12" y2="12" strokeWidth="2" />
      <line x1="8" y1="-14" x2="4" y2="12" strokeWidth="2" />
    </>
  )
};

function RoverMarker({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`} className="rover-marker">
      <rect x="-15" y="-9" width="30" height="13" rx="4" className="fill-rover" />
      <rect x="-6" y="-17" width="12" height="8" rx="2" className="fill-rover" />
      <circle cx="-9" cy="7" r="5" className="fill-wheel" />
      <circle cx="9" cy="7" r="5" className="fill-wheel" />
    </g>
  );
}

export function RouteMap({ map, at, reached }) {
  const node = Object.fromEntries(map.nodes.map((n) => [n.id, n]));
  const here = node[at];
  return (
    <figure className="route-map">
      <svg viewBox="0 0 320 380" role="img" aria-label={map.description} focusable="false">
        {map.paths.map((p) => {
          const a = node[p.from];
          const b = node[p.to];
          const done = reached.includes(p.to);
          return (
            <line
              key={p.from + p.to}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={`route-path ${done ? 'done' : ''}`}
            />
          );
        })}
        {map.nodes.map((n) => (
          <g key={n.id} transform={`translate(${n.x},${n.y})`} className="route-node" stroke="currentColor">
            {SHAPE[n.shape]}
            <text x={n.lx} y={n.ly} textAnchor={n.anchor} className="route-label">
              {n.label}
            </text>
          </g>
        ))}
        <RoverMarker x={here.x + here.mx} y={here.y - 2} />
      </svg>
      <figcaption className="route-caption" aria-live="polite">
        A marsjáró itt áll: <strong>{here.label}</strong>
      </figcaption>
    </figure>
  );
}

export default function Route({ api }) {
  const { adv, step, st, run, patch, log, next, openStory, settings } = api;
  const decisions = step.decisions;
  const items = st.items || {};
  const index = Math.min(st.index || 0, decisions.length - 1);
  const d = decisions[index];
  const it = items[d.id] || {};
  const last = index === decisions.length - 1;
  const done = !!it.solved;
  const wrong = it.wrongIds || [];
  const misses = done && !it.guided ? (it.attempts || 1) - 1 : it.attempts || 0;
  const showGuided = (!done && misses >= 2) || it.guided;
  const allDone = !!st.solved;

  // The rover stands on the destination of the last solved decision (the start while none is solved).
  const reached = decisions.filter((x) => items[x.id]?.solved).map((x) => x.to);
  const at = reached.length ? reached[reached.length - 1] : step.map.start;

  const order = useMemo(
    () => (d.fixedOrder ? d.options.map((o) => o.id) : shuffle(d.options.map((o) => o.id))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [d.id]
  );
  const orderFor = it.order || order;
  useEffect(() => {
    if (!it.order) setItem({ order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.id]);

  const setItem = (p) =>
    patch((cur) => ({
      ...cur,
      items: { ...(cur.items || {}), [d.id]: { ...(cur.items?.[d.id] || {}), ...p } }
    }));

  const headRef = useRef(null);
  const nextRef = useRef(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) headRef.current?.focus({ preventScroll: true });
    mounted.current = true;
  }, [index]);
  const seenAttempts = useRef(it.attempts || 0);
  useEffect(() => {
    const n = it.attempts || 0;
    if (n > seenAttempts.current && !done) {
      const a = document.activeElement;
      if (!a || a === document.body || a.disabled) document.querySelector('.runner .option:not(:disabled)')?.focus();
    }
    seenAttempts.current = n;
  }, [it.attempts, done]);
  useEffect(() => {
    if (done && !last) nextRef.current?.focus();
  }, [done, last]);

  const finish = (extra) => {
    const supported = extra.hints > 0 || !!it.opened || !!it.replayed || extra.guided;
    log('activity_completed', {
      activity: step.id,
      decision: d.id,
      atype: step.type,
      objective: step.objective,
      mode: run.mode,
      length: sentenceCount(adv, step),
      repeat: !!run.repeat,
      hints: Math.max(it.shown?.length || 0, extra.hints),
      storyOpened: !!it.opened,
      replays: it.replayed ? 1 : 0,
      attempts: extra.attempts,
      firstCorrect: extra.first,
      ...step.record, // following directions with a visual reference
      completion: extra.guided ? 'guided' : extra.first && !supported ? 'independent' : 'supported'
    });
  };

  const check = () => {
    const sel = it.selected;
    if (!sel || done) return;
    const ok = sel === d.correct;
    const n = (it.attempts || 0) + 1;
    const shown = it.shown || [];
    const nextShown = !ok && !shown.includes(d.hint) ? [...shown, d.hint] : shown;
    setItem({
      attempts: n,
      shown: nextShown,
      solved: ok,
      wrongIds: ok ? wrong : [...new Set([...wrong, sel])],
      selected: ok ? sel : null
    });
    patch((cur) => ({ ...cur, attempts: (cur.attempts || 0) + 1 }));
    log('answer_submitted', {
      activity: step.id,
      decision: d.id,
      atype: step.type,
      attempt: n,
      ok,
      first: n === 1,
      choice: sel
    });
    if (ok) {
      tone(settings.sound, 'ok');
      finish({ first: n === 1, guided: false, attempts: n, hints: nextShown.length });
      if (last) patch({ solved: true });
    }
  };

  const reveal = () => {
    setItem({ solved: true, guided: true, selected: d.correct });
    log('solution_shown', { activity: step.id, decision: d.id, atype: step.type, attempt: it.attempts || 0 });
    finish({ first: false, guided: true, attempts: it.attempts || 0, hints: it.shown?.length || 0 });
    if (last) patch({ solved: true });
  };

  return (
    <div className="stack">
      <RouteMap map={step.map} at={at} reached={reached} />

      <div>
        <Btn kind="ghost" icon="menu_book" onClick={openStory}>
          Történet megnyitása
        </Btn>
      </div>

      <h2 className="h2" tabIndex={-1} ref={headRef}>
        {d.prompt}
      </h2>

      <div className="stack tight" role="group" aria-label="Válaszlehetőségek">
        {orderFor.map((id) => {
          const o = d.options.find((x) => x.id === id);
          const isWrong = wrong.includes(id);
          const right = done && id === d.correct;
          const on = it.selected === id;
          return (
            <button
              key={id}
              type="button"
              className={`option ${on ? 'on' : ''} ${isWrong ? 'wrong' : ''} ${right ? 'right' : ''}`}
              aria-pressed={on}
              disabled={done}
              onClick={() => !done && setItem({ selected: id })}
            >
              <span className="option-text">{o.text}</span>
              {right ? <Icon name="check_circle" fill /> : null}
              {isWrong ? <span className="option-tag">Nem ez</span> : null}
            </button>
          );
        })}
      </div>

      <Hints shown={it.shown} />
      {showGuided ? <GuidedNote text={step.guided} /> : null}

      {done ? (
        <>
          {allDone ? <Feedback ok>{it.guided ? 'Ez a helyes válasz.' : step.feedback.correct}</Feedback> : null}
          {last ? (
            <Btn iconAfter="arrow_forward" onClick={next}>
              Tovább
            </Btn>
          ) : (
            <button type="button" className="btn btn-primary" ref={nextRef} onClick={() => patch({ index: index + 1 })}>
              Következő döntés <Icon name="arrow_forward" />
            </button>
          )}
        </>
      ) : (
        <div className="row">
          <Btn disabled={!it.selected} onClick={check}>
            Erre megyek
          </Btn>
          {misses >= 2 ? (
            <Btn kind="ghost" icon="visibility" onClick={reveal}>
              Megmutatom a megoldást
            </Btn>
          ) : null}
        </div>
      )}
    </div>
  );
}

function GuidedNote({ text }) {
  const ref = useRef(null);
  useAnnounceOnMount(ref);
  return (
    <div className="note guided" ref={ref}>
      <Icon name="menu_book" />
      <strong>{text}</strong>
    </div>
  );
}

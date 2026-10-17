import { useState } from 'react';
import { useStore } from '../app/store.jsx';
import { Btn, Icon } from '../app/ui.jsx';
import { BADGES, ROUTINE, TOOLS, findAdventure, sectionOf } from '../content/index.js';
import { Glyph } from '../app/ui.jsx';
import { AdventureCard } from './Explore.jsx';

const TABS = [
  ['discoveries', 'Felfedezéseim', 'travel_explore'],
  ['tools', 'Eszközeim', 'backpack'],
  ['favourites', 'Kedvenceim', 'favorite']
];

export default function MyWorld({ go, tab = 'tools', adventures }) {
  const { state } = useStore();
  const [cur, setCur] = useState(tab);
  return (
    <div className="page stack">
      <h1 className="h1">Saját világom</h1>
      <div className="tabs" role="tablist">
        {TABS.map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={cur === id}
            className={`tab ${cur === id ? 'on' : ''}`}
            onClick={() => setCur(id)}
          >
            <Icon name={icon} /> {label}
          </button>
        ))}
      </div>

      {cur === 'discoveries' ? <Discoveries adventures={adventures} /> : null}
      {cur === 'tools' ? <Tools go={go} badges={state.badges} /> : null}
      {cur === 'favourites' ? <Favourites go={go} adventures={adventures} /> : null}
    </div>
  );
}

// Only authored discoveries from completed adventures. Fictional and factual ones are labelled apart.
function Discoveries({ adventures }) {
  const { state, act } = useStore();
  const found = adventures
    .filter((a) => (state.history[a.id]?.completions || 0) > 0)
    .flatMap((a) => (a.discoveries || []).map((d) => ({ ...d, adv: a })));
  if (!found.length)
    return (
      <div className="card">
        <Icon name="travel_explore" /> Itt jelennek meg a kalandok során felfedezett érdekességek. Még nincs
        felfedezésed.
      </div>
    );
  return (
    <div className="stack">
      {found.map((d) => {
        const key = `${d.adv.id}:${d.id}`;
        return (
          <article key={key} className="card stack tight">
            <span className="eyebrow">
              {d.label || (d.kind === 'fact' ? 'Érdekesség' : 'Kitalált történetből származó felfedezés')}
            </span>
            {d.title ? <strong className="h3">{d.title}</strong> : null}
            <p className="lead">{d.text}</p>
            <span className="muted">Kaland: {d.adv.title}</span>
            <label htmlFor={key} className="muted">
              Elmondom a saját szavaimmal (nem kötelező)
            </label>
            <textarea
              id={key}
              className="field"
              rows={2}
              value={state.discoveries[key]?.explanation || ''}
              onChange={(e) => act.discovery(key, { explanation: e.target.value })}
            />
          </article>
        );
      })}
    </div>
  );
}

function Tools({ go, badges }) {
  return (
    <div className="stack">
      <p className="lead">Öt módszer, amely segít, ha elakadsz. Mindegyiket kipróbálhatod, amikor csak szeretnéd.</p>
      <div className="tool-grid">
        {TOOLS.map((t) => (
          <article key={t.id} className="card tool-card">
            <img className="tool-img" src={t.src} alt="" />
            <strong className="h3">{t.name}</strong>
            <span>{t.explain}</span>
            <Btn kind="ghost" onClick={() => go({ name: 'tool', id: t.id })}>
              Kipróbálom
            </Btn>
          </article>
        ))}
      </div>
      <section className="card stack" aria-label="Jelvényeim">
        <h2 className="h3">Jelvényeim</h2>
        <p className="muted">A jelvények csak díszek. Az eszközeid mindig használhatók, jelvény nélkül is.</p>
        {badges.length ? (
          <div className="chips">
            {badges
              .map((id) => BADGES[id])
              .filter(Boolean)
              .map((b) => (
                <span key={b.id} className="chip good badge-chip">
                  {b.art ? <img src={b.art} alt="" /> : <Glyph name={b.icon} size={22} />} {b.name}
                </span>
              ))}
          </div>
        ) : (
          <p className="muted">Még nincs jelvényed.</p>
        )}
      </section>
      <section className="card stack">
        <h2 className="h3">A hősök módszere</h2>
        <ul className="routine">
          {ROUTINE.map((r) => (
            <li key={r.label}>
              <Icon name={r.icon} />
              <span>
                <strong>{r.label}:</strong> {r.text}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Favourites({ go, adventures }) {
  const { state } = useStore();
  const list = state.favourites.map((id) => adventures.find((a) => a.id === id)).filter(Boolean);
  if (!list.length) return <div className="card">Itt találod majd a kedvenc kalandjaidat.</div>;
  return (
    <div className="stack">
      {list.map((a) => (
        <AdventureCard key={a.id} adv={a} go={go} />
      ))}
    </div>
  );
}

// ---------- strategy demonstration ----------
// A worked example shows the answers of one story, so it stays locked until the child has completed that adventure:
// it must not give anything away before the first attempt. The tools and their steps are open from the start. Examples
// that are not tied to a story (the help list) are always shown.
const EXAMPLE_FROM = { goggles: 'heroes.energymag', glove: 'heroes.energymag', crystal: 'heroes.energymag' };

// Each tool shows its three authored steps one at a time. Where the energy-core story has matching material
// (the evidence sentence, the event order, the glossary) it is shown as a worked example.
export function ToolDemo({ id, go }) {
  const { state } = useStore();
  const tool = TOOLS.find((t) => t.id === id);
  const [step, setStep] = useState(0);
  if (!tool) return null;
  const adv = findAdventure('heroes.energymag', []);
  const earned = state.badges.includes(tool.id);

  return (
    <div className="page narrow stack">
      <button type="button" className="back" onClick={() => go({ name: 'back' })}>
        <Icon name="arrow_back" /> Eszközeim
      </button>
      <div className="tool-head">
        <img className="tool-img big" src={tool.src} alt="" />
        <div className="stack tight">
          <h1 className="h1">{tool.name}</h1>
          <p className="lead">{tool.explain}</p>
        </div>
      </div>

      <section className="card stack" aria-label="Lépések">
        <span className="eyebrow">{tool.strategy}</span>
        <ol className="steps">
          {tool.steps.map((s, i) => (
            <li
              key={s}
              className={i === step ? 'cur' : i < step ? 'done' : 'todo'}
              aria-current={i === step ? 'step' : undefined}
            >
              <span className="num">{i < step ? <Icon name="check" /> : i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <div className="row">
          {step < tool.steps.length - 1 ? (
            <Btn iconAfter="arrow_forward" onClick={() => setStep(step + 1)}>
              Következő lépés
            </Btn>
          ) : (
            <Btn kind="ghost" icon="replay" onClick={() => setStep(0)}>
              Újra az elejéről
            </Btn>
          )}
          {step > 0 ? (
            <Btn kind="ghost" icon="arrow_back" onClick={() => setStep(step - 1)}>
              Előző lépés
            </Btn>
          ) : null}
        </div>
      </section>

      <Example tool={tool} adv={adv} done={(state.history[EXAMPLE_FROM[tool.id]]?.completions || 0) > 0} />
    </div>
  );
}

function Example({ tool, adv, done }) {
  if (EXAMPLE_FROM[tool.id] && !done)
    return (
      <section className="stack" aria-label="Példa">
        <h2 className="h2">Példa</h2>
        <div className="note soft" role="status">
          <Icon name="lock" />
          <span>
            <strong>Ez a példa még zárolva van.</strong> A példa „{adv.title}” című történet megoldását mutatná. Ezért
            addig zárolva van, amíg ezt a kalandot be nem fejezed: így nem árulja el a választ az első próbálkozás
            előtt. A módszer lépései már most használhatók.
          </span>
        </div>
      </section>
    );
  const ev = adv.steps.find((s) => s.id === 'ev1');
  const sq = adv.steps.find((s) => s.id === 'sq1');
  const sec = sectionOf(adv, ev.passageId, ev.sectionId);
  let body = null;
  if (tool.id === 'goggles')
    body = (
      <>
        <p className="lead">Kérdés: {ev.prompt}</p>
        <article className="reading">
          <p className="read-text">
            {sec.sentences.map((s) => (
              <span key={s.id} className={s.id === ev.correctSentenceId ? 'mark' : ''}>
                {s.text}{' '}
              </span>
            ))}
          </p>
        </article>
        <p className="muted">A kiemelt mondat bizonyítja a választ.</p>
      </>
    );
  else if (tool.id === 'glove')
    body = (
      <ol className="seq-demo">
        {sq.correctOrder.map((id, i) => {
          const it = sq.items.find((x) => x.id === id);
          return (
            <li key={id} className="card">
              <span className="eyebrow">{sq.labels[i]}</span>
              <img className="seq-img" src={it.src} alt="" />
              <span>{it.text}</span>
            </li>
          );
        })}
      </ol>
    );
  else if (tool.id === 'crystal')
    body = (
      <div className="stack tight">
        {adv.glossary.map((g) => (
          <div key={g.key} className="card stack tight">
            <strong className="h3">{g.word}</strong>
            <span>{g.def}</span>
          </div>
        ))}
      </div>
    );
  else if (tool.id === 'compass')
    body = (
      <ul className="routine">
        {[
          'Kapok egy támpontot',
          'Újra elolvasom',
          'Újra meghallgatom',
          'Kisebb részekben haladok',
          'Tartok egy kis szünetet'
        ].map((t) => (
          <li key={t}>
            <Icon name="chevron_right" /> {t}
          </li>
        ))}
      </ul>
    );
  if (!body) return null;
  return (
    <section className="stack" aria-label="Példa">
      <h2 className="h2">
        {tool.id === 'compass' ? 'Így kérhetsz segítséget' : `Példa „${adv.title}” című történetből`}
      </h2>
      {tool.id === 'compass' ? (
        <p className="lead">Ha elakadsz, minden feladatban ezek közül választhatsz a Segítséget kérek gombbal:</p>
      ) : null}
      {body}
    </section>
  );
}

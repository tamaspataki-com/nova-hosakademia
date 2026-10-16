import { useState } from 'react';
import { useStore } from '../../app/store.jsx';
import { Btn, Icon, fmtTime } from '../../app/ui.jsx';

// Parent-written practice: a passage in sections, one question with options, a correct answer and an optional hint.
// Everything created here is labelled "Szülő készítette" in the child area. Nothing is generated or simulated.
function splitText(t) {
  const paras = t
    .trim()
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean);
  if (paras.length > 1) return paras;
  const sents = paras[0]?.match(/[^.!?…]+[.!?…]+["”»]?|[^.!?…]+$/g) || (paras[0] ? [paras[0]] : []);
  const n = Math.min(3, Math.max(1, Math.ceil(sents.length / 2)));
  const size = Math.ceil(sents.length / n) || 1;
  const out = [];
  for (let i = 0; i < sents.length; i += size)
    out.push(
      sents
        .slice(i, i + size)
        .map((x) => x.trim())
        .join(' ')
    );
  return out;
}

function validate(h) {
  if (!h.sections.map((x) => x.trim()).filter(Boolean).length)
    return 'Bontsd szakaszokra a szöveget, vagy adj hozzá egy szakaszt (2. lépés).';
  if (!h.question.trim()) return 'Írj be egy kérdést (3. lépés).';
  if (h.options.filter((o) => o.trim()).length < 2) return 'Adj meg legalább két válaszlehetőséget (4. lépés).';
  if (!(h.options[h.correct] || '').trim()) return 'A helyesnek jelölt válasz mezője üres (4. lépés).';
  return null;
}

export default function OwnText({ go }) {
  const { state, act } = useStore();
  const h = state.hw;
  const [msg, setMsg] = useState('');
  const [preview, setPreview] = useState(false);

  const secs = h.sections;
  const setSec = (i, v) => act.hw({ sections: secs.map((x, k) => (k === i ? v : x)) });
  const setOpt = (i, v) => act.hw({ options: h.options.map((x, k) => (k === i ? v : x)) });

  const split = () => {
    if (!h.text.trim()) return setMsg('Előbb illessz be egy szöveget.');
    act.hw({ sections: splitText(h.text) });
    setMsg('');
  };

  const built = () => ({
    sections: secs.map((x) => x.trim()).filter(Boolean),
    options: h.options.map((t, i) => ({ text: t.trim(), correct: i === h.correct })).filter((o) => o.text)
  });

  const save = () => {
    const err = validate(h);
    if (err) return setMsg(err);
    const b = built();
    act.hwSave({
      id: String(Date.now()),
      t: Date.now(),
      title: h.title.trim() || 'Saját szöveg',
      sections: b.sections,
      question: h.question.trim(),
      options: b.options,
      hint: h.hint.trim()
    });
    setPreview(false);
    setMsg('Elmentve. A gyerek a Felfedezésben találja meg „Szülő által készített szövegek” címen.');
  };

  return (
    <div className="stack">
      <section className="card stack">
        <h2 className="h3">Saját szöveg készítése</h2>
        <p className="muted">
          Írj vagy illessz be egy rövid szöveget, és adj hozzá egy kérdést. A szöveg „Szülő készítette” jelzéssel
          jelenik meg.
        </p>

        <label htmlFor="hw-title" className="eyebrow">
          1. Cím és szöveg
        </label>
        <input
          id="hw-title"
          className="field"
          placeholder="Cím (nem kötelező)"
          value={h.title}
          onChange={(e) => act.hw({ title: e.target.value })}
        />
        <textarea
          className="field"
          rows={5}
          aria-label="A szöveg"
          placeholder="Illeszd be a szöveget…"
          value={h.text}
          onChange={(e) => act.hw({ text: e.target.value })}
        />
        <div>
          <Btn kind="ghost" icon="content_cut" onClick={split}>
            Szakaszokra bontom
          </Btn>
        </div>

        <span className="eyebrow">2. Szakaszok</span>
        {secs.length ? (
          <div className="stack tight">
            {secs.map((s, i) => (
              <div key={i} className="row top">
                <textarea
                  className="field"
                  rows={3}
                  aria-label={`${i + 1}. szakasz`}
                  value={s}
                  onChange={(e) => setSec(i, e.target.value)}
                />
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`${i + 1}. szakasz törlése`}
                  onClick={() => act.hw({ sections: secs.filter((_, k) => k !== i) })}
                >
                  <Icon name="delete" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Még nincs szakasz.</p>
        )}
        <div>
          <Btn kind="ghost" icon="add" onClick={() => act.hw({ sections: [...secs, ''] })}>
            Szakasz hozzáadása
          </Btn>
        </div>

        <label htmlFor="hw-q" className="eyebrow">
          3. Kérdés
        </label>
        <input id="hw-q" className="field" value={h.question} onChange={(e) => act.hw({ question: e.target.value })} />

        <span className="eyebrow">4. Válaszlehetőségek (jelöld meg a helyeset)</span>
        <div className="stack tight" role="radiogroup" aria-label="Helyes válasz">
          {h.options.map((o, i) => (
            <div key={i} className="row">
              <button
                type="button"
                role="radio"
                aria-checked={h.correct === i}
                aria-label={`${i + 1}. válasz a helyes`}
                className={`radio ${h.correct === i ? 'on' : ''}`}
                onClick={() => act.hw({ correct: i })}
              >
                {h.correct === i ? <Icon name="check" /> : null}
              </button>
              <input
                className="field"
                aria-label={`${i + 1}. válaszlehetőség`}
                value={o}
                onChange={(e) => setOpt(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <label htmlFor="hw-hint" className="eyebrow">
          5. Támpont (nem kötelező)
        </label>
        <input
          id="hw-hint"
          className="field"
          placeholder="Ezt látja a gyerek, ha hibázik vagy támpontot kér."
          value={h.hint}
          onChange={(e) => act.hw({ hint: e.target.value })}
        />

        <div className="row">
          <Btn
            kind="ghost"
            icon="visibility"
            onClick={() => (validate(h) ? setMsg(validate(h)) : (setMsg(''), setPreview(!preview)))}
          >
            {preview ? 'Előnézet elrejtése' : 'Előnézet'}
          </Btn>
          <Btn icon="save" onClick={save}>
            Mentés
          </Btn>
          <Btn kind="ghost" onClick={() => (act.hwReset(), setMsg(''), setPreview(false))}>
            Újrakezdés
          </Btn>
        </div>
        {msg ? (
          <div className="note soft" role="status">
            <Icon name="info" /> {msg}
          </div>
        ) : null}

        {preview ? (
          <div className="stack" aria-label="Előnézet">
            <span className="eyebrow">Előnézet – Szülő készítette</span>
            {built().sections.map((s, i) => (
              <article key={i} className="reading">
                <p className="read-text">{s}</p>
              </article>
            ))}
            <strong className="h3">{h.question}</strong>
            {built().options.map((o, i) => (
              <div key={i} className={`option ${o.correct ? 'right' : ''}`}>
                <span className="option-text">{o.text}</span>
                {o.correct ? <Icon name="check_circle" fill /> : null}
              </div>
            ))}
            {h.hint.trim() ? (
              <div className="note hint">
                <Icon name="lightbulb" /> {h.hint}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="card stack">
        <h2 className="h3">Mentett szövegek</h2>
        {state.hwSaved.length ? (
          <ul className="obs-list">
            {state.hwSaved.map((x) => (
              <li key={x.id} className="obs">
                <div className="row between">
                  <strong>{x.title}</strong>
                  <span className="muted">{fmtTime(x.t)}</span>
                </div>
                <span className="muted">
                  {x.sections.length} szakasz · kérdés: {x.question}
                </span>
                <div className="row">
                  <Btn kind="ghost" icon="play_arrow" onClick={() => go({ name: 'adventure', id: `custom.${x.id}` })}>
                    Megnyitom
                  </Btn>
                  <Btn kind="ghost" icon="delete" onClick={() => act.hwDelete(x.id)}>
                    Törlés
                  </Btn>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Még nincs mentett szöveg.</p>
        )}
      </section>
    </div>
  );
}

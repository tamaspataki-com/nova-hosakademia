import { useState } from 'react';
import { useStore } from '../../app/store.jsx';
import { Btn, Icon, Chip, fmtTime } from '../../app/ui.jsx';
import { ATYPE, COMPLETION, MODE_SHORT, completed, count, groupByTypeAndMode } from '../../app/observations.js';

const NOTE_TAGS = ['Elterelődött a figyelme', 'Fáradt volt', 'Megszakítás történt', 'Jól ment'];
const yn = (b) => (b ? 'igen' : 'nem');
const METHOD = {
  'self-reported': 'A gyerek saját bejelentése szerint elmesélte (a minőséget nem értékeltük)',
  typed: 'Leírta (ezen az eszközön mentve)',
  'adult-observed': 'Felnőtt jelölte'
};
const LISTEN = {
  completed: 'Lejátszás befejeződött (az eszköz jelezte)',
  paused: 'Lejátszás szüneteltetve (a hely megmaradt)',
  interrupted: 'Lejátszás megszakadt',
  unknown: 'A lejátszás végét az eszköz nem jelezte',
  error: 'Lejátszási hiba',
  'self-reported': 'A gyerek jelezte, hogy végzett (saját bejelentés)',
  'not-played': 'Nem játszotta le'
};
const OBS_LABEL = {
  independent: 'Önállóan',
  supported: 'Segítséggel',
  notMentioned: 'Most nem említette',
  notObserved: 'Nem figyeltem meg'
};

export default function Observations({ adventures }) {
  const { state } = useStore();
  const list = completed(state.events);
  const groups = groupByTypeAndMode(list);
  const recent = [...list].reverse().slice(0, 40);
  const titleOf = (e) => {
    const adv = adventures.find((a) => a.id === e.adv);
    return { adv: adv?.title || e.adv, step: adv?.steps.find((s) => s.id === e.activity)?.title || e.activity };
  };

  return (
    <div className="stack">
      <section className="card stack tight" aria-label="Önálló ellenőrzés">
        <h2 className="h3">Önálló ellenőrzés</h2>
        <p>Új ellenőrző szövegek előkészületben.</p>
        <p className="muted">
          Az ellenőrzéshez külön, friss szövegek kellenek; az éppen gyakorolt történetből nem készül ellenőrzés.
        </p>
      </section>

      {!state.events.length ? (
        <div className="card">
          <Icon name="visibility" /> A gyakorlások után itt jelennek meg a megfigyelések.
        </div>
      ) : (
        <>
          <section className="card stack" aria-label="Összegzés">
            <h2 className="h3">Összegzés</h2>
            <div className="stats">
              <Stat n={count(state.events, 'adventure_started')} label="elindított kaland" />
              <Stat n={count(state.events, 'adventure_completed')} label="befejezett kaland" />
              <Stat n={list.length} label="befejezett feladat" />
              <Stat n={count(state.events, 'break_started')} label="szünet" />
            </div>
          </section>

          <section className="card stack" aria-label="Feladattípusok és módok szerint">
            <h2 className="h3">Feladattípusok és módok szerint</h2>
            <p className="muted">
              A feladattípusok és a módok külön szerepelnek, mert egyetlen szám nem mutatja meg, mi segít és mi nehéz.
            </p>
            <p className="muted">
              Ismételt szövegnél a jobb eredmény a szöveg ismerősségét is jelezheti, ezért nem tekintjük fejlődésnek.
              Ismeretlen szövegen való összehasonlításhoz új, ellenőrző szövegek kellenek. A „Későbbi felidézés” nem
              szabványosított memóriateszt.
            </p>
            {groups.length ? (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Feladat</th>
                      <th>Mód</th>
                      <th>Db</th>
                      <th>Első válasz helyes</th>
                      <th>Önállóan</th>
                      <th>Támogatással</th>
                      <th>Vezetett megoldás</th>
                      <th>Ismételt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((g) => (
                      <tr key={g.atype + g.mode}>
                        <td>{ATYPE[g.atype] || g.atype}</td>
                        <td>{MODE_SHORT[g.mode] || '–'}</td>
                        <td>{g.n}</td>
                        <td>{g.atype === 'retell' ? '–' : `${g.firstCorrect}/${g.scored}`}</td>
                        <td>{g.independent}</td>
                        <td>{g.supported}</td>
                        <td>{g.guided}</td>
                        <td>{g.repeat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="muted">Még nincs befejezett feladat.</p>
            )}
          </section>

          <section className="card stack" aria-label="Legutóbbi feladatok">
            <h2 className="h3">Legutóbbi feladatok</h2>
            <ul className="obs-list">
              {recent.map((e, i) => {
                const t = titleOf(e);
                const rt =
                  e.atype === 'retell' ? state.retells.find((r) => r.adv === e.adv && r.step === e.activity) : null;
                return (
                  <li key={i} className="obs">
                    <div className="row between">
                      <strong>
                        {t.adv} – {t.step}
                      </strong>
                      <span className="muted">{fmtTime(e.t)}</span>
                    </div>
                    <div className="chips">
                      <Chip>{ATYPE[e.atype] || e.atype}</Chip>
                      <Chip>{MODE_SHORT[e.mode] || '–'}</Chip>
                      <Chip tone={e.repeat ? 'dim' : ''}>{e.repeat ? 'Ismételt tartalom' : 'Új tartalom'}</Chip>
                      {e.completion ? (
                        <Chip tone={e.completion === 'independent' ? 'good' : 'gold'}>{COMPLETION[e.completion]}</Chip>
                      ) : null}
                      <Chip tone="dim">tartalom v{e.ver}</Chip>
                    </div>
                    <div className="muted">
                      {e.atype === 'retell' ? (
                        <>
                          {METHOD[e.method] || (rt?.kind === 'spoken' ? METHOD['adult-observed'] : METHOD.typed)}
                          {rt?.text ? <blockquote className="quote">{rt.text}</blockquote> : null}
                          {' · '}
                        </>
                      ) : (
                        <>
                          Első válasz helyes: {yn(e.firstCorrect)} · próbálkozás: {e.attempts ?? '–'} ·{' '}
                        </>
                      )}
                      támpont: {e.hints ?? 0} · újraolvasás: {e.rereads ?? 0} · újrahallgatás: {e.replays ?? 0} · szöveg
                      megnyitva: {yn(e.transcript)}
                      {e.shorter ? ' · rövidebb rész: igen' : ''}
                      {e.definitions ? ` · szómagyarázat: ${e.definitions}` : ''}
                      {e.retellPrompts ? ' · segítő kérdések: igen' : ''}
                      {e.guidedPlacement ? ' · vezetett elhelyezés: igen' : ''}
                      {e.intervening
                        ? ` · közbeeső segítség: újraolvasás ${e.intervening.passage_reread}, újrahallgatás ${e.intervening.audio_replayed}, segítő kérdés ${e.intervening.retell_prompts_opened}, rövidebb rész ${e.intervening.shorter_section_used}`
                        : ''}
                      {e.length ? ` · szöveghossz: ${e.length} mondat` : ''}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}

      <Extra adventures={adventures} />
      <Notes />
      <Legacy />
    </div>
  );
}

const Stat = ({ n, label }) => (
  <div className="stat">
    <strong>{n}</strong>
    <span className="muted">{label}</span>
  </div>
);

function Notes() {
  const { state, act } = useStore();
  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);
  const add = () => {
    if (!text.trim() && !tags.length) return;
    act.addNote({ t: Date.now(), text: text.trim(), tags });
    setText('');
    setTags([]);
  };
  return (
    <section className="card stack" aria-label="Megjegyzések">
      <h2 className="h3">Megjegyzések</h2>
      <div className="chips" role="group" aria-label="Címkék">
        {NOTE_TAGS.map((t) => (
          <button
            key={t}
            type="button"
            className={`pill ${tags.includes(t) ? 'on' : ''}`}
            aria-pressed={tags.includes(t)}
            onClick={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])}
          >
            {t}
          </button>
        ))}
      </div>
      <label htmlFor="note" className="sr-only">
        Megjegyzés
      </label>
      <textarea
        id="note"
        className="field"
        rows={2}
        value={text}
        placeholder="Megjegyzés…"
        onChange={(e) => setText(e.target.value)}
      />
      <div>
        <Btn kind="ghost" icon="add" onClick={add}>
          Megjegyzés mentése
        </Btn>
      </div>
      {state.notes.length ? (
        <ul className="obs-list">
          {state.notes.map((n) => (
            <li key={n.t} className="obs">
              <div className="row between">
                <span className="muted">{fmtTime(n.t)}</span>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Megjegyzés törlése"
                  onClick={() => act.deleteNote(n.t)}
                >
                  <Icon name="delete" />
                </button>
              </div>
              {n.tags?.length ? (
                <div className="chips">
                  {n.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              ) : null}
              {n.text ? <p>{n.text}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

// Activity recorded by the earlier single-file prototype, kept so nothing a child did is lost.
function Legacy() {
  const { state } = useStore();
  const l = state.legacy;
  if (!l || (!l.attempts.length && !l.events.length && !l.retell && !l.droppedPractice)) return null;
  const MODE = { read: 'Olvasás', listen: 'Hallgatás', both: 'Olvasás és hallgatás' };
  return (
    <section className="card stack" aria-label="Korábbi bejegyzések">
      <h2 className="h3">Korábbi bejegyzések</h2>
      <p className="muted">
        Az alkalmazás előző változatában rögzített gyakorlások ({l.attempts.length} feladat, {l.events.length} esemény).
        {l.droppedPractice
          ? ' Egy megkezdett napi gyakorlás nem vihető át az új felépítésbe; az eredményei itt láthatók.'
          : ''}
      </p>
      {l.retell ? (
        <blockquote className="quote">
          Korábbi elmesélés ({l.retell.kind === 'spoken' ? 'elmondta' : 'leírta'}): {l.retell.text}
        </blockquote>
      ) : null}
      {l.attempts.length ? (
        <details>
          <summary>Korábbi feladatok ({l.attempts.length})</summary>
          <ul className="obs-list">
            {[...l.attempts]
              .reverse()
              .slice(0, 100)
              .map((a, i) => (
                <li key={i} className="obs">
                  <strong>{a.title}</strong> <span className="muted">{fmtTime(a.t)}</span>
                  <div className="muted">
                    {MODE[a.mode] || a.mode} · első válasz helyes: {yn(a.first)} · támpont: {a.hints} · újraolvasás:{' '}
                    {a.rereads} · újrahallgatás: {a.replays}
                  </div>
                </li>
              ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

// Listening, retelling observations and the child's reflections – all taken from recorded events.
function Extra({ adventures }) {
  const { state } = useStore();
  const ev = state.events;
  const passages = ev.filter((e) => e.type === 'passage_completed' && e.listen);
  const pauses = ev.filter((e) => e.type === 'audio_paused');
  const kept = pauses.filter((e) => e.positionKept).length;
  const restarted = ev.filter((e) => e.type === 'audio_replayed' && e.fromPause).length;
  const obs = ev
    .filter((e) => e.type === 'retell_observed')
    .slice(-5)
    .reverse();
  const stepOf = (e) => adventures.find((a) => a.id === e.adv)?.steps.find((s) => s.id === e.activity);
  // A personal reflection (`private` step, e.g. „Egy kis lépés nálad”) is never shown to the parent: only that it was done.
  const reflAll = ev.filter((e) => e.type === 'reflection_saved' && e.choices);
  const refl = reflAll
    .filter((e) => !stepOf(e)?.private)
    .slice(-5)
    .reverse();
  const privateDone = reflAll.filter((e) => stepOf(e)?.private).length;
  const counts = passages.reduce((m, e) => ((m[e.listen] = (m[e.listen] || 0) + 1), m), {});
  const REFL = (e) => {
    const step = stepOf(e);
    return e.choices.map((id) => step?.options?.find((o) => o.id === id)?.text || id);
  };
  return (
    <>
      {passages.length || pauses.length ? (
        <section className="card stack" aria-label="Hallgatás">
          <h2 className="h3">Hallgatás</h2>
          <p className="muted">
            A „befejeződött” csak akkor szerepel, ha az eszköz jelezte a lejátszás végét. Ha nem jelezte, a gyerek saját
            bejelentése külön szerepel.
          </p>
          <ul className="plain-list">
            {Object.entries(counts).map(([k, n]) => (
              <li key={k}>
                {LISTEN[k] || k}: <strong>{n}</strong>
              </li>
            ))}
            {pauses.length ? (
              <li>
                Szünetek: <strong>{pauses.length}</strong> – folytatható hellyel: {kept}, ismételt lejátszás az
                elejéről: {restarted}
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}

      {obs.length ? (
        <section className="card stack" aria-label="Elmesélés megfigyelése">
          <h2 className="h3">Elmesélés – felnőtt megfigyelése</h2>
          <p className="muted">Nem pontszám: az összes elemet a megfigyelő jelölte, a gyerek nem látja.</p>
          {obs.map((e, i) => (
            <div key={i} className="obs">
              <span className="muted">{fmtTime(e.t)}</span>
              <ul className="plain-list">
                {Object.entries(e.items).map(([id, val]) => (
                  <li key={id}>
                    {stepOf(e)?.adultChecklist?.find((x) => x.id === id)?.text || id}:{' '}
                    <strong>{OBS_LABEL[val] || val}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      {privateDone ? (
        <p className="muted">
          Személyes visszatekintés (a gyerek saját életéről): {privateDone}× kitöltve. A válasz szándékosan nem látható.
        </p>
      ) : null}

      {refl.length ? (
        <section className="card stack" aria-label="Visszajelzés">
          <h2 className="h3">Amit a gyerek segítőnek érzett</h2>
          <p className="muted">Ez a gyerek saját benyomása, nem annak mérése, hogy melyik módszer valóban segít.</p>
          {refl.map((e, i) => (
            <div key={i} className="obs">
              <span className="muted">{fmtTime(e.t)}</span>
              <div>{REFL(e).join(' · ')}</div>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}

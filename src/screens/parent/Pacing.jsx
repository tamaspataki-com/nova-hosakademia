import { useEffect, useState } from 'react';
import { useStore } from '../../app/store.jsx';
import { Btn, Icon } from '../../app/ui.jsx';
import { findAdventure } from '../../content/index.js';
import { JOURNEY, access, isDay, journeyCurrent } from '../../content/journey.js';
import { PACING_NOTE, fmtDay, whenText } from '../../app/access.js';

// Napi ütemezés. Shown only inside the Szülői tér, which is behind the parent PIN (a PIN has to be set first).
// A new journey adventure opens one calendar day after the previous one was completed. Here the parent sees the next
// adventure and the day it opens, can change that day, or open it now. Everything is stored on this device.
export default function Pacing() {
  const { state, act, today } = useStore();
  const currentId = journeyCurrent(state);
  const current = currentId ? findAdventure(currentId, []) : null;
  const a = currentId ? access(state, currentId, today) : null;
  const saved = currentId ? state.pacing.unlocks[currentId] || '' : '';
  const [day, setDay] = useState(saved || today);
  const [msg, setMsg] = useState('');
  useEffect(() => setDay(saved || today), [saved, today, currentId]);

  const save = () => {
    if (!isDay(day)) return setMsg('Adj meg egy érvényes dátumot.');
    act.unlockDay(currentId, day);
    act.log('unlock_day_set', current, { day, by: 'parent' });
    setMsg(`Elmentve: ${fmtDay(day)}`);
  };
  const now = () => {
    act.unlockDay(currentId, today);
    act.log('unlock_now', current, { day: today, by: 'parent' });
    setDay(today);
    setMsg('Feloldva: a kaland most elérhető.');
  };

  return (
    <div className="stack">
      <p className="lead">{PACING_NOTE}</p>
      <div className="note soft">
        <Icon name="info" />
        <span>
          Az időpontot az eszköz órája adja, ezért ez ütemezési segítség, nem megkerülhetetlen szülői zár: az óra
          átállításával kijátszható. A befejezett kalandok és a gyakorló szövegek mindig elérhetők.
        </span>
      </div>

      {current ? (
        <section className="card stack" aria-label="A következő kaland">
          <span className="eyebrow">A következő új kaland</span>
          <h2 className="h2">{current.title}</h2>
          <p className="lead" role="status">
            {a.open
              ? 'Most elérhető.'
              : `Ekkor nyílik meg: ${fmtDay(a.day)} (${whenText(a.day, today) === 'holnap' ? 'holnap' : 'később'})`}
          </p>
          <label htmlFor="unlock-day" className="eyebrow">
            Megnyílik ekkor
          </label>
          <input
            id="unlock-day"
            className="field"
            type="date"
            value={day}
            onChange={(e) => {
              setDay(e.target.value);
              setMsg('');
            }}
          />
          <div className="row">
            <Btn onClick={save} disabled={!isDay(day)}>
              Dátum mentése
            </Btn>
            <Btn kind="ghost" icon="lock_open" onClick={now}>
              Feloldás most
            </Btn>
          </div>
          {msg ? (
            <div className="note good" role="status">
              <Icon name="check_circle" /> {msg}
            </div>
          ) : null}
          <p className="muted">
            Ha a kalandot a megadott nap előtt oldod fel, a befejezése után a következő kaland a rákövetkező naptári
            napon nyílik meg.
          </p>
        </section>
      ) : (
        <div className="card">
          <Icon name="verified" /> Minden jelenlegi kaland kész: nincs újabb kaland, amit ütemezni lehetne.
        </div>
      )}

      <section className="stack tight" aria-label="Befejezési napok">
        <h2 className="h3">Az ütemezett kalandok</h2>
        {JOURNEY.map((id, i) => {
          const adv = findAdventure(id, []);
          const done = (state.history[id]?.completions || 0) > 0;
          const when = state.pacing.completed[id];
          return (
            <div key={id} className="row between card">
              <span>
                {i + 1}. {adv?.title}
              </span>
              <span className="muted">
                {done
                  ? when
                    ? `Befejezve: ${fmtDay(when)}`
                    : 'Befejezve (dátum nélkül)'
                  : id === currentId
                    ? 'Következő'
                    : 'Később'}
              </span>
            </div>
          );
        })}
      </section>
    </div>
  );
}

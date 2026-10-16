import { useState } from 'react';
import { useStore } from '../../app/store.jsx';
import { Btn, Icon } from '../../app/ui.jsx';
import { useVoiceReady } from '../../app/audio.js';
import { LEVELS } from '../../content/index.js';

const SIZES = [
  [18, 'Kisebb'],
  [22, 'Alap'],
  [26, 'Nagyobb']
];
const RATES = [
  [0.8, 'Lassabb'],
  [1, 'Alap'],
  [1.2, 'Gyorsabb']
];

export default function Settings({ go }) {
  const { state, act } = useStore();
  const s = state.settings;
  const voiceReady = useVoiceReady();
  const [confirm, setConfirm] = useState(false);

  const Toggle = ({ label, text, on, onChange }) => (
    <div className="setting row between">
      <div className="stack tight">
        <strong>{label}</strong>
        <span className="muted">{text}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={`switch ${on ? 'on' : ''}`}
        onClick={() => onChange(!on)}
      >
        <i />
      </button>
    </div>
  );

  return (
    <div className="stack">
      <section className="card stack">
        <h2 className="h3">A gyerek neve</h2>
        <label htmlFor="name" className="sr-only">
          Megjelenített név
        </label>
        <input
          id="name"
          className="field"
          value={s.name}
          maxLength={24}
          onChange={(e) => act.settings({ name: e.target.value })}
        />
      </section>

      <section className="card stack">
        <h2 className="h3">Szülői PIN</h2>
        <p>{state.pinCode ? 'A szülői PIN be van állítva.' : 'A szülői PIN még nincs beállítva.'}</p>
        <p className="muted">
          A PIN védi a Szülői teret és az elmesélés felnőtt megfigyelését.{' '}
          {state.pinCode ? '' : 'Amíg nincs beállítva, ezek nem védettek.'}
        </p>
      </section>

      <section className="card stack">
        <h2 className="h3">Szövegméret</h2>
        <div className="chips" role="group" aria-label="Szövegméret">
          {SIZES.map(([v, l]) => (
            <button
              key={v}
              type="button"
              className={`pill ${s.textSize === v ? 'on' : ''}`}
              aria-pressed={s.textSize === v}
              onClick={() => act.settings({ textSize: v })}
            >
              {l}
            </button>
          ))}
        </div>
        <article className="reading">
          <p className="read-text">Így néz ki az olvasandó szöveg ebben a méretben.</p>
        </article>
      </section>

      <section className="card stack">
        <h2 className="h3">Felolvasás sebessége</h2>
        {voiceReady === true ? (
          <div className="chips" role="group" aria-label="Felolvasás sebessége">
            {RATES.map(([v, l]) => (
              <button
                key={v}
                type="button"
                className={`pill ${s.rate === v ? 'on' : ''}`}
                aria-pressed={s.rate === v}
                onClick={() => act.settings({ rate: v })}
              >
                {l}
              </button>
            ))}
          </div>
        ) : (
          <p className="muted">
            <Icon name="volume_off" /> Ezen az eszközön most nincs elérhető magyar felolvasás, ezért a sebesség sem
            állítható.
          </p>
        )}
      </section>

      <section className="card stack">
        <h2 className="h3">Szint</h2>
        <p className="muted">
          A Mai kaland ezen a szinten vagy az alatt ajánl új szövegeket. A többi szöveg a Felfedezésben mindig elérhető.
        </p>
        <div className="chips" role="group" aria-label="Szint">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`pill ${s.level === l.id ? 'on' : ''}`}
              aria-pressed={s.level === l.id}
              onClick={() => act.settings({ level: l.id })}
            >
              {l.label} ({l.hint})
            </button>
          ))}
        </div>
      </section>

      <section className="card stack">
        <Toggle
          label="Hang"
          text="Rövid jelzőhangok a feladatoknál."
          on={s.sound}
          onChange={(v) => act.settings({ sound: v })}
        />
        <Toggle
          label="Csökkentett mozgás"
          text="Kikapcsolja az átmeneteket és a mozgó fényeket."
          on={s.reducedMotion}
          onChange={(v) => act.settings({ reducedMotion: v })}
        />
      </section>

      <section className="card stack">
        <h2 className="h3">Helyi adatok törlése</h2>
        <p className="muted">
          Törli az összes haladást, megfigyelést, megjegyzést és a mentett szövegeket erről az eszközről.
        </p>
        {confirm ? (
          <div className="note soft" role="alert">
            <Icon name="warning" />
            <div className="stack tight">
              <strong>Biztosan törlöd? Ez nem vonható vissza.</strong>
              <div className="row">
                <Btn
                  kind="danger"
                  onClick={() => {
                    act.wipe();
                    go({ name: 'welcome', replace: true });
                  }}
                >
                  Igen, mindent törlök
                </Btn>
                <Btn kind="ghost" onClick={() => setConfirm(false)}>
                  Mégsem
                </Btn>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Btn kind="ghost" icon="delete" onClick={() => setConfirm(true)}>
              Helyi adatok törlése
            </Btn>
          </div>
        )}
      </section>
    </div>
  );
}

import { useState } from 'react';
import { useStore } from '../app/store.jsx';
import { Btn, Icon } from '../app/ui.jsx';

const CHOICES = [
  ['quiet', 'Csendben pihenek', 'dark_mode'],
  ['breath', 'Lassan megérkezem', 'air'],
  ['move', 'Mozdulok egy kicsit', 'accessibility_new']
];
const INFO = {
  quiet: 'Nézd a bolygót és a csillagokat. Most nem kell semmit csinálnod. Ha készen állsz, kiléphetsz.',
  move: 'Állj fel, ha kényelmes. Nyújtózz egyet, engedd le a vállad, majd érezd a talpadat a talajon.',
  breath: 'Itt nincs feladat. Maradj, ameddig jólesik.'
};

// Optional quiet and movement. The adventure's state is stored with the run, so a break never loses it;
// "Vissza a kalandhoz" resumes exactly where the child stopped.
export default function Rest({ go, from, breath }) {
  const { state } = useStore();
  const [mode, setMode] = useState(breath ? 'breath' : null);
  const [paused, setPaused] = useState(false);

  const runs = Object.values(state.progress).sort((a, b) => b.startedAt - a.startedAt);
  const target = (from && state.progress[from] ? state.progress[from] : runs[0])?.id;
  const back = () => go(target ? { name: 'adventure', id: target } : { name: 'today' });

  return (
    <div className="rest">
      <img className="rest-bg" src="assets/observatory.webp" alt="" />
      <div className="rest-scrim" />
      <div className="rest-body stack center-text">
        <h1 className="h1">Pihenő</h1>
        {!mode ? (
          <div className="stack">
            <p className="lead">Itt nincs feladat. Válassz, amihez kedved van.</p>
            <div className="stack tight rest-choices">
              {CHOICES.map(([id, label, icon]) => (
                <button key={id} type="button" className="mode-card" onClick={() => setMode(id)}>
                  <Icon name={icon} size={30} /> <strong>{label}</strong>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="stack center-text">
            {mode === 'breath' ? <div className={`sphere ${paused ? 'paused' : ''}`} aria-hidden="true" /> : null}
            <p className="lead">{INFO[mode]}</p>
            <div className="row center">
              {mode === 'breath' ? (
                <Btn kind="ghost" icon={paused ? 'play_arrow' : 'pause'} onClick={() => setPaused(!paused)}>
                  {paused ? 'Folytatás' : 'Szünet'}
                </Btn>
              ) : null}
              <Btn kind="ghost" onClick={() => setMode(null)}>
                Másik pihenő
              </Btn>
            </div>
          </div>
        )}
        <Btn onClick={back} icon="arrow_back">
          Vissza a kalandhoz
        </Btn>
      </div>
    </div>
  );
}

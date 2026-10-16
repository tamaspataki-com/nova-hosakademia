import { useState } from 'react';
import { useStore } from '../app/store.jsx';
import { Btn, Icon } from '../app/ui.jsx';
import Observations from './parent/Observations.jsx';
import Settings from './parent/Settings.jsx';
import OwnText from './parent/OwnText.jsx';
import Content from './parent/Content.jsx';

const TABS = [
  ['obs', 'Megfigyelések', 'visibility'],
  ['settings', 'Beállítások', 'tune'],
  ['own', 'Saját szöveg', 'edit_note'],
  ['content', 'Tartalom', 'fact_check']
];

export default function Parent({ go, adventures, tab: tab0 = 'obs' }) {
  const { state, act } = useStore();
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState(tab0);
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');

  const submit = () => {
    if (pin.length !== 4) return setErr('A PIN 4 számjegyből áll.');
    if (!state.pinCode) {
      act.setPin(pin);
      setUnlocked(true);
    } else if (pin === state.pinCode) setUnlocked(true);
    else {
      setErr('Ez a PIN nem egyezik. Próbáld újra.');
      setPin('');
    }
  };

  if (!unlocked)
    return (
      <div className="page narrow stack">
        <h1 className="h1">Szülői tér</h1>
        {!state.pinCode ? <strong className="lead">A szülői PIN még nincs beállítva.</strong> : null}
        <p className="lead">
          {state.pinCode
            ? 'Add meg a PIN-kódot.'
            : 'Állíts be egy 4 számjegyű PIN-kódot. Ezzel védheted a szülői teret a gyerektől.'}
        </p>
        <label htmlFor="pin" className="sr-only">
          PIN-kód
        </label>
        <input
          id="pin"
          className="field pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
            setErr('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        {err ? (
          <div className="note soft" role="alert">
            <Icon name="info" /> {err}
          </div>
        ) : null}
        <div className="row">
          <Btn onClick={submit}>{state.pinCode ? 'Belépés' : 'PIN beállítása és belépés'}</Btn>
          <Btn kind="ghost" onClick={() => go({ name: 'today' })}>
            Vissza a gyerekfelülethez
          </Btn>
        </div>
      </div>
    );

  return (
    <div className="page stack">
      <div className="row between">
        <h1 className="h1">Szülői tér</h1>
        <Btn kind="ghost" icon="arrow_back" onClick={() => go({ name: 'today' })}>
          Vissza a gyerekfelülethez
        </Btn>
      </div>
      <div className="tabs" role="tablist">
        {TABS.map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`tab ${tab === id ? 'on' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon name={icon} /> {label}
          </button>
        ))}
      </div>
      {tab === 'obs' ? <Observations adventures={adventures} /> : null}
      {tab === 'settings' ? <Settings go={go} /> : null}
      {tab === 'own' ? <OwnText go={go} /> : null}
      {tab === 'content' ? <Content adventures={adventures} /> : null}
    </div>
  );
}

import { useState } from 'react';
import { useStore } from '../app/store.jsx';
import { Btn, Icon, Sheet } from '../app/ui.jsx';
import { Hints, supportOf } from './shared.jsx';

// Retelling. There is no automatic score: nothing here can honestly judge free speech or text.
// Completion methods are recorded as they really happened:
//   'self-reported'  – the child says they retold it (quality unassessed)
//   'typed'          – the child wrote it down (saved on this device)
//   'adult-observed' – an adult marked it (spoken) and/or filled in the observation checklist
// Opening the help questions counts as retelling support, never as a wrong answer.
const OBS = [
  ['independent', 'Önállóan'],
  ['supported', 'Segítséggel'],
  ['notMentioned', 'Most nem említette'],
  ['notObserved', 'Nem figyeltem meg']
];

export default function Retell({ api }) {
  const { adv, step, st, patch, log, run, act, next } = api;
  const [tab, setTab] = useState(st.kind || 'spoken');
  const [text, setText] = useState(st.text || '');
  const [openPrompts, setOpenPrompts] = useState(false);
  const [adult, setAdult] = useState(false);
  const hasPin = !!useStore().state.pinCode;
  const done = !!st.done;
  const checklist = step.adultChecklist;
  const labels = step.options || { spoken: 'Elmondom valakinek', write: 'Leírom' };

  const finish = (kind, method, body) => {
    patch({ done: true, kind, method, text: body || '' });
    act.retell({ t: Date.now(), adv: adv.id, step: step.id, kind, method, text: body || '' });
    log('retell_completed', { activity: step.id, kind, method, chars: body ? body.length : 0 });
    if (!st.logged) {
      patch({ logged: true });
      const sup = supportOf(adv, run, step, { ...st, promptsOpened: st.promptsOpened });
      log('activity_completed', {
        activity: step.id,
        atype: 'retell',
        objective: step.objective,
        mode: run.mode,
        repeat: !!run.repeat,
        hints: sup.hints,
        rereads: sup.rereads,
        replays: sup.replays,
        transcript: sup.transcript,
        shorter: sup.shorter,
        retellPrompts: sup.retellPrompts,
        method,
        completion: sup.used ? 'supported' : 'independent'
      });
    }
  };

  const togglePrompts = () => {
    const next = !openPrompts;
    setOpenPrompts(next);
    if (next && !st.promptsOpened) {
      patch({ promptsOpened: true });
      log('retell_prompts_opened', { activity: step.id });
    }
  };

  const questions = step.promptQuestions || step.guideQuestions;

  return (
    <div className="stack">
      <h2 className="h2">{step.heading || step.prompt}</h2>
      {step.heading ? <p className="lead">{step.prompt}</p> : null}

      {questions?.length ? (
        step.promptQuestions ? (
          <div className="card stack tight">
            <button type="button" className="disclosure" aria-expanded={openPrompts} onClick={togglePrompts}>
              <Icon name={openPrompts ? 'expand_less' : 'expand_more'} /> Segítő kérdések
            </button>
            {openPrompts ? (
              <ul className="plain-list">
                {questions.map((q) => (
                  <li key={q}>
                    <Icon name="chevron_right" /> {q}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <div className="card stack tight">
            <span className="eyebrow">Segítő kérdések, ha jólesik:</span>
            <ul className="plain-list">
              {questions.map((q) => (
                <li key={q}>
                  <Icon name="chevron_right" /> {q}
                </li>
              ))}
            </ul>
          </div>
        )
      ) : null}

      <div className="tabs" role="tablist" aria-label="Hogyan meséled el?">
        {[
          ['spoken', labels.spoken, 'record_voice_over'],
          ['write', labels.write, 'edit_note']
        ].map(([id, label, icon]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            className={`tab ${tab === id ? 'on' : ''}`}
            disabled={done}
            onClick={() => setTab(id)}
          >
            <Icon name={icon} /> {label}
          </button>
        ))}
      </div>

      {tab === 'spoken' ? (
        <div className="stack">
          {!checklist ? (
            <p className="lead">
              Mesélj el mindent egy felnőttnek vagy egy barátodnak. Ha végeztetek, a felnőtt jelölje meg itt.
            </p>
          ) : null}
          {done && st.kind === 'spoken' ? (
            <div className="note good" role="status">
              <Icon name="check_circle" />
              {checklist ? 'Elmesélve.' : 'Elmesélve – egy felnőtt megjelölte.'}
            </div>
          ) : checklist ? (
            <div>
              <Btn kind="ghost" icon="check" disabled={done} onClick={() => finish('spoken', 'self-reported')}>
                Elmeséltem
              </Btn>
            </div>
          ) : (
            <Btn
              kind="ghost"
              icon="supervisor_account"
              disabled={done}
              onClick={() => finish('spoken', 'adult-observed')}
            >
              Felnőtt: elmondta, megjelölöm
            </Btn>
          )}
        </div>
      ) : (
        <div className="stack">
          <label className="lead" htmlFor="retell-text">
            {checklist ? 'Írd le néhány mondatban:' : 'Írd le két-három mondatban:'}
          </label>
          <textarea
            id="retell-text"
            className="field"
            rows={4}
            value={text}
            placeholder={step.starter || ''}
            disabled={done}
            onChange={(e) => setText(e.target.value)}
          />
          {done && st.kind === 'write' ? (
            <div className="note good" role="status">
              <Icon name="check_circle" /> Elmentve ezen az eszközön.
            </div>
          ) : (
            <Btn
              kind="ghost"
              icon="save"
              disabled={!text.trim() || done}
              onClick={() => finish('write', 'typed', text.trim())}
            >
              Elmentem
            </Btn>
          )}
        </div>
      )}

      <Hints shown={st.shown} />

      {done && checklist ? (
        <div className="adult-box">
          <span className="muted">
            {hasPin ? (
              <>
                <Icon name="lock" /> Csak felnőttnek
              </>
            ) : (
              <>
                <Icon name="lock_open" /> Felnőttnek szánt rész. A szülői PIN még nincs beállítva, ezért nem védett.
              </>
            )}
          </span>
          <Btn kind="ghost" icon="supervisor_account" onClick={() => setAdult(true)}>
            {st.observation ? 'Megfigyelés módosítása' : 'Megfigyelés rögzítése'}
          </Btn>
        </div>
      ) : null}

      <Btn iconAfter="arrow_forward" disabled={!done} onClick={next}>
        Tovább
      </Btn>

      {adult ? (
        <AdultSheet
          step={step}
          initial={st.observation}
          onClose={() => setAdult(false)}
          onSave={(obs) => {
            patch({ observation: obs, observedBy: 'adult' });
            log('retell_observed', { activity: step.id, kind: st.kind, items: obs });
            setAdult(false);
          }}
        />
      ) : null}
    </div>
  );
}

// The adult checklist. It is behind the parent PIN when one is set, and no score is ever shown to the child.
function AdultSheet({ step, initial, onClose, onSave }) {
  const { state } = useStore();
  const [pin, setPin] = useState('');
  const [ok, setOk] = useState(!state.pinCode);
  const [err, setErr] = useState('');
  const [obs, setObs] = useState(initial || {});

  if (!ok)
    return (
      <Sheet title="Csak felnőttnek" onClose={onClose}>
        <div className="stack">
          <label htmlFor="adult-pin" className="lead">
            Add meg a szülői PIN-kódot.
          </label>
          <input
            id="adult-pin"
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
          />
          {err ? (
            <div className="note soft" role="alert">
              <Icon name="info" /> {err}
            </div>
          ) : null}
          <Btn onClick={() => (pin === state.pinCode ? setOk(true) : (setErr('Ez a PIN nem egyezik.'), setPin('')))}>
            Belépés
          </Btn>
        </div>
      </Sheet>
    );

  return (
    <Sheet title="Megfigyelés" wide onClose={onClose}>
      <div className="stack">
        {!state.pinCode ? (
          <div className="note soft" role="status">
            <Icon name="lock_open" />
            <div className="stack tight">
              <strong>A szülői PIN még nincs beállítva.</strong>
              <span>Ezért ez a rész nem védett. A PIN a Szülői térben állítható be.</span>
            </div>
          </div>
        ) : null}
        <p className="muted">Nem kell pontos megfogalmazás. Ezt az eredményt a gyerek nem látja.</p>
        {step.adultChecklist.map((item) => (
          <fieldset key={item.id} className="obs-item">
            <legend>{item.text}</legend>
            <div className="chips" role="radiogroup" aria-label={item.text}>
              {OBS.map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  role="radio"
                  aria-checked={obs[item.id] === val}
                  className={`pill ${obs[item.id] === val ? 'on' : ''}`}
                  onClick={() => setObs({ ...obs, [item.id]: val })}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        ))}
        <div className="row">
          <Btn icon="save" disabled={!Object.keys(obs).length} onClick={() => onSave(obs)}>
            Mentés
          </Btn>
          <Btn kind="ghost" onClick={onClose}>
            Mégsem
          </Btn>
        </div>
      </div>
    </Sheet>
  );
}

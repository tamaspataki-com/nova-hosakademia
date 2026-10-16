import { useState } from 'react';
import { Btn, Icon } from '../app/ui.jsx';
import { Hints, supportUsed } from './shared.jsx';

// Retelling: said aloud to an adult (who marks it) or typed and saved on this device.
// There is no automatic score: nothing here can honestly judge free speech or text.
export default function Retell({ api }) {
  const { adv, step, st, patch, log, run, act, next } = api;
  const [tab, setTab] = useState(st.kind || 'spoken');
  const [text, setText] = useState(st.text || '');
  const done = !!st.done;

  const finish = (kind, body) => {
    patch({ done: true, kind, text: body || '' });
    act.retell({ t: Date.now(), adv: adv.id, step: step.id, kind, text: body || '' });
    log('retell_completed', { activity: step.id, kind, chars: body ? body.length : 0 });
    if (!st.logged) {
      patch({ logged: true });
      log('activity_completed', {
        activity: step.id,
        atype: 'retell',
        objective: step.objective,
        mode: run.mode,
        repeat: !!run.repeat,
        hints: st.shown?.length || 0,
        rereads: st.rereads || 0,
        replays: st.replays || 0,
        transcript: !!st.transcript,
        completion: supportUsed(st) ? 'supported' : 'independent'
      });
    }
  };

  return (
    <div className="stack">
      <h2 className="h2">{step.prompt}</h2>
      {step.guideQuestions?.length ? (
        <div className="card stack tight">
          <span className="eyebrow">Segítő kérdések, ha jólesik:</span>
          <ul className="plain-list">
            {step.guideQuestions.map((q) => (
              <li key={q}>
                <Icon name="chevron_right" /> {q}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="tabs" role="tablist" aria-label="Hogyan meséled el?">
        {[
          ['spoken', 'Elmondom valakinek', 'record_voice_over'],
          ['write', 'Leírom', 'edit_note']
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
          <p className="lead">
            Mesélj el mindent egy felnőttnek vagy egy barátodnak. Ha végeztetek, a felnőtt jelölje meg itt.
          </p>
          {done && st.kind === 'spoken' ? (
            <div className="note good" role="status">
              <Icon name="check_circle" /> Elmesélve – egy felnőtt megjelölte.
            </div>
          ) : (
            <Btn kind="ghost" icon="supervisor_account" disabled={done} onClick={() => finish('spoken')}>
              Felnőtt: elmondta, megjelölöm
            </Btn>
          )}
        </div>
      ) : (
        <div className="stack">
          <label className="lead" htmlFor="retell-text">
            Írd le két-három mondatban:
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
            <Btn kind="ghost" icon="save" disabled={!text.trim() || done} onClick={() => finish('write', text.trim())}>
              Elmentem
            </Btn>
          )}
        </div>
      )}

      <Hints shown={st.shown} />

      <Btn iconAfter="arrow_forward" disabled={!done} onClick={next}>
        Tovább
      </Btn>
    </div>
  );
}

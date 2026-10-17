import { useEffect, useState } from 'react';
import { useStore, statusOf } from '../app/store.jsx';
import { Btn, Icon, Chip, Sheet, Glyph } from '../app/ui.jsx';
import { tone } from '../app/tone.js';
import OfflineNote from '../app/OfflineNote.jsx';
import { OFFLINE_UNAVAILABLE_TEXT, useOfflineStatus } from '../app/offline.js';
import {
  canPlay,
  canPlayAdventure,
  failureText,
  FAIL_TITLE,
  NO_AUDIO_TEXT,
  useSpeaker,
  useVoiceReady
} from '../app/audio.js';
import { ACTIVITIES, SCORED } from '../activities/index.jsx';
import { Reference, sourceSections } from '../activities/shared.jsx';
import { FORMATS, LEVELS, classLabel, MODE_NAMES, OBJECTIVE_NAMES, ROUTINE, sectionText } from '../content/index.js';

const MODE_INFO = [
  ['read', 'Olvasok', 'menu_book', 'A saját tempómban olvasom a szöveget.'],
  ['listen', 'Hallgatok', 'headphones', 'Meghallgatom a szöveget; a leírása rejtve marad.'],
  ['combined', 'Olvasok és hallgatok', 'auto_stories', 'Egyszerre látom és hallom a szöveget.']
];

const formatLabel = (f) => FORMATS.find((x) => x.id === f)?.label || f;

export default function Adventure({ adv, go }) {
  const { state, act } = useStore();
  const run = state.progress[adv.id];
  if (!run) return <Intro adv={adv} go={go} />;
  if (!run.mode) return <ModePicker adv={adv} run={run} go={go} />;
  return <Runner key={adv.id} adv={adv} run={run} go={go} />;
}

// ---------- intro ----------
function Intro({ adv, go }) {
  const { state, act } = useStore();
  const status = statusOf(state, adv.id);
  const fav = state.favourites.includes(adv.id);
  const level = LEVELS.find((l) => l.id === adv.level);
  const start = () => {
    act.start(adv, { restart: true });
    act.log('adventure_started', adv, { repeat: status === 'done', level: adv.level });
  };
  return (
    <div className="page narrow stack">
      <button type="button" className="back" onClick={() => go({ name: 'back' })}>
        <Icon name="arrow_back" /> Vissza
      </button>
      {adv.coverAsset ? <img className="cover" src={adv.coverAsset} alt={adv.coverAlt || ''} /> : null}
      {!adv.coverAsset && adv.coverIcon ? (
        <div className="cover cover-icon" aria-hidden="true">
          <Glyph name={adv.coverIcon} size={96} />
        </div>
      ) : null}
      <div className="chips">
        <Chip>{formatLabel(adv.format)}</Chip>
        {classLabel(adv) ? <Chip>{classLabel(adv)}</Chip> : null}
        {adv.custom ? <Chip tone="gold">Szülő készítette</Chip> : null}
        {level ? <Chip>{level.label}</Chip> : null}
      </div>
      <h1 className="h1">{adv.title}</h1>
      <p className="lead">{adv.intro || adv.description}</p>
      <OfflineNote adv={adv} />

      {status === 'done' ? (
        <div className="note soft">
          <Icon name="replay" />
          <span>Ezt a kalandot már teljesítetted. Most gyakorlásként játszod újra.</span>
        </div>
      ) : null}

      {adv.objectives?.length ? (
        <div className="stack tight">
          <span className="eyebrow">Ezt gyakorlod</span>
          <div className="chips">
            {adv.objectives.map((o) => (
              <Chip key={o}>{OBJECTIVE_NAMES[o]}</Chip>
            ))}
          </div>
        </div>
      ) : null}

      <div className="row">
        <Btn iconAfter="arrow_forward" onClick={start}>
          {status === 'done' ? 'Gyakorlás indítása' : 'Kaland indítása'}
        </Btn>
        <Btn
          kind="ghost"
          icon={fav ? 'favorite' : 'favorite_border'}
          aria-pressed={fav}
          onClick={() => act.fav(adv.id)}
        >
          {fav ? 'Kedvencekből kiveszem' : 'Kedvencekhez adom'}
        </Btn>
      </div>
    </div>
  );
}

// ---------- presentation mode ----------
function ModePicker({ adv, run, go }) {
  const { act } = useStore();
  const voiceReady = useVoiceReady();
  const audioOk = canPlayAdventure(voiceReady, adv);
  const offlineState = useOfflineStatus(adv); // 'unavailable': offline and the recordings are not on this device
  const noOffline = offlineState === 'unavailable';
  const choose = (mode) => {
    act.run(adv.id, { mode });
    act.log('mode_chosen', adv, { mode });
    window.scrollTo(0, 0);
  };
  return (
    <div className="page narrow stack">
      <button type="button" className="back" onClick={() => go({ name: 'back' })}>
        <Icon name="close" /> Ki
      </button>
      <h1 className="h1">{adv.modePrompt?.heading || 'Hogyan ismerkednél meg a történettel?'}</h1>
      {adv.modePrompt?.text ? <p className="lead">{adv.modePrompt.text}</p> : null}
      <div className="stack tight">
        {MODE_INFO.filter(([id]) => adv.modes.includes(id)).map(([id, label, icon, text]) => {
          const needs = id !== 'read';
          const off = needs && (!audioOk || noOffline);
          return (
            <button key={id} type="button" className="mode-card" disabled={off} onClick={() => choose(id)}>
              <Icon name={icon} size={32} />
              <span className="stack tight">
                <strong>{label}</strong>
                {adv.modePrompt ? null : <span className="muted">{text}</span>}
              </span>
            </button>
          );
        })}
      </div>
      {noOffline ? (
        <div className="note soft" role="alert">
          <Icon name="cloud_off" />
          <span>{OFFLINE_UNAVAILABLE_TEXT}</span>
        </div>
      ) : null}
      {!audioOk && !noOffline ? (
        <div className="note soft" role="status">
          <Icon name="volume_off" />
          <span>{voiceReady === null ? 'A felolvasás ellenőrzése folyamatban van…' : NO_AUDIO_TEXT}</span>
        </div>
      ) : null}
    </div>
  );
}

// ---------- the step player ----------
function Runner({ adv, run, go }) {
  const { state, act } = useStore();
  const settings = state.settings;
  const voiceReady = useVoiceReady();
  const speaker = useSpeaker(settings.rate);
  const [help, setHelp] = useState(false);
  const [ref, setRef] = useState(null); // { mark?, transcript? } – the story, opened for a reread
  const [word, setWord] = useState(null);
  const [fail, setFail] = useState(null); // a replay that could not be played: { reason, secs }

  const idx = Math.min(run.stepIndex, adv.steps.length - 1);
  const step = adv.steps[idx];
  const st = run.steps[step.id] || {};
  const listening = run.mode === 'listen' || run.mode === 'combined';
  const scored = SCORED.has(step.type);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [idx]);

  const patch = (p) => act.step(adv.id, step.id, p);
  const log = (type, data) => act.log(type, adv, data);

  const finish = () => {
    log('adventure_completed', { repeat: !!run.repeat, mode: run.mode, steps: adv.steps.length });
    act.complete(adv);
    tone(settings.sound, 'done');
    go({ name: 'complete', id: adv.id });
  };
  const next = () => {
    speaker.stop();
    // The method banner is a first-time reminder: it goes away once the first scored step is done.
    if (scored && settings.guideSeen < 1) act.settings({ guideSeen: 1 });
    if (run.stepIndex + 1 >= adv.steps.length) finish();
    else act.run(adv.id, { stepIndex: run.stepIndex + 1 });
  };
  const setMode = (mode, why) => {
    act.run(adv.id, { mode }); // the step and all progress stay exactly as they are
    log('mode_changed', { from: run.mode, to: mode, ...(why ? { why } : null) });
  };
  const openWord = (g) => {
    setWord(g);
    log('word_opened', { activity: step.id, word: g.key });
  };
  // This run's events so far (supports and definitions between steps are read from them).
  const events = state.events.filter((e) => e.adv === adv.id && e.t >= run.startedAt);

  const api = { adv, step, st, run, act, settings, voiceReady, speaker, patch, log, next, setMode, openWord, events };

  // ----- help -----
  const canHelp = scored || step.type === 'retell';
  const srcSecs = sourceSections(adv, step);
  // Replay plays the step's source section(s) in order – the recording of each one when it exists.
  const secClip = (sec) => `${adv.id}:${step.source?.passageId ?? adv.passages[0].id}:${sec.id}`;
  const playSections = (secs, i = 0) =>
    speaker.play(secClip(secs[i]), secs[i].narration ?? sectionText(secs[i]), (status, reason) => {
      if (status === 'completed' && i + 1 < secs.length) playSections(secs, i + 1);
      if (status === 'error') {
        log('audio_status', { activity: step.id, status: 'error', reason, online: navigator.onLine });
        setFail({ reason, secs });
      }
    });
  const unseen = (step.hints || []).filter((h) => !(st.shown || []).includes(h));
  const first = srcSecs[0];
  const passageSecs = step.type === 'passage' ? adv.passages.find((p) => p.id === step.passageId)?.sections : null;
  const thisSec = passageSecs?.find((s) => s.id === step.sectionId);

  const options = [];
  if (canHelp && !st.solved && unseen.length)
    options.push({
      key: 'hint',
      icon: 'lightbulb',
      label: 'Kapok egy támpontot',
      run() {
        patch({ shown: [...(st.shown || []), unseen[0]] });
        log('hint_opened', { activity: step.id, auto: false });
      }
    });
  if (canHelp && !st.solved && srcSecs.length)
    options.push({
      key: 'reread',
      icon: run.mode === 'listen' && !st.transcript ? 'subtitles' : 'menu_book',
      label: run.mode === 'listen' && !st.transcript ? 'Megmutatom a szöveget' : 'Újra elolvasom',
      run() {
        if (run.mode === 'listen') patch({ transcript: true });
        else patch({ rereads: (st.rereads || 0) + 1 });
        log('passage_reread', { activity: step.id, transcript: run.mode === 'listen' });
        setRef({});
      }
    });
  if (canHelp && !st.solved && listening && srcSecs.length && srcSecs.every((sec) => canPlay(voiceReady, secClip(sec))))
    options.push({
      key: 'replay',
      icon: 'headphones',
      label: 'Újra meghallgatom',
      run() {
        patch({ replays: (st.replays || 0) + 1 });
        log('audio_replayed', { activity: step.id });
        playSections(srcSecs);
      }
    });
  if (step.type === 'passage' && !st.chunked && thisSec && thisSec.sentences.length >= 2) {
    // Sections with authored shorter chunks offer "Rövidebb részt kérek"; others split into single sentences.
    const authored = !!thisSec.chunks?.length;
    options.push({
      key: 'chunk',
      icon: 'view_agenda',
      label: authored ? 'Rövidebb részt kérek' : 'Kisebb részekben haladok',
      run() {
        patch({ chunked: true, chunk: 0, listen: undefined, played: false });
        log('shorter_section_used', { activity: step.id, authored });
      }
    });
  }
  options.push({
    key: 'break',
    icon: 'self_improvement',
    label: 'Tartok egy kis szünetet',
    run() {
      speaker.stop();
      log('break_started', { activity: step.id });
      go({ name: 'rest', from: adv.id });
    }
  });

  const Activity = ACTIVITIES[step.type];
  const showGuide = scored && settings.guideSeen < 1;

  return (
    <div className="runner">
      <header className="runner-bar">
        <button type="button" className="btn btn-ghost small" onClick={() => go({ name: 'back' })}>
          <Icon name="close" /> Ki
        </button>
        <div className="runner-mid">
          <span className="runner-title">
            {idx + 1}/{adv.steps.length} · {step.title}
          </span>
          <div className="dots" aria-hidden="true">
            {adv.steps.map((s, i) => (
              <i key={s.id} className={i < idx ? 'done' : i === idx ? 'cur' : ''} />
            ))}
          </div>
        </div>
        <button type="button" className="btn btn-ghost small" onClick={() => setHelp(true)}>
          <Icon name="help" /> Segítséget kérek
        </button>
      </header>

      <div className="page narrow stack">
        {showGuide ? (
          <section className="card guide" aria-label="A hősök módszere">
            <div className="row between">
              <strong>Megállok → Átgondolom → Elmondom → Ellenőrzöm</strong>
              <button type="button" className="btn btn-ghost small" onClick={() => act.settings({ guideSeen: 1 })}>
                Értem
              </button>
            </div>
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
        ) : null}

        <Activity key={step.id} api={api} />
      </div>

      {help ? (
        <Sheet title="Segítséget kérek" onClose={() => setHelp(false)}>
          <div className="stack tight">
            {options.map((o) => (
              <button
                key={o.key}
                type="button"
                className="help-item"
                onClick={() => {
                  setHelp(false);
                  o.run();
                }}
              >
                <Icon name={o.icon} size={28} /> {o.label}
              </button>
            ))}
          </div>
        </Sheet>
      ) : null}

      {ref ? (
        <Sheet title="A történet" wide onClose={() => setRef(null)}>
          <Reference adv={adv} step={step} mark={ref.mark} glossary={adv.glossary} onWord={openWord} />
          <Btn kind="ghost" onClick={() => setRef(null)}>
            Vissza a feladathoz
          </Btn>
        </Sheet>
      ) : null}

      {fail ? (
        <Sheet title="Lejátszási hiba" onClose={() => setFail(null)}>
          <div className="stack">
            <strong>{FAIL_TITLE}</strong>
            <p className="lead">{failureText(fail.reason)}</p>
            <div className="row">
              <Btn
                icon="refresh"
                onClick={() => {
                  const secs = fail.secs;
                  setFail(null);
                  log('audio_retry', { activity: step.id, reason: fail.reason });
                  playSections(secs);
                }}
              >
                Újrapróbálom
              </Btn>
              <Btn
                kind="ghost"
                icon="menu_book"
                onClick={() => {
                  setFail(null);
                  setMode('read', 'audio_failed');
                  patch({ rereads: (st.rereads || 0) + 1 });
                  log('passage_reread', { activity: step.id, transcript: false });
                  setRef({});
                }}
              >
                Olvasással folytatom
              </Btn>
            </div>
          </div>
        </Sheet>
      ) : null}

      {word ? (
        <Sheet title="Szómagyarázat" onClose={() => setWord(null)}>
          <div className="stack tight">
            <strong className="h3">{word.word}</strong>
            <p className="lead">{word.def}</p>
          </div>
        </Sheet>
      ) : null}
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore, statusOf } from '../app/store.jsx';
import { Btn, Icon, Chip, Sheet, Glyph, useHeadingFocus } from '../app/ui.jsx';
import { AnnounceContext } from '../activities/live.jsx';
import { tone } from '../app/tone.js';
import OfflineNote from '../app/OfflineNote.jsx';
import { canOpen } from '../content/journey.js';
import { PACING_NOTE, journeyCurrent, lockText } from '../app/access.js';
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
import { Reference, sourceSections, wordsIn } from '../activities/shared.jsx';
import {
  FORMATS,
  LEVELS,
  classLabel,
  findAdventure,
  MODE_NAMES,
  OBJECTIVE_NAMES,
  ROUTINE,
  sectionText
} from '../content/index.js';

const MODE_INFO = [
  ['read', 'Olvasok', 'menu_book', 'A saját tempómban olvasom a szöveget.'],
  ['listen', 'Hallgatok', 'headphones', 'Meghallgatom a szöveget; a leírása rejtve marad.'],
  ['combined', 'Olvasok és hallgatok', 'auto_stories', 'Egyszerre látom és hallom a szöveget.']
];

const formatLabel = (f) => FORMATS.find((x) => x.id === f)?.label || f;

export default function Adventure({ adv, go }) {
  const { state, act, today } = useStore();
  const run = state.progress[adv.id];
  // A locked journey adventure (reached by a link, a bookmark or anything else) shows only what unlocks it.
  if (!run && !canOpen(state, adv.id, today)) return <Locked adv={adv} go={go} />;
  if (!run) return <Intro adv={adv} go={go} />;
  if (!run.mode) return <ModePicker adv={adv} run={run} go={go} />;
  return <Runner key={adv.id} adv={adv} run={run} go={go} />;
}

// ---------- locked ----------
function Locked({ adv, go }) {
  const { state, today } = useStore();
  const headRef = useHeadingFocus();
  const currentId = journeyCurrent(state);
  const current = currentId ? findAdventure(currentId, []) : null;
  // The button only leads somewhere that opens now; a date-locked "next adventure" cannot be opened either.
  const target = current && canOpen(state, current.id, today) ? current : null;
  return (
    <div className="page narrow stack">
      <button type="button" className="back" onClick={() => go({ name: 'back' })}>
        <Icon name="arrow_back" /> Vissza
      </button>
      <div className="cover cover-icon" aria-hidden="true">
        <Icon name="lock" size={72} />
      </div>
      <h1 className="h1" tabIndex={-1} ref={headRef}>
        {adv.title}
      </h1>
      <div className="note soft" role="status">
        <Icon name="lock" />
        <span>
          <strong>Ez a kaland még zárolva van.</strong> {lockText(state, adv.id, today)}
        </span>
      </div>
      <p className="muted">{PACING_NOTE}</p>
      <div className="row">
        {target ? (
          <Btn iconAfter="arrow_forward" onClick={() => go({ name: 'adventure', id: target.id, replace: true })}>
            Ugrás ide: {target.title}
          </Btn>
        ) : (
          <>
            <Btn onClick={() => go({ name: 'today' })}>Vissza a főoldalra</Btn>
            <Btn kind="ghost" onClick={() => go({ name: 'explore' })}>
              Kalandok újrajátszása
            </Btn>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- intro ----------
function Intro({ adv, go }) {
  const { state, act } = useStore();
  const status = statusOf(state, adv.id);
  const fav = state.favourites.includes(adv.id);
  const level = LEVELS.find((l) => l.id === adv.level);
  const headRef = useHeadingFocus();
  const [word, setWord] = useState(null);
  const introWords = adv.introGlossary ? wordsIn(adv.glossary, [{ text: adv.intro || '' }]) : [];
  const start = () => {
    act.start(adv, { restart: true });
    act.log('adventure_started', adv, { repeat: status === 'done', level: adv.level });
  };
  return (
    <div className="page narrow stack">
      <button type="button" className="back" onClick={() => go({ name: 'back' })}>
        <Icon name="arrow_back" /> Vissza
      </button>
      {adv.coverAsset ? (
        <img
          className="cover"
          src={adv.coverAsset}
          srcSet={adv.coverSet}
          sizes="(min-width: 700px) 700px, 100vw"
          alt={adv.coverAlt || ''}
        />
      ) : null}
      {!adv.coverAsset && adv.coverIcon ? (
        <div className="cover cover-icon" aria-hidden="true">
          <Glyph name={adv.coverIcon} size={96} />
        </div>
      ) : null}
      {adv.introVideo ? <IntroVideo video={adv.introVideo} poster={adv.coverAsset} /> : null}
      <div className="chips">
        <Chip>{formatLabel(adv.format)}</Chip>
        {classLabel(adv) ? <Chip>{classLabel(adv)}</Chip> : null}
        {adv.custom ? <Chip tone="gold">Szülő készítette</Chip> : null}
        {level ? <Chip>{level.label}</Chip> : null}
      </div>
      <h1 className="h1" tabIndex={-1} ref={headRef}>
        {adv.title}
      </h1>
      <p className="lead">{adv.intro || adv.description}</p>
      {introWords.length ? (
        <div className="stack tight" aria-label="Szómagyarázat">
          <span className="eyebrow">Szavak, ha kíváncsi vagy rájuk</span>
          <div className="chips">
            {introWords.map((g) => (
              <button key={g.key} type="button" className="pill" onClick={() => setWord(g)}>
                {g.word}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <OfflineNote adv={adv} />

      {status === 'done' ? (
        <div className="note soft">
          <Icon name="replay" />
          <span>Ezt a kalandot már teljesítetted. Most gyakorlásként játszod újra.</span>
        </div>
      ) : null}

      {adv.objectives?.length && !adv.hideObjectives ? (
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
          {status === 'done' ? 'Gyakorlás indítása' : adv.startLabel || 'Kaland indítása'}
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

// Optional introduction video. Only on the introduction (never inside an activity), only after a tap, never autoplaying,
// never beside narration (the introduction has none), and the page says it does not replace the story. The video file
// is loaded only when asked for (preload none) and no offline claim covers it.
function IntroVideo({ video, poster }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="stack tight" aria-label="Bevezető videó">
      {open ? (
        <video
          className="cover"
          src={video.src}
          poster={video.poster || poster}
          controls
          playsInline
          preload="none"
          aria-label="Bevezető videó"
        >
          {video.captions ? <track kind="captions" srcLang="hu" label="Magyar" src={video.captions} default /> : null}
        </video>
      ) : (
        <Btn kind="ghost" icon="play_circle" onClick={() => setOpen(true)}>
          Megnézem a bevezető videót
        </Btn>
      )}
      <span className="muted">
        A videó nem kötelező, és nem helyettesíti a történet elolvasását vagy meghallgatását.
      </span>
    </section>
  );
}

// ---------- presentation mode ----------
function ModePicker({ adv, run, go }) {
  const { act } = useStore();
  const headRef = useHeadingFocus();
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
      <h1 className="h1" tabIndex={-1} ref={headRef}>
        {adv.modePrompt?.heading || 'Hogyan ismerkednél meg a történettel?'}
      </h1>
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

  // ----- focus and announcements -----
  // Entering a step: the page starts at the top and focus goes to the step heading (tabindex -1), so the next Tab
  // reaches the first control of the step. Feedback is announced through one live region; nothing is read twice.
  const headRef = useRef(null);
  const [live, setLive] = useState('');
  const enteredAt = useRef(0);
  const lastIdx = useRef(-1);
  if (lastIdx.current !== idx) {
    lastIdx.current = idx;
    enteredAt.current = Date.now(); // set during render, before the step's children run their effects
  }
  const announce = useCallback((text) => {
    if (Date.now() - enteredAt.current < 700) return; // already on screen when the step opened: not news
    setLive('');
    setTimeout(() => setLive(text), 60);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
    headRef.current?.focus({ preventScroll: true });
    setLive('');
  }, [idx]);

  // After an answer: when the step becomes solved, focus moves on to "Tovább"; after a wrong submission, if the
  // button that was pressed went away or became disabled, focus goes to the first available answer control.
  const solvedNow = !!(st.solved || st.prediction || st.reflected || st.done);
  const seen = useRef({ id: step.id, solved: solvedNow, attempts: st.attempts || 0 });
  useEffect(() => {
    const prev = seen.current;
    const attempts = st.attempts || 0;
    if (prev.id === step.id) {
      const page = document.querySelector('.runner .page');
      if (solvedNow && !prev.solved) {
        [...(page?.querySelectorAll('button') || [])].find((b) => b.textContent.includes('Tovább'))?.focus();
      } else if (attempts > prev.attempts && !solvedNow) {
        const a = document.activeElement;
        if (!a || a === document.body || a.disabled || !document.contains(a)) {
          (page?.querySelector('.option:not(:disabled), .card-opt, button:not(:disabled)') || headRef.current)?.focus();
        }
      }
    }
    seen.current = { id: step.id, solved: solvedNow, attempts };
  }, [step.id, solvedNow, st.attempts]);

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

  // Information check / route: the current statement or decision and its own state (hints, story opened, replay), kept per statement.
  // The route task works the same way, one decision at a time.
  const items = step.statements || step.decisions;
  const stmt = items ? items[Math.min(st.index || 0, items.length - 1)] : null;
  const patchItem = (p) =>
    patch((cur) => ({ ...cur, items: { ...(cur.items || {}), [stmt.id]: { ...(cur.items?.[stmt.id] || {}), ...p } } }));
  // Opening the story again (a reread, or the transcript while listening) counts as support.
  const openStory = () => {
    if (run.mode === 'listen') patch({ transcript: true });
    else patch({ rereads: (st.rereads || 0) + 1 });
    if (stmt) patchItem({ opened: true });
    log('passage_reread', {
      activity: step.id,
      transcript: run.mode === 'listen',
      ...(stmt ? { statement: stmt.id } : null)
    });
    setRef({});
  };

  const api = {
    adv,
    step,
    st,
    run,
    act,
    settings,
    voiceReady,
    speaker,
    patch,
    log,
    next,
    setMode,
    openWord,
    openStory,
    events
  };

  // ----- help -----
  const canHelp = scored || step.type === 'retell' || step.type === 'prediction';
  // A section can be locked until another step has been submitted (the outcome of a prediction). Locked sections are
  // never read, heard, reread or replayed: not in the help panel, not in the reference, not as a passage step.
  const locked = (sec) => !!sec?.unlockAfter && !run.steps[sec.unlockAfter]?.prediction;
  const srcSecs = sourceSections(adv, step).filter((sec) => !locked(sec));
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
  const unseen = stmt
    ? [stmt.hint].filter((h) => !(st.items?.[stmt.id]?.shown || []).includes(h))
    : (step.hints || []).filter((h) => !(st.shown || []).includes(h));
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
        if (stmt) patchItem({ shown: [...(st.items?.[stmt.id]?.shown || []), unseen[0]] });
        else patch({ shown: [...(st.shown || []), unseen[0]] });
        log('hint_opened', { activity: step.id, auto: false, ...(stmt ? { statement: stmt.id } : null) });
      }
    });
  if (canHelp && !st.solved && srcSecs.length)
    options.push({
      key: 'reread',
      icon: run.mode === 'listen' && !st.transcript ? 'subtitles' : 'menu_book',
      label: run.mode === 'listen' && !st.transcript ? 'Megmutatom a szöveget' : 'Újra elolvasom',
      run: openStory
    });
  if (canHelp && !st.solved && step.quote)
    options.push({
      key: 'quote',
      icon: 'format_quote',
      label: 'Csak az üzenetet mutasd meg',
      run() {
        patch({ quoteShown: (st.quoteShown || 0) + 1 });
        log('instruction_quote_shown', { activity: step.id });
        setRef({ only: step.quote.sentenceId });
      }
    });
  if (canHelp && !st.solved && listening && srcSecs.length && srcSecs.every((sec) => canPlay(voiceReady, secClip(sec))))
    options.push({
      key: 'replay',
      icon: 'headphones',
      label: 'Újra meghallgatom',
      run() {
        patch({ replays: (st.replays || 0) + 1 });
        if (stmt) patchItem({ replayed: true });
        log('audio_replayed', { activity: step.id, ...(stmt ? { statement: stmt.id } : null) });
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
    label: 'Szünetet tartok',
    run() {
      speaker.stop();
      log('break_started', { activity: step.id });
      go({ name: 'rest', from: adv.id });
    }
  });

  const Activity = ACTIVITIES[step.type];
  // A saved position that points at a locked passage (e.g. a changed or damaged save) goes back to the step that
  // unlocks it, without showing anything of the passage.
  const blocked = step.type === 'passage' && locked(thisSec);
  const unlockIdx = blocked ? adv.steps.findIndex((s) => s.id === thisSec.unlockAfter) : -1;
  useEffect(() => {
    if (blocked && unlockIdx >= 0) act.run(adv.id, { stepIndex: unlockIdx });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocked, unlockIdx]);
  const showGuide = scored && settings.guideSeen < 1;

  return (
    <AnnounceContext.Provider value={announce}>
      <div className="runner">
        <div className="sr-only" role="status" aria-live="polite">
          {live}
        </div>
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
          <h1 className="sr-only" tabIndex={-1} ref={headRef} data-focus-fallback="">
            {idx + 1}/{adv.steps.length} · {step.title}
          </h1>
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

          {blocked ? null : <Activity key={step.id} api={api} />}
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
          <Sheet title={ref.only ? 'Az üzenet' : 'A történet'} wide onClose={() => setRef(null)}>
            <Reference
              adv={adv}
              step={step}
              mark={ref.mark}
              only={ref.only}
              allow={(sec) => !locked(sec)}
              glossary={adv.glossary}
              onWord={openWord}
            />
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
    </AnnounceContext.Provider>
  );
}

import { useEffect, useRef } from 'react';
import { sectionOf, sectionText } from '../content/index.js';
import { Btn, Icon } from '../app/ui.jsx';
import { canPlay, NO_AUDIO_TEXT } from '../app/audio.js';
import { SectionText, wordsIn } from './shared.jsx';

// One section of a passage, presented as the child chose: reading, listening or both.
//   read     – text at the child's own pace, nothing hides or advances on a timer
//   listen   – playback controls and a neutral picture; the transcript stays hidden until asked for
//   combined – text and narration together (no word highlighting: there is no timing data)
//
// Listening status is kept honestly. Playback ends as 'completed' (the engine said so), 'interrupted' (paused,
// replaced or left) or 'error'. When a device reports nothing at all within a generous time the status becomes
// 'unknown' – never "completed" – and the child can confirm "Befejeztem a hallgatást", which is recorded as
// self-reported.
export default function Passage({ api }) {
  const { adv, step, st, patch, log, run, speaker, voiceReady, openWord, next, setMode, settings } = api;
  const sec = sectionOf(adv, step.passageId, step.sectionId);
  const mode = run.mode;
  const listening = mode === 'listen' || mode === 'combined';
  const timer = useRef(null);

  // Shorter presentation: authored chunks when the section has them, otherwise one sentence at a time.
  const chunked = !!st.chunked;
  const parts = chunked
    ? sec.chunks
      ? sec.chunks.map((ids) => ids.map((id) => sec.sentences.find((s) => s.id === id)))
      : sec.sentences.map((s) => [s])
    : [sec.sentences];
  const idx = Math.min(st.chunk || 0, parts.length - 1);
  const last = idx >= parts.length - 1;
  const view = { ...sec, sentences: parts[idx] };

  const clipBase = `${adv.id}:${step.passageId}:${step.sectionId}`;
  const clip = chunked ? `${clipBase}:c${idx}` : clipBase;
  const text = chunked ? parts[idx].map((s) => s.text).join(' ') : (sec.narration ?? sectionText(sec));
  const audioOk = canPlay(voiceReady, clip);
  const playing = speaker.playing === clip;
  const paused = speaker.paused === clip; // paused with the position kept (recorded audio only)
  const status = st.listen; // undefined | playing | completed | interrupted | unknown | error
  const noAudio = listening && !audioOk;
  const unfinished = ['paused', 'interrupted', 'unknown', 'error'].includes(status);

  useEffect(() => {
    // Speech does not survive a reload or a break: a clip that was "playing" was interrupted.
    if (st.listen === 'playing') patch({ listen: 'interrupted' });
    if (!st.presented) {
      patch({ presented: true });
      log('passage_presented', { activity: step.id, mode });
    }
    return () => {
      clearTimeout(timer.current);
      speaker.stop(); // never carry narration into the next step
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = (s) => {
    patch({ listen: s });
    log('audio_status', { activity: step.id, status: s });
  };

  const armTimer = () => {
    // If the device reports neither an end nor an interruption, say "unknown" – do not pretend it finished.
    clearTimeout(timer.current);
    const ms = Math.max(2500, (text.length * 95) / (settings.rate || 1) + 1500);
    timer.current = setTimeout(() => setStatus('unknown'), ms);
  };

  const play = () => {
    if (st.played) {
      // Playing again after a pause that could not keep its position starts from the beginning: say so.
      const fromPause = st.stoppedBy === 'pause';
      patch((s) => ({ ...s, replays: (s.replays || 0) + 1 }));
      log('audio_replayed', { activity: step.id, fromPause, restartedFromStart: true });
    }
    patch({ played: true, listen: 'playing', stoppedBy: undefined });
    armTimer();
    speaker.play(clip, text, (s) => {
      clearTimeout(timer.current);
      setStatus(s);
    });
  };

  const pause = () => {
    clearTimeout(timer.current);
    const kept = speaker.pause(clip);
    patch({ stoppedBy: 'pause', positionKept: kept });
    log('audio_paused', { activity: step.id, positionKept: kept });
    if (kept) setStatus('paused'); // speech: the stop reports 'interrupted' itself
  };

  const resume = () => {
    if (!speaker.resume(clip)) return play();
    patch({ listen: 'playing' });
    log('audio_resumed', { activity: step.id, positionKept: true });
    armTimer();
  };

  const showTranscript = () => {
    patch({ transcript: true });
    log('transcript_opened', { activity: step.id });
  };

  const finish = (selfReported) => {
    speaker.stop();
    log('passage_completed', {
      activity: step.id,
      mode,
      listen: listening ? (selfReported ? 'self-reported' : (status ?? 'not-played')) : null,
      selfReported: !!selfReported,
      shorter: chunked,
      replays: st.replays || 0,
      transcript: !!st.transcript
    });
    next();
  };

  const showText = mode === 'read' || mode === 'combined' || st.transcript;
  const words = showText ? wordsIn(adv.glossary, view.sentences) : [];

  // The button that moves on. In listening-only mode it needs a finished (or self-confirmed) listening.
  const restart = st.played && st.stoppedBy === 'pause' && !st.positionKept;
  const audioBtn = (kind) =>
    playing ? (
      <Btn kind={kind} icon="pause" onClick={pause}>
        Szünet
      </Btn>
    ) : paused ? (
      <Btn kind={kind} icon="play_arrow" onClick={resume}>
        Folytatom
      </Btn>
    ) : (
      <Btn kind={kind} icon={restart ? 'replay' : st.played ? 'play_arrow' : 'play_arrow'} onClick={play}>
        {restart ? 'Újra az elejéről' : st.played ? 'Újra meghallgatom' : 'Meghallgatom'}
      </Btn>
    );

  let main;
  if (chunked && !last) {
    main = (
      <Btn
        iconAfter="arrow_forward"
        disabled={mode === 'listen' && status !== 'completed' && !unfinished}
        onClick={() => patch({ chunk: idx + 1, listen: undefined, played: false })}
      >
        Következő rész
      </Btn>
    );
  } else if (mode === 'listen') {
    if (status === 'completed')
      main = (
        <Btn iconAfter="arrow_forward" onClick={() => finish(false)}>
          Készen állok
        </Btn>
      );
    else if (unfinished && !noAudio)
      main = (
        <Btn iconAfter="check" onClick={() => finish(true)}>
          Befejeztem a hallgatást
        </Btn>
      );
    else
      main = (
        <Btn iconAfter="arrow_forward" disabled>
          Készen állok
        </Btn>
      );
  } else {
    main = (
      <Btn iconAfter="arrow_forward" onClick={() => finish(false)}>
        {mode === 'read' ? 'Elolvastam' : 'Készen állok'}
      </Btn>
    );
  }

  return (
    <div className="stack">
      {sec.label && adv.passages[0].sections.length > 1 ? <span className="eyebrow">{sec.label}</span> : null}

      {mode === 'listen' ? (
        <div className="listen-box">
          <div className={`listen-orb ${playing ? 'playing' : ''}`} aria-hidden="true">
            <Icon name="headphones" size={56} />
          </div>
          {noAudio ? null : <div className="row center">{audioBtn('primary')}</div>}
          {unfinished ? (
            <p className="muted center-text" role="status">
              {status === 'paused'
                ? 'Szünet. Folytathatod, ahol abbahagytad, vagy jelezheted, hogy végeztél.'
                : status === 'interrupted'
                  ? `A lejátszás megállt.${restart ? ' Újra az elejéről indul.' : ''} Hallgasd újra, vagy jelezd, hogy végeztél.`
                  : 'Nem tudjuk, hogy a lejátszás véget ért-e. Hallgasd újra, vagy jelezd, hogy végeztél.'}
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === 'combined' && !noAudio ? <div className="row">{audioBtn('ghost')}</div> : null}

      {noAudio ? (
        <div className="note soft" role="status">
          <Icon name="volume_off" />
          <div className="stack tight">
            <span>{voiceReady === null ? 'A felolvasás ellenőrzése folyamatban van…' : NO_AUDIO_TEXT}</span>
            {voiceReady === false && mode === 'listen' ? (
              <Btn kind="ghost" icon="menu_book" onClick={() => setMode('read')}>
                Olvasással folytatom
              </Btn>
            ) : null}
          </div>
        </div>
      ) : null}

      {mode === 'listen' && !st.transcript && st.played ? (
        <Btn kind="ghost" icon="subtitles" onClick={showTranscript}>
          Megmutatod a szöveget?
        </Btn>
      ) : null}

      {showText ? (
        <article className="reading" aria-label="A szöveg">
          <SectionText sec={view} glossary={adv.glossary} onWord={openWord} />
        </article>
      ) : null}

      {words.length ? (
        <div className="stack tight" aria-label="Szómagyarázat">
          <span className="eyebrow">Szavak, ha kíváncsi vagy rájuk</span>
          <div className="chips">
            {words.map((g) => (
              <button key={g.key} type="button" className="pill" onClick={() => openWord(g)}>
                {g.word}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="row">
        {main}
        {chunked && idx > 0 ? (
          <Btn kind="ghost" icon="arrow_back" onClick={() => patch({ chunk: idx - 1 })}>
            Előző rész
          </Btn>
        ) : null}
      </div>
      {chunked && parts.length > 1 ? (
        <span className="muted">
          Rövidebb részletekben haladunk: {idx + 1}/{parts.length}
        </span>
      ) : null}
    </div>
  );
}

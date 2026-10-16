import { useEffect, useRef } from 'react';
import { sectionOf, sectionText } from '../content/index.js';
import { Btn, Icon } from '../app/ui.jsx';
import { canPlay, NO_AUDIO_TEXT } from '../app/audio.js';
import { SectionText } from './shared.jsx';

// One section of a passage, presented as the child chose: reading, listening or both.
//   read     – text at the child's own pace, nothing hides or advances on a timer
//   listen   – playback controls and a neutral picture; the transcript stays hidden until asked for
//   combined – text and narration together (no word highlighting: there is no timing data)
export default function Passage({ api }) {
  const { adv, step, st, patch, log, run, speaker, voiceReady, openWord, next, setMode, settings } = api;
  const timer = useRef(null);
  const sec = sectionOf(adv, step.passageId, step.sectionId);
  const mode = run.mode;
  const listening = mode === 'listen' || mode === 'combined';
  const chunked = !!st.chunked;
  const idx = st.chunk || 0;
  const last = idx >= sec.sentences.length - 1;
  const clipBase = `${adv.id}:${step.passageId}:${step.sectionId}`;
  const clip = chunked ? `${clipBase}:${idx}` : clipBase;
  const text = chunked ? sec.sentences[idx].text : (sec.narration ?? sectionText(sec));
  const audioOk = canPlay(voiceReady, clip);
  const playing = speaker.playing === clip;

  useEffect(() => {
    // Speech does not survive a reload or a break, so a clip that was playing counts as finished.
    if (st.played && !st.ended) patch({ ended: true });
    if (st.presented) return;
    patch({ presented: true });
    log('passage_presented', { activity: step.id, mode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const play = () => {
    if (st.played) {
      patch((s) => ({ ...s, replays: (s.replays || 0) + 1 }));
      log('audio_replayed', { activity: step.id });
    }
    patch({ played: true, ended: false, playedClip: clip });
    // Some phones never report that speech has finished, which would leave "Készen állok" locked.
    // The timer is a safety net sized to the text; the normal end event clears it.
    clearTimeout(timer.current);
    const ms = Math.max(2500, (text.length * 95) / (settings.rate || 1) + 1500);
    timer.current = setTimeout(() => patch({ ended: true }), ms);
    speaker.play(clip, text, () => {
      clearTimeout(timer.current);
      patch({ ended: true });
    });
  };
  const showTranscript = () => {
    patch({ transcript: true });
    log('transcript_opened', { activity: step.id });
  };

  const view = chunked ? { ...sec, sentences: [sec.sentences[idx]] } : sec;
  const showText = mode === 'read' || mode === 'combined' || st.transcript;
  const finished = chunked ? last : true;
  const nextLabel = mode === 'read' ? 'Elolvastam' : 'Készen állok';
  const readyToGo = mode === 'read' || mode === 'combined' ? true : !!st.played && !!st.ended;

  const noAudio = listening && !audioOk;

  return (
    <div className="stack">
      {sec.label && adv.passages[0].sections.length > 1 ? <span className="eyebrow">{sec.label}</span> : null}

      {mode === 'listen' ? (
        <div className="listen-box">
          <div className={`listen-orb ${playing ? 'playing' : ''}`} aria-hidden="true">
            <Icon name="headphones" size={56} />
          </div>
          {noAudio ? null : (
            <div className="row center">
              <Btn icon={playing ? 'pause' : 'play_arrow'} onClick={play}>
                {playing ? 'Szünet' : st.played ? 'Újra meghallgatom' : 'Meghallgatom'}
              </Btn>
            </div>
          )}
        </div>
      ) : null}

      {mode === 'combined' && !noAudio ? (
        <div className="row">
          <Btn kind="ghost" icon={playing ? 'pause' : 'volume_up'} onClick={play}>
            {playing ? 'Szünet' : st.played ? 'Újra meghallgatom' : 'Meghallgatom'}
          </Btn>
        </div>
      ) : null}

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

      <div className="row">
        {chunked && !last ? (
          <Btn
            iconAfter="arrow_forward"
            onClick={() => patch({ chunk: idx + 1, ended: false, played: false })}
            disabled={mode === 'listen' && !st.ended}
          >
            Következő rész
          </Btn>
        ) : (
          <Btn iconAfter="arrow_forward" disabled={mode === 'listen' ? noAudio || !readyToGo : false} onClick={next}>
            {nextLabel}
          </Btn>
        )}
        {chunked && idx > 0 ? (
          <Btn kind="ghost" icon="arrow_back" onClick={() => patch({ chunk: idx - 1 })}>
            Előző rész
          </Btn>
        ) : null}
      </div>
      {!finished && !last ? (
        <span className="muted">
          Kisebb részekben haladunk: {idx + 1}/{sec.sentences.length}
        </span>
      ) : null}
    </div>
  );
}

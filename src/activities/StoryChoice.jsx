import { useEffect, useRef, useState } from 'react';
import { shuffle, Btn, Icon } from '../app/ui.jsx';
import { canPlay, failureText, FAIL_TITLE } from '../app/audio.js';
import { sectionOf, sectionText } from '../content/index.js';
import { StepWords } from './shared.jsx';
import { useAnnounce } from './live.jsx';

// The child advises the character. Every option is valid: there is no right or wrong, no retry and no hint ladder.
// The chosen option shows its own authored consequence (a short section of the `paths` passage, with its recording when
// one exists), then the story continues with the same next part for everyone.
// It is recorded as `story_choice_made` (ids only). It deliberately logs no `activity_completed`, so it never enters the
// scored observations.
export default function StoryChoice({ api }) {
  const { adv, step, st, run, patch, log, next, speaker, voiceReady } = api;
  const announce = useAnnounce();
  const [order] = useState(() => st.order || shuffle(step.options.map((o) => o.id)));
  useEffect(() => {
    if (!st.order) patch({ order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const byId = Object.fromEntries(step.options.map((o) => [o.id, o]));
  const chosen = st.choice ? byId[st.choice] : null;
  const selected = st.selected || null;

  const sec = chosen ? sectionOf(adv, 'paths', chosen.section) : null;
  const clip = chosen ? `${adv.id}:paths:${chosen.section}` : null;
  const text = sec ? sectionText(sec) : '';
  const listening = run.mode === 'listen' || run.mode === 'combined';
  const audioOk = !!clip && canPlay(voiceReady, clip);
  const playing = speaker.playing === clip;
  const paused = speaker.paused === clip;
  const showText = run.mode !== 'listen' || st.transcript;
  const [fail, setFail] = useState(null);
  const playId = useRef(0);

  useEffect(() => () => speaker.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = () => {
    if (!selected || st.choice) return;
    patch({ choice: selected, done: true });
    log('story_choice_made', { activity: step.id, choice: selected, mode: run.mode });
  };

  // The consequence is announced once when it appears (its text, or a short note when only listening).
  useEffect(() => {
    if (chosen && st.choice && !st.announced) {
      patch({ announced: true });
      announce(showText ? text : 'Megvan a következmény. Meghallgathatod.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen]);

  const play = () => {
    setFail(null);
    const mine = ++playId.current;
    patch({ played: true });
    speaker.play(clip, text, (status, reason) => {
      if (mine !== playId.current) return;
      log('audio_status', { activity: step.id, status, ...(reason ? { reason, online: navigator.onLine } : null) });
      if (status === 'error') setFail(reason);
    });
  };
  const pause = () => {
    const kept = speaker.pause(clip);
    log('audio_paused', { activity: step.id, positionKept: kept });
  };
  const resume = () => {
    if (!speaker.resume(clip)) play();
    else log('audio_resumed', { activity: step.id, positionKept: true });
  };

  return (
    <div className="stack">
      <h2 className="h2">{step.prompt}</h2>
      {step.note ? <p className="lead">{step.note}</p> : null}

      <div className="stack tight" role="group" aria-label="Lehetőségek">
        {order.map((id) => {
          const on = (st.choice || selected) === id;
          return (
            <button
              key={id}
              type="button"
              className={`option ${on ? 'on' : ''}`}
              aria-pressed={on}
              disabled={!!st.choice}
              onClick={() => patch({ selected: id })}
            >
              <span className="option-text">{byId[id].text}</span>
              {on ? <Icon name="check_circle" fill /> : null}
            </button>
          );
        })}
      </div>

      <StepWords api={api} />

      {chosen && sec ? (
        <>
          <section className="card stack tight" aria-label="A következmény">
            <span className="eyebrow">Mi történt?</span>
            {showText ? <p className="read-text">{text}</p> : null}
            {listening && audioOk ? (
              <div className="row">
                {playing ? (
                  <Btn kind="ghost" icon="pause" onClick={pause}>
                    Szünet
                  </Btn>
                ) : paused ? (
                  <Btn kind="ghost" icon="play_arrow" onClick={resume}>
                    Folytatom
                  </Btn>
                ) : (
                  <Btn kind={showText ? 'ghost' : 'primary'} icon="play_arrow" onClick={play}>
                    {st.played ? 'Újra meghallgatom' : 'Meghallgatom'}
                  </Btn>
                )}
                {!showText && st.played ? (
                  <Btn kind="ghost" icon="subtitles" onClick={() => patch({ transcript: true })}>
                    Megmutatom a szöveget
                  </Btn>
                ) : null}
              </div>
            ) : null}
            {listening && !audioOk && !showText ? (
              <Btn kind="ghost" icon="subtitles" onClick={() => patch({ transcript: true })}>
                Megmutatom a szöveget
              </Btn>
            ) : null}
          </section>
          {fail ? (
            <div className="note soft" role="alert">
              <Icon name="error" />
              <div className="stack tight">
                <strong>{FAIL_TITLE}</strong>
                <span>{failureText(fail)}</span>
                <div className="row">
                  <Btn icon="refresh" onClick={play}>
                    Újrapróbálom
                  </Btn>
                  <Btn kind="ghost" icon="menu_book" onClick={() => patch({ transcript: true })}>
                    Olvasással folytatom
                  </Btn>
                </div>
              </div>
            </div>
          ) : null}
          <Btn
            iconAfter="arrow_forward"
            onClick={() => {
              speaker.stop();
              next();
            }}
          >
            Tovább
          </Btn>
        </>
      ) : (
        <div className="row">
          <Btn disabled={!selected} onClick={submit}>
            {step.submitLabel}
          </Btn>
        </div>
      )}
    </div>
  );
}

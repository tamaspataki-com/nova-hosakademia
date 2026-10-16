import { useCallback, useEffect, useState } from 'react';
import { Narrator } from './narrator.js';

// Audio provider order: supplied recordings (Narrator.recorded[id]) → a verified Hungarian browser voice →
// none. When neither exists the UI says so and offers reading; it never shows playback that makes no sound.
let started = false;
let state = null; // null = still checking, true = a Hungarian voice exists, false = none
const listeners = new Set();

export function initAudio() {
  if (started) return;
  started = true;
  // ?noaudio simulates a device without a Hungarian voice (for checking the fallback behaviour).
  if (new URLSearchParams(window.location.search).has('noaudio')) {
    state = false;
    listeners.forEach((f) => f(false));
    return;
  }
  Narrator.init((ok) => {
    state = ok;
    listeners.forEach((f) => f(ok));
  });
}

export function useVoiceReady() {
  const [ok, setOk] = useState(state);
  useEffect(() => {
    listeners.add(setOk);
    setOk(state);
    return () => listeners.delete(setOk);
  }, []);
  return ok;
}

// Can this clip be played? A recording needs no voice; speech needs a Hungarian voice.
export const canPlay = (voiceReady, clipId) => !!(clipId && Narrator.recorded[clipId]) || voiceReady === true;

export const NO_AUDIO_TEXT =
  'Ezen az eszközön most nincs elérhető magyar felolvasás. Olvasással folytathatod a kalandot.';

// Playback hook. play(id, text, onDone) – onDone(status) with 'completed' | 'interrupted' | 'error'.
// pause(id) returns true when the position is kept (recorded files) and false when the clip was stopped (speech),
// in which case playing it again starts from the beginning. resume(id) continues a kept position.
export function useSpeaker(rate = 1) {
  const [playing, setPlaying] = useState(null);
  const [paused, setPaused] = useState(null);
  useEffect(() => () => Narrator.stop(), []);
  const stop = useCallback(() => {
    Narrator.stop();
    setPlaying(null);
    setPaused(null);
  }, []);
  const play = useCallback(
    (id, text, onDone) => {
      setPaused(null);
      setPlaying(id);
      Narrator.speak(id, text, rate, (status) => {
        setPlaying((p) => (p === id ? null : p));
        setPaused((p) => (p === id ? null : p));
        onDone?.(status);
      });
    },
    [rate]
  );
  const pause = useCallback((id) => {
    const kept = Narrator.pause();
    setPlaying(null);
    setPaused(kept ? id : null);
    return kept;
  }, []);
  const resume = useCallback((id) => {
    const ok = Narrator.resume();
    if (ok) {
      setPaused(null);
      setPlaying(id);
    }
    return ok;
  }, []);
  return { playing, paused, play, pause, resume, stop };
}

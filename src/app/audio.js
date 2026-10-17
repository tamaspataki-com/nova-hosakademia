import { useCallback, useEffect, useState } from 'react';
import { Narrator } from './narrator.js';
import { RECORDINGS } from '../content/audio.js';

// Audio provider order: supplied recordings (Narrator.recorded[id]) → a verified Hungarian browser voice →
// none. When neither exists the UI says so and offers reading; it never shows playback that makes no sound.
let started = false;
let state = null; // null = still checking, true = a Hungarian voice exists, false = none
const listeners = new Set();

// Keep the recordings for offline use. They are cached whole by the service worker's audio route (which also answers
// range requests, as iPhones need); precaching them would break playback on iOS.
function warmRecordings() {
  if (!('caches' in window) || navigator.onLine === false) return;
  const urls = [...new Set(Object.values(RECORDINGS))];
  const run = async () => {
    try {
      const cache = await caches.open('nova-audio');
      // cache.add rejects on any failed or non-2xx download, so a file only counts once it is really stored.
      for (const u of urls) if (!(await cache.match(u))) await cache.add(u);
    } catch (e) {
      /* offline or blocked: the clips simply stream when played, and offline readiness stays "not ready" */
    } finally {
      window.dispatchEvent(new Event('nova:warmed')); // lets the offline indicators check again
    }
  };
  (window.requestIdleCallback || ((f) => setTimeout(f, 2000)))(run);
}

export function initAudio() {
  if (started) return;
  started = true;
  Object.assign(Narrator.recorded, RECORDINGS); // recordings win over browser speech
  warmRecordings();
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

// Clip ids of an adventure's passages, and whether every one can be played (recorded, or a Hungarian voice exists).
export const passageClips = (adv) =>
  adv.steps.filter((s) => s.type === 'passage').map((s) => `${adv.id}:${s.passageId}:${s.sectionId}`);
export const canPlayAdventure = (voiceReady, adv) => passageClips(adv).every((c) => canPlay(voiceReady, c));

export const NO_AUDIO_TEXT =
  'Ezen az eszközön most nincs elérhető magyar felolvasás. Olvasással folytathatod a kalandot.';

// Playback hook. play(id, text, onDone) – onDone(status, reason) with 'completed' | 'interrupted' | 'error'.
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
      Narrator.speak(id, text, rate, (status, reason) => {
        setPlaying((p) => (p === id ? null : p));
        setPaused((p) => (p === id ? null : p));
        onDone?.(status, reason);
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

// What the child is told when a recording cannot be played. Never says "done"; always offers a way on.
export function failureText(reason) {
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  if (reason === 'download')
    return offline
      ? 'Nincs internetkapcsolat, és ez a felvétel még nincs letöltve ezen az eszközön.'
      : 'A felvételt nem sikerült letölteni.';
  if (reason === 'decode') return 'A felvételt nem sikerült megnyitni.';
  if (reason === 'play') return 'Az eszköz nem engedte elindítani a lejátszást.';
  return 'A felolvasás nem indult el.';
}
export const FAIL_TITLE = 'A felvételt most nem sikerült lejátszani.';

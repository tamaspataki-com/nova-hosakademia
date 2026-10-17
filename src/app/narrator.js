// Recordings are loaded whole and played from memory (a blob URL). The static host answers range requests with the
// full file, and iPhones may refuse to play audio that is not served in ranges; a blob supports seeking everywhere.
const blobUrls = new Map();
function forgetRecording(url) {
  const src = blobUrls.get(url);
  if (src) URL.revokeObjectURL(src);
  blobUrls.delete(url);
}
async function loadRecording(url) {
  if (blobUrls.has(url)) return blobUrls.get(url);
  const res = await fetch(url); // a network failure rejects here: stage 'download'
  if (!res.ok) throw new Error(`recording ${res.status}`);
  // The host answers an unknown path with the app page (status 200): that is a missing file, not an audio file.
  const type = res.headers.get('content-type') || '';
  if (!/^audio\//i.test(type) && !/octet-stream/i.test(type)) throw new Error(`not audio (${type})`);
  const src = URL.createObjectURL(await res.blob());
  blobUrls.set(url, src);
  return src;
}

// Narration service: recorded files (by clip id) take priority over browser speech.
//
// Every playback ends with exactly one status, reported to the callback passed to speak() as (status, reason):
//   'completed'   – the audio or speech engine reported that it finished
//   'interrupted' – it was stopped (pause, new clip, leaving the passage) before it finished
//   'error'       – a failure; reason is 'download' (the recording could not be fetched), 'decode' (the file could not
//                   be opened), 'play' (the browser refused to start it) or 'speech' (browser speech failed).
//                   A failure is never reported as completed.
// A device that never reports anything simply never calls back; the caller treats that as "unknown".
export const Narrator = {
  voice: null,
  available: null,
  recorded: {},
  _a: null,
  _cur: null,
  init(cb) {
    if (typeof window === 'undefined' || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      this.available = false;
      cb(false);
      return;
    }
    const pick = () => {
      const vs = speechSynthesis.getVoices();
      if (!vs.length) return;
      const v = vs.find((v) => /^hu([-_]|$)/i.test(v.lang));
      this.voice = v || null;
      this.available = !!v;
      cb(this.available);
    };
    pick();
    speechSynthesis.addEventListener('voiceschanged', pick);
    setTimeout(() => {
      if (this.available === null) {
        this.available = false;
        cb(false);
      }
    }, 2500);
  },
  speak(id, text, rate, onDone) {
    this.stop(); // a previous clip ends as 'interrupted', so two clips never overlap
    const cur = { finished: false, interrupted: false };
    cur.finish = (status, reason) => {
      if (cur.finished) return;
      cur.finished = true;
      if (this._cur === cur) this._cur = null;
      onDone?.(status, reason);
    };
    this._cur = cur;

    if (this.recorded[id]) {
      this.lastUrl = this.recorded[id];
      loadRecording(this.recorded[id])
        .then((src) => {
          if (cur.finished || cur.interrupted) return; // stopped while it was loading
          const a = new Audio(src);
          this._a = a;
          a.playbackRate = rate;
          a.onended = () => cur.finish('completed');
          a.onerror = () => {
            forgetRecording(this.recorded[id]); // a retry fetches a fresh copy
            cur.finish('error', 'decode');
          };
          return a.play().catch((e) => {
            if (e?.name === 'AbortError') return; // paused or stopped while starting: not a failure
            throw Object.assign(new Error('play'), { stage: 'play' });
          });
        })
        .catch((e) => cur.finish('error', e?.stage || 'download'));
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.voice = this.voice;
    u.lang = 'hu-HU';
    u.rate = rate;
    u.onend = () => cur.finish(cur.interrupted ? 'interrupted' : 'completed');
    u.onerror = (e) =>
      cur.finish(
        cur.interrupted || e?.error === 'interrupted' || e?.error === 'canceled' ? 'interrupted' : 'error',
        'speech'
      );
    speechSynthesis.speak(u);
  },
  // Pause keeps the position only when the provider can: a recorded file can be paused and resumed exactly.
  // Browser speech cannot be relied on to resume (several phones restart or drop it), so for speech a pause is a
  // stop and the next play starts again from the beginning. Returns true when the position is preserved.
  pause() {
    const cur = this._cur;
    if (cur && this._a) {
      this._a.pause();
      cur.paused = true;
      return true;
    }
    this.stop();
    return false;
  },
  resume() {
    const cur = this._cur;
    if (cur?.paused && this._a) {
      cur.paused = false;
      this._a.play().catch(() => cur.finish('error', 'play'));
      return true;
    }
    return false;
  },
  stop() {
    const cur = this._cur;
    if (cur) {
      cur.interrupted = true;
      cur.finish('interrupted'); // decided here, so engines that stay silent on cancel cannot leave it open
    }
    if (this._a) {
      this._a.pause();
      this._a = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) speechSynthesis.cancel();
  }
};

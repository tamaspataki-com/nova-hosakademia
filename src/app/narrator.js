// Narration service: recorded files (by clip id) take priority over browser speech.
//
// Every playback ends with exactly one status, reported to the callback passed to speak():
//   'completed'   – the audio or speech engine reported that it finished
//   'interrupted' – it was stopped (pause, new clip, leaving the passage) before it finished
//   'error'       – the engine reported a failure
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
    cur.finish = (status) => {
      if (cur.finished) return;
      cur.finished = true;
      if (this._cur === cur) this._cur = null;
      onDone?.(status);
    };
    this._cur = cur;

    if (this.recorded[id]) {
      const a = new Audio(this.recorded[id]);
      this._a = a;
      a.playbackRate = rate;
      a.onended = () => cur.finish('completed');
      a.onerror = () => cur.finish('error');
      a.play().catch(() => cur.finish('error'));
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.voice = this.voice;
    u.lang = 'hu-HU';
    u.rate = rate;
    u.onend = () => cur.finish(cur.interrupted ? 'interrupted' : 'completed');
    u.onerror = (e) =>
      cur.finish(cur.interrupted || e?.error === 'interrupted' || e?.error === 'canceled' ? 'interrupted' : 'error');
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
      this._a.play().catch(() => cur.finish('error'));
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

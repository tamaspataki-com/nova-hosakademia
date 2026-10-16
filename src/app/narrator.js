// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.

// Narration service: recorded files (by id) take priority over browser speech.
export const Narrator = {
  voice: null,
  available: null,
  recorded: {},
  _a: null,
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
  speak(id, text, rate, onEnd) {
    this.stop();
    if (this.recorded[id]) {
      const a = new Audio(this.recorded[id]);
      this._a = a;
      a.playbackRate = rate;
      a.onended = onEnd;
      a.play();
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.voice = this.voice;
    u.lang = 'hu-HU';
    u.rate = rate;
    u.onend = onEnd;
    u.onerror = onEnd;
    speechSynthesis.speak(u);
  },
  stop() {
    if (this._a) {
      this._a.pause();
      this._a = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) speechSynthesis.cancel();
  }
};

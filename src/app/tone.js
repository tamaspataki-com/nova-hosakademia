// Optional short confirmation tones (Szülői tér → Beállítások → Hang). Silent unless the setting is on.
let ac = null;
export function tone(enabled, kind = 'ok') {
  if (!enabled) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    ac = ac || new AC();
    const notes = kind === 'done' ? [523, 659, 784] : [660, 880];
    notes.forEach((f, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      const t = ac.currentTime + i * 0.13;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.07, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g);
      g.connect(ac.destination);
      o.start(t);
      o.stop(t + 0.55);
    });
  } catch (e) {
    /* audio not available */
  }
}

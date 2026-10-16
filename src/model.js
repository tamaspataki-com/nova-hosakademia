// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
// State factories, persistence and formatting helpers.

export const STORE = 'nova.hosakademia.v1';
export function freshMission() {
  const ids = ['e1', 'e2', 'e3'];
  let o;
  do {
    o = [...ids].sort(() => Math.random() - 0.5);
  } while (o.join() === ids.join());
  return {
    started: false,
    completed: false,
    stage: 0,
    mode: null,
    section: 0,
    showText: true,
    q: { picked: [], solved: false },
    seq: { order: o, slots: [null, null, null], sel: null, checks: 0, result: null, solved: false, hint: false },
    ev: { picked: [], solved: false },
    ex: { kind: null, text: '', spoken: false, saved: false }
  };
}

export function freshRun(task) {
  const r = {
    picked: [],
    solved: false,
    first: null,
    rereads: 0,
    replays: 0,
    transcript: false,
    hints: 0,
    supportOpen: false,
    said: false,
    seqSlots: [null, null, null],
    seqSel: null,
    seqResult: null,
    seqChecks: 0,
    seqOrder: null
  };
  if (task && task.type === 'seq') {
    let o;
    do {
      o = [0, 1, 2].sort(() => Math.random() - 0.5);
    } while (o.join() === '0,1,2');
    r.seqOrder = o;
  }
  return r;
}
export function defaultProg() {
  return { levels: { read: 1, listen: 1, seq: 1, main: 1 }, streak: {}, sessions: 0, done: {} };
}

export function blankHw() {
  return { text: '', sections: [], question: '', options: ['', '', ''], correct: 0 };
}
export function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORE)) || {};
  } catch (e) {
    return {};
  }
}
export function fmt(t) {
  const d = new Date(t);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getMonth() + 1)}.${p(d.getDate())}. ${p(d.getHours())}:${p(d.getMinutes())}`;
}
export const ICON_OK = 'check_circle',
  ICON_NO = 'cancel';

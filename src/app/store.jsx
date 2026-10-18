import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { RESET_IDS, canOpen, dayOf, isDay, journeyCurrent, paceAfterCompletion } from '../content/journey.js';

// All app state lives here and is persisted to localStorage. Screens read it with useStore() and change it only
// through the actions returned there, so progress, events and completion rules stay in one place.
export const KEY = 'nova.hosakademia.v2';
const KEY_V1 = 'nova.hosakademia.v1';
const MAX_EVENTS = 4000;

export const DEFAULT_SETTINGS = {
  name: 'Lacika',
  textSize: 22,
  rate: 1,
  sound: false,
  reducedMotion: false,
  level: 1,
  guideSeen: 0
};

export const blankHw = () => ({
  title: '',
  text: '',
  sections: [],
  question: '',
  options: ['', '', ''],
  correct: 0,
  hint: ''
});

export const initial = () => ({
  v: 2,
  settings: { ...DEFAULT_SETTINGS },
  progress: {},
  history: {},
  favourites: [],
  badges: [],
  events: [],
  retells: [],
  discoveries: {},
  notes: [],
  pinCode: null,
  // Daily pacing (see content/journey.js): the first-completion day and the unlock day per journey adventure.
  pacing: { completed: {}, unlocks: {} },
  hw: blankHw(),
  hwSaved: [],
  legacy: null
});

// ---- migration from the single-file prototype (key nova.hosakademia.v1) ----
const V1_MODE = { read: 'read', listen: 'listen', both: 'combined' };
// Prototype stages: 0 intro, 1 mode, 2 story (section 0-2), 3 question, 4 sequence, 5 evidence, 6 retell, 7 done.
function v1StepIndex(m) {
  if (m.stage <= 2) return Math.max(0, Math.min(2, m.section || 0));
  return Math.min(m.stage, 6);
}
export function migrateV1(o) {
  const s = initial();
  Object.assign(s.settings, pick(o.settings, ['name', 'textSize', 'rate', 'sound', 'reducedMotion']));
  s.notes = Array.isArray(o.notes) ? o.notes : [];
  s.pinCode = o.pinCode || null;
  if (o.hw && typeof o.hw === 'object') s.hw = { ...blankHw(), ...o.hw };
  s.hwSaved = (Array.isArray(o.hwSaved) ? o.hwSaved : []).map((h, i) => ({
    id: `v1-${i}`,
    t: h.t || Date.now(),
    title: h.title || 'Saját szöveg',
    sections: h.sections || [],
    question: h.question || '',
    options: (h.options || []).map((x) => ({ text: x.text, correct: !!x.correct })),
    hint: ''
  }));
  s.badges = Array.isArray(o.tools) ? o.tools : [];
  const m = o.mission;
  if (m?.completed) s.history['heroes.energymag'] = { completions: 1, last: Date.now() };
  else if (m?.started) {
    s.progress['heroes.energymag'] = {
      id: 'heroes.energymag',
      ver: 1,
      mode: V1_MODE[m.mode] || null,
      stepIndex: v1StepIndex(m),
      startedAt: Date.now(),
      repeat: false,
      steps: {}
    };
  }
  s.legacy = {
    events: Array.isArray(o.events) ? o.events : [],
    attempts: Array.isArray(o.attempts) ? o.attempts : [],
    retell: m?.ex?.text ? { kind: m.ex.kind, text: m.ex.text } : null,
    droppedPractice: !!o.ps || !!o.psSaved
  };
  return s;
}
const pick = (o = {}, keys) => Object.fromEntries(keys.filter((k) => k in o).map((k) => [k, o[k]]));

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const o = JSON.parse(raw);
      const base = initial();
      return {
        ...base,
        ...o,
        settings: { ...DEFAULT_SETTINGS, ...(o.settings || {}) },
        // saves from before daily pacing have no pacing records: nothing is scheduled, nothing is held back
        pacing: { completed: { ...(o.pacing?.completed || {}) }, unlocks: { ...(o.pacing?.unlocks || {}) } }
      };
    }
    const v1 = localStorage.getItem(KEY_V1);
    if (v1) return migrateV1(JSON.parse(v1));
  } catch (e) {
    /* unreadable save: start fresh */
  }
  return initial();
}

// ---- reducer ----
// Exported so the rules in it (for example that a locked adventure never gets a run) can be tested directly.
export function reducer(s, a) {
  switch (a.type) {
    case 'settings':
      return { ...s, settings: { ...s.settings, ...a.patch } };

    case 'start': {
      if (!canOpen(s, a.id, dayOf(a.t))) return s; // a locked journey adventure never gets a run, whatever opened the screen
      const old = s.progress[a.id];
      if (old && !a.restart) return s;
      const run = {
        id: a.id,
        ver: a.ver,
        mode: null,
        stepIndex: 0,
        startedAt: a.t,
        repeat: (s.history[a.id]?.completions || 0) > 0,
        steps: {}
      };
      return { ...s, progress: { ...s.progress, [a.id]: run } };
    }
    case 'run': {
      const run = s.progress[a.id];
      if (!run) return s;
      return { ...s, progress: { ...s.progress, [a.id]: { ...run, ...a.patch } } };
    }
    case 'step': {
      const run = s.progress[a.id];
      if (!run) return s;
      const cur = run.steps[a.stepId] || {};
      const next = typeof a.patch === 'function' ? a.patch(cur) : { ...cur, ...a.patch };
      return { ...s, progress: { ...s.progress, [a.id]: { ...run, steps: { ...run.steps, [a.stepId]: next } } } };
    }
    case 'abandon': {
      const { [a.id]: _gone, ...rest } = s.progress;
      return { ...s, progress: rest };
    }
    // Idempotent: only an active run can complete, and completing removes it. A second dispatch is a no-op,
    // so reopening a finished screen never doubles a completion or an award.
    case 'complete': {
      const run = s.progress[a.id];
      if (!run) return s;
      const { [a.id]: _done, ...rest } = s.progress;
      const prev = s.history[a.id] || { completions: 0 };
      return {
        ...s,
        pacing: paceAfterCompletion(s, a.id, a.t),
        progress: rest,
        history: { ...s.history, [a.id]: { completions: prev.completions + 1, last: a.t } },
        badges: a.badge && !s.badges.includes(a.badge) ? [...s.badges, a.badge] : s.badges
      };
    }
    case 'log': {
      const events = [...s.events, a.e];
      return { ...s, events: events.length > MAX_EVENTS ? events.slice(-MAX_EVENTS) : events };
    }
    case 'resetJourney': {
      // Parent: start the journey adventures (and the newer world adventures) from zero. Only their completions, unfinished runs, pacing dates and
      // badges go; settings, PIN, notes, own texts, practice progress, favourites, observations and everything else stay.
      const drop = (o) => Object.fromEntries(Object.entries(o).filter(([id]) => !RESET_IDS.includes(id)));
      return {
        ...s,
        progress: drop(s.progress),
        history: drop(s.history),
        pacing: { completed: drop(s.pacing.completed), unlocks: drop(s.pacing.unlocks) },
        badges: s.badges.filter((b) => !(a.badges || []).includes(b))
      };
    }
    case 'unlockDay': {
      // Parent: change the day the next journey adventure opens (a past or today's day opens it now).
      if (a.id !== journeyCurrent(s) || !isDay(a.day)) return s;
      return { ...s, pacing: { ...s.pacing, unlocks: { ...s.pacing.unlocks, [a.id]: a.day } } };
    }
    case 'fav':
      return {
        ...s,
        favourites: s.favourites.includes(a.id) ? s.favourites.filter((x) => x !== a.id) : [...s.favourites, a.id]
      };
    case 'retell':
      return { ...s, retells: [...s.retells.filter((r) => !(r.adv === a.r.adv && r.step === a.r.step)), a.r] };
    case 'discovery':
      return { ...s, discoveries: { ...s.discoveries, [a.id]: { ...(s.discoveries[a.id] || {}), ...a.patch } } };
    case 'note':
      return { ...s, notes: [a.note, ...s.notes] };
    case 'noteDelete':
      return { ...s, notes: s.notes.filter((n) => n.t !== a.t) };
    case 'pin':
      return { ...s, pinCode: a.pin };
    case 'hw':
      return { ...s, hw: { ...s.hw, ...a.patch } };
    case 'hwReset':
      return { ...s, hw: blankHw() };
    case 'hwSave':
      return { ...s, hwSaved: [a.item, ...s.hwSaved], hw: blankHw() };
    case 'hwDelete':
      return { ...s, hwSaved: s.hwSaved.filter((h) => h.id !== a.id) };
    case 'wipe':
      return initial();
    default:
      return s;
  }
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* storage full or blocked: the app keeps working in memory */
    }
  }, [state]);

  const log = useCallback((type, adv, data) => {
    dispatch({
      type: 'log',
      e: { t: Date.now(), type, adv: adv?.id, ver: adv?.version, ...data }
    });
  }, []);

  const act = useMemo(
    () => ({
      dispatch,
      log,
      settings: (patch) => dispatch({ type: 'settings', patch }),
      start(adv, { restart = false } = {}) {
        dispatch({ type: 'start', id: adv.id, ver: adv.version, t: Date.now(), restart });
      },
      run: (id, patch) => dispatch({ type: 'run', id, patch }),
      step: (id, stepId, patch) => dispatch({ type: 'step', id, stepId, patch }),
      abandon: (id) => dispatch({ type: 'abandon', id }),
      complete: (adv) => dispatch({ type: 'complete', id: adv.id, badge: adv.badge, t: Date.now() }),
      unlockDay: (id, day) => dispatch({ type: 'unlockDay', id, day }),
      resetJourney: (badges) => dispatch({ type: 'resetJourney', badges }),
      fav: (id) => dispatch({ type: 'fav', id }),
      retell: (r) => dispatch({ type: 'retell', r }),
      discovery: (id, patch) => dispatch({ type: 'discovery', id, patch }),
      addNote: (note) => dispatch({ type: 'note', note }),
      deleteNote: (t) => dispatch({ type: 'noteDelete', t }),
      setPin: (pin) => dispatch({ type: 'pin', pin }),
      hw: (patch) => dispatch({ type: 'hw', patch }),
      hwReset: () => dispatch({ type: 'hwReset' }),
      hwSave: (item) => dispatch({ type: 'hwSave', item }),
      hwDelete: (id) => dispatch({ type: 'hwDelete', id }),
      wipe() {
        try {
          localStorage.removeItem(KEY);
          localStorage.removeItem(KEY_V1);
        } catch (e) {
          /* ignore */
        }
        dispatch({ type: 'wipe' });
      }
    }),
    [log]
  );

  // Today's local calendar day. It is looked at again when the app returns to the foreground, when the page is shown
  // again, at the next midnight and once a minute, so a day change never waits for a restart.
  const [today, setToday] = useState(() => dayOf());
  useEffect(() => {
    const check = () => setToday((d) => (dayOf() === d ? d : dayOf()));
    let timer;
    const arm = () => {
      clearTimeout(timer);
      const n = new Date();
      const ms = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 0, 1).getTime() - n.getTime();
      timer = setTimeout(
        () => {
          check();
          arm();
        },
        Math.min(Math.max(ms, 1000), 2 ** 31 - 1)
      );
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        check();
        arm();
      }
    };
    arm();
    const interval = setInterval(check, 60 * 1000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    window.addEventListener('pageshow', onVisible);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
      window.removeEventListener('pageshow', onVisible);
    };
  }, []);

  const value = useMemo(() => ({ state, act, today }), [state, act, today]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

// Where a child is with an adventure: 'new' | 'active' | 'done'. 'active' wins over 'done' (a replay is running).
export function statusOf(state, id) {
  if (state.progress[id]) return 'active';
  return (state.history[id]?.completions || 0) > 0 ? 'done' : 'new';
}
export const STATUS_LABEL = { new: 'Új', active: 'Folyamatban', done: 'Befejezve' };

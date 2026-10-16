// Generated from design/NOVA.dc.html by scripts/convert-dc.mjs, then edited by hand as needed.
import React from 'react';
import AppView from './AppView.jsx';
import {
  STAGES,
  MISSION,
  TOOLS,
  HOTSPOTS,
  MODES,
  PATHS,
  TASK_LABELS,
  TASK_CHILD,
  MODE_LABELS,
  LEVEL_LABELS,
  LEVEL_SHORT,
  NOTE_TAGS,
  STRAT,
  ACTS,
  DEF_SETTINGS
} from './content.js';
import { STORE, freshMission, freshRun, defaultProg, blankHw, loadSaved, fmt, ICON_OK, ICON_NO } from './model.js';
import { Narrator } from './narrator.js';
import { touchDrag } from './touchDrag.js';

export default class App extends React.Component {
  state = (() => {
    const s = loadSaved();
    return {
      w: typeof window !== 'undefined' ? window.innerWidth : 390,
      tab: 'welcome',
      sheet: null,
      narr: null,
      speaking: null,
      mapSel: null,
      gearSel: null,
      rest: null,
      restFromMission: false,
      breathPaused: false,
      parentIn: false,
      pinInput: '',
      pinErr: '',
      pTab: 'overview',
      noteDraft: '',
      confirmClear: false,
      hwPreview: null,
      hwMsg: '',
      helpHint: false,
      exMsg: '',
      sysRm: false,
      settings: { ...DEF_SETTINGS, ...(s.settings || {}) },
      mission: s.mission || freshMission(),
      events: s.events || [],
      tools: s.tools || [],
      notes: s.notes || [],
      pinCode: s.pinCode || null,
      hw: s.hw || blankHw(),
      hwSaved: s.hwSaved || [],
      prog: { ...defaultProg(), ...(s.prog || {}) },
      attempts: s.attempts || [],
      ps: s.ps || null,
      psSaved: s.psSaved || null,
      noteTags: []
    };
  })();

  componentDidMount() {
    this.onResize = () => this.setState({ w: window.innerWidth });
    window.addEventListener('resize', this.onResize);
    try {
      this.mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.setState({ sysRm: this.mq.matches });
      this.mqH = (e) => this.setState({ sysRm: e.matches });
      this.mq.addEventListener('change', this.mqH);
    } catch (e) {}
    Narrator.init((ok) => this.setState({ narr: ok }));
    window.__nova = this;
    this.runSplash();
  }
  runSplash() {
    const rm =
      this.state.settings.reducedMotion ||
      (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (rm || this.state.tab !== 'welcome') {
      this.setState({ splash: 5 });
      return;
    }
    this.setState({ splash: 0 });
    this.splashT = [
      [1, 80],
      [2, 1000],
      [3, 2300],
      [4, 3300],
      [5, 3900]
    ].map(([s, t]) => setTimeout(() => this.setState((st) => (st.splash < s ? { splash: s } : null)), t));
  }
  componentWillUnmount() {
    (this.splashT || []).forEach(clearTimeout);
    window.removeEventListener('resize', this.onResize);
    try {
      this.mq.removeEventListener('change', this.mqH);
    } catch (e) {}
    Narrator.stop();
  }
  componentDidUpdate() {
    const { settings, mission, events, tools, notes, pinCode, hw, hwSaved, prog, attempts, ps, psSaved } = this.state;
    try {
      localStorage.setItem(
        STORE,
        JSON.stringify({ settings, mission, events, tools, notes, pinCode, hw, hwSaved, prog, attempts, ps, psSaved })
      );
    } catch (e) {}
  }

  top() {
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
  }
  log(type, data) {
    this.setState((s) => ({ events: [...s.events, { t: Date.now(), type, ...(data || {}) }].slice(-500) }));
  }
  mset(patch) {
    this.setState((s) => ({ mission: { ...s.mission, ...(typeof patch === 'function' ? patch(s.mission) : patch) } }));
  }
  tone(kind) {
    if (!this.state.settings.sound) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ac = this.ac || new AC();
      const ac = this.ac;
      const notes = kind === 'done' ? [523, 659, 784] : [660, 880];
      notes.forEach((f, i) => {
        const o = ac.createOscillator(),
          g = ac.createGain();
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
    } catch (e) {}
  }
  setSettings(p) {
    this.setState((s) => ({ settings: { ...s.settings, ...p } }));
  }
  setHw(p) {
    this.setState((s) => ({ hw: { ...s.hw, ...p } }));
  }

  go(tab, extra) {
    Narrator.stop();
    this.setState({
      tab,
      sheet: null,
      mapSel: null,
      gearSel: null,
      rest: null,
      restFromMission: false,
      speaking: null,
      confirmClear: false,
      ...(extra || {})
    });
    this.top();
  }
  startMission = () => {
    this.setState((s) => {
      let m = s.mission,
        ev = s.events;
      if (!m.started || m.completed) {
        m = { ...freshMission(), started: true };
        ev = [...ev, { t: Date.now(), type: 'start' }];
      }
      return {
        mission: m,
        events: ev,
        tab: 'mission',
        sheet: null,
        helpHint: false,
        rest: null,
        restFromMission: false
      };
    });
    this.top();
  };
  stageTo(n) {
    Narrator.stop();
    this.setState({ speaking: null, helpHint: false, exMsg: '' });
    this.mset({ stage: n });
    this.top();
  }
  speak(id, text) {
    if (this.state.speaking === id) {
      Narrator.stop();
      this.setState({ speaking: null });
      return;
    }
    this.setState({ speaking: id });
    Narrator.speak(id, text, this.state.settings.rate, () =>
      this.setState((s) => (s.speaking === id ? { speaking: null } : null))
    );
    this.log('audio', { id });
  }

  setMode(m) {
    if (m !== 'read' && !this.state.narr) return;
    this.mset({ mode: m, stage: 2, section: 0, showText: m !== 'listen' });
    this.log('mode', { mode: m });
    this.top();
  }
  readNext = () => {
    Narrator.stop();
    this.setState({ speaking: null });
    const m = this.state.mission;
    if (m.section < 2) {
      this.mset({ section: m.section + 1, showText: m.mode !== 'listen' });
      this.top();
    } else this.stageTo(3);
  };
  readBack = () => {
    Narrator.stop();
    this.setState({ speaking: null });
    const m = this.state.mission;
    if (m.section > 0) {
      this.mset({ section: m.section - 1 });
      this.log('reread', { section: m.section - 1 });
      this.top();
    } else this.stageTo(1);
  };

  pickQ(id) {
    const m = this.state.mission;
    if (m.q.solved || m.q.picked.includes(id)) return;
    const picked = [...m.q.picked, id];
    const opt = MISSION.question.options.find((o) => o.id === id);
    const ok = !!opt.correct;
    this.mset({ q: { picked, solved: ok } });
    this.log('answer', { task: 'q', attempt: picked.length, ok, choice: opt.text });
    if (ok) this.tone('ok');
  }

  seqPlace(id, i) {
    const sq = this.state.mission.seq;
    const slots = sq.slots.map((x) => (x === id ? null : x));
    slots[i] = id;
    this.mset({ seq: { ...sq, slots, sel: null, result: null } });
  }
  seqRemove(id) {
    const sq = this.state.mission.seq;
    this.mset({ seq: { ...sq, slots: sq.slots.map((x) => (x === id ? null : x)), sel: null, result: null } });
  }
  // Finger drop target from touchDrag: 'pool' or a slot index.
  seqDropTo(id, to) {
    if (to === 'pool') this.seqRemove(id);
    else this.seqPlace(id, Number(to));
  }
  seqTapCard(id) {
    const sq = this.state.mission.seq;
    if (sq.solved) return;
    this.mset({ seq: { ...sq, sel: sq.sel === id ? null : id } });
  }
  seqTapSlot(i) {
    const sq = this.state.mission.seq;
    if (sq.solved) return;
    if (sq.sel) {
      this.seqPlace(sq.sel, i);
      return;
    }
    if (sq.slots[i]) {
      if (sq.result && sq.result[i]) return;
      this.seqRemove(sq.slots[i]);
    }
  }
  seqCheck = () => {
    const sq = this.state.mission.seq;
    if (sq.slots.some((x) => !x)) return;
    const result = sq.slots.map((id, i) => id === MISSION.sequence.correct[i]);
    const ok = result.every(Boolean);
    const checks = sq.checks + 1;
    this.mset({ seq: { ...sq, result, checks, solved: ok, hint: sq.hint || !ok } });
    this.log('seq', { attempt: checks, ok, correctCount: result.filter(Boolean).length });
    if (ok) this.tone('ok');
  };
  seqRetry = () => {
    const sq = this.state.mission.seq;
    this.mset({
      seq: { ...sq, slots: sq.slots.map((id, i) => (sq.result && sq.result[i] ? id : null)), result: null, sel: null }
    });
  };

  pickEv(i) {
    const m = this.state.mission;
    if (m.ev.solved || m.ev.picked.includes(i)) return;
    const picked = [...m.ev.picked, i];
    const ok = i === MISSION.evidence.correct;
    this.mset({ ev: { picked, solved: ok } });
    this.log('answer', { task: 'ev', attempt: picked.length, ok, choice: MISSION.sections[1][i] });
    if (ok) this.tone('ok');
  }

  finishMission = () => {
    this.setState((s) => ({ tools: s.tools.includes('goggles') ? s.tools : [...s.tools, 'goggles'] }));
    this.mset({ completed: true });
    this.log('complete');
    this.stageTo(7);
    this.tone('done');
  };

  hwValidate() {
    const h = this.state.hw;
    const secs = h.sections.map((x) => x.trim()).filter(Boolean);
    if (!secs.length) return 'Bontsd szakaszokra a szöveget, vagy adj hozzá egy szakaszt (2. lépés).';
    if (!h.question.trim()) return 'Írj be egy kérdést (3. lépés).';
    if (h.options.filter((o) => o.trim()).length < 2) return 'Adj meg legalább két válaszlehetőséget (4. lépés).';
    if (!(h.options[h.correct] || '').trim()) return 'A pipával jelölt helyes válasz mezője üres.';
    return null;
  }
  hwBuild(h) {
    return {
      sections: h.sections.map((x) => x.trim()).filter(Boolean),
      question: h.question.trim(),
      options: h.options.map((t, i) => ({ text: t.trim(), correct: i === h.correct })).filter((o) => o.text),
      picked: []
    };
  }

  baseVals() {
    const S = this.state,
      st = S.settings,
      m = S.mission;
    const wide = S.w >= 900,
      narrow = !wide,
      inMission = S.tab === 'mission',
      welcome = S.tab === 'welcome',
      big = S.w >= 1240,
      chrome = !inMission && !welcome;
    const rm = st.reducedMotion || S.sysRm;
    const name = (st.name || '').trim() || 'Hős';
    const gearCount = S.tools.length;
    const completedCount = S.events.filter((e) => e.type === 'complete').length > 0 ? 1 : 0;
    const inProgress = m.started && !m.completed && m.stage > 0;
    const missionBtnLabel = m.completed ? 'Újra játszom' : inProgress ? 'Küldetés folytatása' : 'Küldetés indítása';
    const listenMode = m.mode === 'listen' || m.mode === 'both';
    const nav = [
      ['home', 'Bázis', 'home'],
      ['map', 'Világok', 'explore'],
      ['gear', 'Felszerelés', 'backpack'],
      ['rest', 'Pihenő', 'nights_stay']
    ];
    const navItems = nav.map(([id, label, icon]) => {
      const on = S.tab === id;
      return {
        label,
        icon,
        onClick: () => this.go(id),
        current: on ? 'page' : 'false',
        bg: on ? 'rgba(243,197,104,.16)' : 'transparent',
        color: on ? '#F3C568' : '#CFC3A8'
      };
    });

    // map
    const hotspots = HOTSPOTS.map((h, i) => {
      const on = S.mapSel === h.id;
      return {
        ...h,
        n: i + 1,
        left: h.x + '%',
        top: h.y + '%',
        pressed: on ? 'true' : 'false',
        onClick: () => this.setState({ mapSel: on ? null : h.id }),
        showLabel: wide,
        pad: wide ? '6px 16px 6px 8px' : '8px',
        border: on ? '#F3C568' : 'rgba(255,244,223,.85)',
        bg: on ? '#F3C568' : 'rgba(16,45,53,.88)',
        color: on ? '#18343A' : '#FFF4DF',
        numBg: on ? '#18343A' : '#F3C568',
        numColor: on ? '#F3C568' : '#18343A',
        listBorder: on ? '#F3C568' : 'rgba(235,213,163,.18)',
        tag: h.playable ? 'Küldetés' : 'Előnézet',
        tagColor: h.playable ? '#F3C568' : '#CFC3A8'
      };
    });
    const selH = HOTSPOTS.find((h) => h.id === S.mapSel);

    // gear
    const toolView = (t) => {
      const u = S.tools.includes(t.id);
      return {
        ...t,
        unlocked: u,
        status: u ? 'Megszerezve' : 'Felfedezésre vár',
        statusIcon: u ? 'check_circle' : 'lock',
        statusColor: u ? '#91D7E8' : '#CFC3A8',
        opacity: u ? 1 : 0.5,
        filter: u ? 'none' : 'saturate(.35)',
        border: u ? 'rgba(145,215,232,.5)' : 'rgba(235,213,163,.14)',
        note: u
          ? 'Az első küldetésben szerezted meg. Az eszköz emlékeztet a stratégiára; a stratégiát te használod.'
          : 'Egy későbbi küldetésben szerezheted meg. A stratégiát addig is bármikor kipróbálhatod.',
        onClick: () => {
          this.setState({ gearSel: t.id });
          this.top();
        }
      };
    };
    const tools = TOOLS.map(toolView);
    const gd = S.gearSel ? toolView(TOOLS.find((t) => t.id === S.gearSel)) : null;

    // rest
    const restInfo =
      S.rest === 'quiet'
        ? {
            icon: 'dark_mode',
            title: 'Csendben pihenek',
            text: 'Nézd a bolygót és a csillagokat. Most nem kell semmit csinálnod. Ha készen állsz, kiléphetsz.'
          }
        : S.rest === 'move'
          ? {
              icon: 'accessibility_new',
              title: 'Mozdulok egy kicsit',
              text: 'Állj fel, ha kényelmes. Nyújtózz egyet, engedd le a vállad, majd érezd a talpadat a talajon.'
            }
          : { icon: '', title: '', text: '' };
    const sphereEl = React.createElement('div', {
      'aria-hidden': true,
      style: {
        width: 220,
        height: 220,
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 42% 38%, #FFF4DF 0%, #F3C568 38%, rgba(243,197,104,.25) 66%, rgba(243,197,104,0) 72%)',
        boxShadow: '0 0 90px rgba(243,197,104,.35)',
        animation: rm ? 'none' : 'novaBreathe 11s ease-in-out infinite',
        animationPlayState: S.breathPaused ? 'paused' : 'running',
        transform: rm ? 'scale(.82)' : undefined
      }
    });

    // mission segments
    const glossKey = (w) => {
      const l = w.toLowerCase();
      const g = MISSION.glossary.find((g) => l.startsWith(g.key));
      return g && g.key;
    };
    const secText = MISSION.sections[m.section].join(' ');
    const secSegs = secText
      .split(/((?:foglalat|energiamag|ellenőrzés)\p{L}*)/giu)
      .filter(Boolean)
      .map((t) => {
        const k = glossKey(t);
        const isWord = !!k && /^(foglalat|energiamag|ellenőrzés)/i.test(t);
        return {
          text: t,
          isWord,
          plain: !isWord,
          aria: isWord ? `${t} – szómagyarázat` : '',
          onClick: () => {
            this.setState({ sheet: { kind: 'glossary', word: k } });
            this.log('gloss', { word: k });
          }
        };
      });

    const qsel = m.q.picked;
    const qOptions = MISSION.question.options.map((o) => {
      const picked = qsel.includes(o.id);
      const showOk = picked && o.correct;
      const showNo = picked && !o.correct;
      return {
        text: o.text,
        onClick: () => this.pickQ(o.id),
        pressed: picked ? 'true' : 'false',
        showTag: picked,
        tag: showOk ? 'Helyes' : 'Nem ez',
        icon: showOk ? ICON_OK : ICON_NO,
        tagColor: showOk ? '#91D7E8' : '#EBD5A3',
        border: showOk ? '#91D7E8' : showNo ? 'rgba(235,213,163,.25)' : 'rgba(235,213,163,.3)',
        bg: showOk ? 'rgba(145,215,232,.14)' : '#1C454D',
        opacity: showNo || (m.q.solved && !picked) ? 0.6 : 1
      };
    });
    const qWrongCount = qsel.filter((id) => !MISSION.question.options.find((o) => o.id === id).correct).length;

    const sq = m.seq,
      EV = MISSION.sequence.events;
    const seqSlots = sq.slots.map((id, i) => {
      const r = sq.result ? sq.result[i] : null;
      const sel = !!sq.sel;
      return {
        label: MISSION.sequence.labels[i],
        filled: !!id,
        empty: !id,
        text: id ? EV[id].text : '',
        src: id ? EV[id].src : '',
        emptyText: sel ? 'Koppints ide a kiválasztott kártyáért' : 'Ide tedd a kártyát',
        aria: id
          ? `${MISSION.sequence.labels[i]}: ${EV[id].text}. Koppints a visszavételhez.`
          : `${MISSION.sequence.labels[i]}: üres hely`,
        onClick: () => this.seqTapSlot(i),
        onDragOver: (e) => e.preventDefault(),
        onDrop: (e) => {
          e.preventDefault();
          const d = this.dragId;
          this.dragId = null;
          if (d) this.seqPlace(d, i);
        },
        draggable: id && !sq.solved ? 'true' : 'false',
        onDragStart: (e) => {
          this.dragId = id;
          try {
            e.dataTransfer.setData('text/plain', id);
          } catch (_) {}
        },
        onTouchStart: id && !sq.solved ? touchDrag((to) => this.seqDropTo(id, to)) : undefined,
        borderStyle: id ? 'solid' : 'dashed',
        border:
          r === true
            ? '#91D7E8'
            : r === false
              ? '#EBD5A3'
              : id
                ? 'rgba(255,244,223,.0)'
                : sel
                  ? '#F3C568'
                  : 'rgba(235,213,163,.4)',
        bg: id ? '#FFF4DF' : sel ? 'rgba(243,197,104,.08)' : 'rgba(11,35,41,.4)',
        color: id ? '#18343A' : '#CFC3A8',
        showStatus: r !== null && r !== undefined,
        status: r ? 'Jó helyen' : 'Próbáld máshova',
        statusIcon: r ? ICON_OK : 'swap_vert',
        statusColor: r ? '#91D7E8' : '#EBD5A3'
      };
    });
    const pool = sq.order.filter((id) => !sq.slots.includes(id));
    const seqPool = pool.map((id) => {
      const on = sq.sel === id;
      return {
        text: EV[id].text,
        src: EV[id].src,
        pressed: on,
        onClick: () => this.seqTapCard(id),
        onDragStart: (e) => {
          this.dragId = id;
          try {
            e.dataTransfer.setData('text/plain', id);
          } catch (_) {}
        },
        onTouchStart: sq.solved ? undefined : touchDrag((to) => this.seqDropTo(id, to)),
        border: on ? '#F3C568' : 'transparent',
        shadow: on ? '0 10px 26px rgba(243,197,104,.3)' : '0 4px 14px rgba(4,18,22,.3)',
        lift: on && !rm ? 'translateY(-2px)' : 'none'
      };
    });
    const allFilled = sq.slots.every(Boolean);

    const evs = m.ev;
    const evSentences = MISSION.sections[1].map((t, i) => {
      const picked = evs.picked.includes(i);
      const ok = picked && i === MISSION.evidence.correct;
      return {
        text: t,
        onClick: () => this.pickEv(i),
        pressed: picked ? 'true' : 'false',
        showTag: picked,
        tag: ok ? 'Bizonyíték' : 'Nem ez',
        icon: ok ? ICON_OK : ICON_NO,
        tagColor: ok ? '#1F6F7E' : '#6B5A33',
        border: ok ? '#1F6F7E' : picked ? 'rgba(24,52,58,.18)' : 'transparent',
        bg: ok ? 'rgba(145,215,232,.35)' : 'transparent',
        weight: ok ? 800 : 500
      };
    });
    const evWrongCount = evs.picked.filter((i) => i !== MISSION.evidence.correct).length;

    const ex = m.ex;
    const exTabs = [
      ['spoken', 'Elmondom valakinek', 'record_voice_over'],
      ['write', 'Leírom röviden', 'edit_note']
    ].map(([k, label, icon]) => {
      const on = ex.kind === k;
      return {
        label,
        icon,
        selected: on ? 'true' : 'false',
        onClick: () => this.mset((mm) => ({ ex: { ...mm.ex, kind: k } })),
        border: on ? '#F3C568' : 'rgba(235,213,163,.25)',
        bg: on ? 'rgba(243,197,104,.14)' : '#1C454D',
        color: on ? '#F3C568' : '#F6EAD2'
      };
    });

    const glowEl = React.createElement('div', {
      'aria-hidden': true,
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(55% 60% at 50% 70%, rgba(145,215,232,.38), rgba(243,197,104,.10) 55%, transparent 75%)',
        animation: rm ? 'none' : 'novaGlow 1.8s ease-out both'
      }
    });

    // sheets
    const sh = S.sheet;
    const storySecs =
      sh && sh.kind === 'story'
        ? (sh.only != null ? [sh.only] : [0, 1, 2]).map((si) => ({
            label: `${si + 1}. rész`,
            sentences: MISSION.sections[si].map((t, j) => ({
              text: t,
              bg: sh.mark && sh.mark[0] === si && sh.mark[1] === j ? 'rgba(243,197,104,.55)' : 'transparent'
            }))
          }))
        : [];
    const sheetTitle = !sh
      ? ''
      : sh.kind === 'glossary'
        ? 'Szómagyarázat'
        : sh.kind === 'story'
          ? 'A történet'
          : sh.kind === 'help'
            ? 'Segítség'
            : 'Profil';
    const helpActions = [
      !S.helpHint && {
        icon: 'lightbulb',
        label: 'Kérek egy tippet',
        sub: 'Egy kis nyom a mostani feladathoz',
        onClick: () => {
          this.setState({ helpHint: true });
          this.log('hint', { stage: m.stage });
        }
      },
      {
        icon: 'menu_book',
        label: 'Újraolvasom a történetet',
        sub: 'Mindhárom rész egyben',
        onClick: () => {
          this.setState({ sheet: { kind: 'story', only: null } });
          this.log('reread', { section: 'all' });
        }
      },
      {
        icon: 'diamond',
        label: 'Szómagyarázat',
        sub: 'foglalat, energiamag, ellenőrzés',
        onClick: () => {
          this.setState({ sheet: { kind: 'glossary' } });
          this.log('gloss', { word: 'lista' });
        }
      },
      {
        icon: 'nights_stay',
        label: 'Szünetet kérek',
        sub: 'Átmegyünk a Pihenőbe, a küldetés megvárja',
        onClick: () => {
          this.log('break');
          this.go('rest', { restFromMission: true });
        }
      }
    ].filter(Boolean);

    // parent overview from real events
    const E = S.events,
      cnt = (t) => E.filter((e) => e.type === t).length;
    const modeTxt =
      Object.keys(MODES)
        .map((k) => [k, E.filter((e) => e.type === 'mode' && e.mode === k).length])
        .filter((x) => x[1])
        .map(([k, n]) => `${MODES[k]} (${n})`)
        .join(', ') || '–';
    const ans = E.filter((e) => e.type === 'answer' && e.ok);
    const indep = ans.filter((e) => e.attempt === 1).length;
    const seqE = E.filter((e) => e.type === 'seq');
    const seqFirst = seqE.filter((e) => e.attempt === 1);
    const retells = E.filter((e) => e.type === 'retell');
    const obsRows = [
      ['Elindított küldetések', cnt('start')],
      ['Befejezett küldetések', cnt('complete')],
      ['Használt gyakorlási módok', modeTxt],
      ['Önálló helyes válaszok (első próbálkozásra)', indep],
      ['Segítség után helyes válaszok', ans.length - indep],
      ['Kért tippek', cnt('hint')],
      ['Újraolvasások', cnt('reread')],
      ['Megnyitott szómagyarázatok', cnt('gloss')],
      ['Meghallgatott részek', cnt('audio')],
      [
        'Sorrendfeladat',
        seqE.length
          ? `${seqE.length} ellenőrzés · első ellenőrzésre helyes: ${seqFirst.filter((e) => e.ok).length}/${seqFirst.length}`
          : '–'
      ],
      [
        'Elmesélés',
        retells.length
          ? retells.map((e) => (e.kind === 'spoken' ? 'elmondta (felnőtt jelölte)' : 'leírta')).join(', ')
          : '–'
      ],
      ['Szünetkérések', cnt('break')],
      ['Ismételt küldetések (gyakorlás)', Math.max(0, cnt('start') - 1)]
    ].map(([label, value]) => ({ label, value: String(value) }));
    const evText = (e) => {
      switch (e.type) {
        case 'start':
          return 'Küldetés elindítva: Az eltűnt energiamag';
        case 'mode':
          return 'Gyakorlási mód: ' + MODES[e.mode];
        case 'answer':
          return `${e.task === 'q' ? 'Ok-okozat kérdés' : 'Bizonyítékkeresés'}, ${e.attempt}. próbálkozás: ${e.ok ? (e.attempt === 1 ? 'helyes, önállóan' : 'helyes, segítség után') : 'másik válasz – „' + e.choice + '”'}`;
        case 'hint':
          return e.practice ? 'Tippet kért (gyakorlás)' : `Tippet kért (${STAGES[e.stage]})`;
        case 'reread':
          return e.section === 'all' ? 'Újraolvasta a teljes történetet' : `Újraolvasás (${e.section + 1}. rész)`;
        case 'gloss':
          return e.word === 'lista' ? 'Megnyitotta a szómagyarázatot' : 'Szómagyarázat: ' + e.word;
        case 'audio':
          return 'Felolvasás indítva';
        case 'seq':
          return `Sorrend ellenőrzése (${e.attempt}.): ${e.correctCount}/3 jó helyen`;
        case 'retell':
          return e.kind === 'spoken' ? 'Elmesélés: elmondta valakinek (felnőtt jelölte)' : 'Elmesélés: leírta';
        case 'complete':
          return 'Küldetés befejezve';
        case 'break':
          return 'Szünetet kért';
        case 'p_start':
          return e.single ? 'Gyakorlás elindítva' : 'Napi hősküldetés elindítva';
        case 'p_end':
          return 'Gyakorlás befejezve';
        case 'p_support':
          return 'Újraolvasás / újrahallgatás (gyakorlás)';
        case 'transcript':
          return 'Átiratot nyitott meg';
        case 'p_said':
          return 'Elmondta a lényeget (felnőtt jelölte)';
        default:
          return e.type;
      }
    };
    const eventRows = E.slice(-20)
      .reverse()
      .map((e) => ({ time: fmt(e.t), text: evText(e) }));
    const retellTexts = retells
      .filter((e) => e.kind === 'write' && e.text)
      .slice(-3)
      .reverse()
      .map((e) => ({ text: e.text, time: fmt(e.t) }));

    const pTabs = [
      ['overview', 'Áttekintés'],
      ['settings', 'Beállítások'],
      ['homework', 'Saját szöveg']
    ].map(([id, label]) => {
      const on = S.pTab === id;
      return {
        label,
        selected: on ? 'true' : 'false',
        onClick: () => this.setState({ pTab: id, hwPreview: null, hwMsg: '' }),
        bg: on ? '#EBD5A3' : 'transparent',
        color: on ? '#18343A' : '#E4D8BE'
      };
    });
    const rateOpts = [
      [0.8, 'Lassabb'],
      [1, 'Normál'],
      [1.2, 'Gyorsabb']
    ].map(([r, label]) => {
      const on = st.rate === r;
      return {
        label,
        pressed: on ? 'true' : 'false',
        onClick: () => this.setSettings({ rate: r }),
        border: on ? '#91D7E8' : 'rgba(235,213,163,.3)',
        bg: on ? 'rgba(145,215,232,.16)' : 'transparent',
        color: on ? '#91D7E8' : '#F6EAD2'
      };
    });
    const tg = (label, sub, on, fn) => ({
      label,
      sub,
      on: on ? 'true' : 'false',
      onClick: fn,
      track: on ? '#91D7E8' : 'rgba(235,213,163,.25)',
      knob: on ? '30px' : '4px'
    });
    const toggles = [
      tg('Hangeffektek', 'Halk jelzőhang helyes válasznál. Alapból kikapcsolva.', st.sound, () =>
        this.setSettings({ sound: !st.sound })
      ),
      tg('Csökkentett mozgás', 'Kikapcsolja az átmeneteket és a fényanimációkat.', st.reducedMotion, () =>
        this.setSettings({ reducedMotion: !st.reducedMotion })
      )
    ];
    const narrStatusText =
      S.narr === null
        ? 'Felolvasóhang keresése…'
        : S.narr
          ? 'Magyar felolvasóhang elérhető ezen az eszközön.'
          : 'Ezen az eszközön nem érhető el magyar felolvasóhang, ezért a sebesség most nem számít.';

    const hw = S.hw;
    const hwSections = hw.sections.map((t, i) => ({
      n: i + 1,
      text: t,
      aria: `${i + 1}. szakasz`,
      onChange: (e) => {
        const v = e.target.value;
        this.setState((s) => {
          const a = [...s.hw.sections];
          a[i] = v;
          return { hw: { ...s.hw, sections: a } };
        });
      },
      onRemove: () => this.setState((s) => ({ hw: { ...s.hw, sections: s.hw.sections.filter((_, j) => j !== i) } }))
    }));
    const hwOptions = hw.options.map((t, i) => {
      const on = hw.correct === i;
      return {
        text: t,
        ph: `${i + 1}. válaszlehetőség`,
        isCorrect: on ? 'true' : 'false',
        radioLabel: `${i + 1}. lehetőség a helyes válasz`,
        icon: on ? 'check' : '',
        border: on ? '#91D7E8' : 'rgba(235,213,163,.3)',
        bg: on ? '#91D7E8' : 'transparent',
        color: '#18343A',
        onCorrect: () => this.setHw({ correct: i }),
        onChange: (e) => {
          const v = e.target.value;
          this.setState((s) => {
            const a = [...s.hw.options];
            a[i] = v;
            return { hw: { ...s.hw, options: a } };
          });
        }
      };
    });
    const pv = S.hwPreview;
    const pvPicked = pv ? pv.picked : [];
    const pvOptions = pv
      ? pv.options.map((o, i) => {
          const picked = pvPicked.includes(i);
          const ok = picked && o.correct;
          return {
            text: o.text,
            showTag: picked,
            tag: ok ? 'Helyes' : 'Nem ez',
            icon: ok ? ICON_OK : ICON_NO,
            tagColor: ok ? '#91D7E8' : '#EBD5A3',
            border: ok ? '#91D7E8' : 'rgba(235,213,163,.3)',
            bg: ok ? 'rgba(145,215,232,.14)' : '#1C454D',
            onClick: () =>
              this.setState((s) =>
                s.hwPreview.picked.includes(i) ||
                s.hwPreview.options.some((oo, j) => oo.correct && s.hwPreview.picked.includes(j))
                  ? null
                  : { hwPreview: { ...s.hwPreview, picked: [...s.hwPreview.picked, i] } }
              )
          };
        })
      : [];
    const pvSolved = pv && pv.options.some((o, i) => o.correct && pvPicked.includes(i));
    const pvFeedback =
      !pv || !pvPicked.length
        ? ''
        : pvSolved
          ? 'Helyes válasz! Megtaláltad a szövegben.'
          : 'Nézd meg újra a szöveget, és próbálkozz egy másik válasszal!';

    const sheetOpen = !!sh;
    return {
      rootDir: wide ? 'row' : 'column',
      isWide: wide,
      isNarrow: narrow,
      showHeroRight: big,
      showPortraitM: wide && !big,
      showPortraitS: narrow,
      showRail: wide && chrome,
      showBottomNav: narrow && chrome,
      mainPadBottom: narrow && chrome ? '92px' : '0',
      sWelcome: welcome,
      enterAcademy: () => this.go('home'),
      welcomeGrid: wide ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr',
      welcomeAlign: wide ? 'flex-start' : 'center',
      welcomeText: wide ? 'left' : 'center',
      welcomeTextOrder: wide ? 0 : 1,
      welcomeHeroOrder: wide ? 1 : 0,
      welcomeHeroH: wide ? 'min(76vh,720px)' : 'min(38vh,340px)',
      starSize: wide ? '120px' : '72px',
      wordmarkSize: wide ? '88px' : '56px',
      welcomeLead: wide ? '30px' : '22px',
      welcomePad: wide ? '48px 64px' : '28px 20px 36px',
      welcomeScrim: wide
        ? 'linear-gradient(90deg, rgba(16,45,53,.94) 0%, rgba(16,45,53,.8) 45%, rgba(16,45,53,.45) 100%)'
        : 'linear-gradient(180deg, rgba(16,45,53,.55) 0%, rgba(16,45,53,.72) 42%, rgba(16,45,53,.96) 68%)',
      homeGrid: big ? 'minmax(0,1fr) minmax(300px,.62fr)' : 'minmax(0,1fr)',
      homeGap: wide ? '22px' : '18px',
      greetGap: wide ? '20px' : '14px',
      leadSize: wide ? '19px' : '17px',
      cardCols: wide ? '45fr 55fr' : '1fr',
      cardImgAspect: wide ? 'auto' : '16/7',
      cardImgMinH: wide ? '260px' : '0',
      cardPad: wide ? '26px 28px' : '18px 18px 20px',
      cardTitleSize: wide ? '30px' : '24px',
      ctaAlign: wide ? 'flex-start' : 'stretch',
      heroH: 'min(78vh,720px)',
      navItems,
      name,
      initial: name.charAt(0).toUpperCase(),
      openProfile: () => this.setState({ sheet: { kind: 'profile' } }),
      sHome: S.tab === 'home',
      sMap: S.tab === 'map',
      sGear: S.tab === 'gear',
      sRest: S.tab === 'rest',
      sParent: S.tab === 'parent',
      sMission: inMission,
      h1Size: wide ? '42px' : '32px',
      h2Size: wide ? '34px' : '27px',
      pagePad: wide ? '44px 52px 56px' : '22px 18px 28px',
      // home
      homeMinH: wide ? '100dvh' : 'auto',
      homeBgH: wide ? '100%' : '300px',
      homePad: big ? '40px 48px' : wide ? '32px 36px' : '14px 16px 24px',
      homeMaxW: wide ? '660px' : 'none',
      greetMinH: narrow ? '210px' : '0',
      ctaFlex: narrow ? '1 1 100%' : '0 0 auto',
      homeScrim: big
        ? 'linear-gradient(90deg, rgba(16,45,53,.96) 0%, rgba(16,45,53,.92) 52%, rgba(16,45,53,.62) 76%, rgba(16,45,53,.42) 100%)'
        : wide
          ? 'radial-gradient(120% 100% at 40% 50%, rgba(16,45,53,.95) 45%, rgba(16,45,53,.68) 100%)'
          : 'linear-gradient(180deg, rgba(16,45,53,.6) 0%, rgba(16,45,53,.86) 140px, #102D35 300px)',
      missionDone: m.completed,
      missionInProgress: inProgress,
      savedStageName: STAGES[m.stage],
      missionBtnLabel,
      startMission: this.startMission,
      destCols: wide ? 'repeat(3,minmax(0,1fr))' : '1fr',
      destCards: [
        { icon: 'explore', label: 'Fedezd fel a világot', sub: '6 sziget a térképen', onClick: () => this.go('map') },
        {
          icon: 'backpack',
          label: 'Hősfelszerelésem',
          sub: `${gearCount} / 5 eszköz megszerezve`,
          onClick: () => this.go('gear')
        },
        {
          icon: 'air',
          label: 'Egy perc megérkezés',
          sub: 'Nyugodt légzés a Pihenőben',
          onClick: () => this.go('rest', { rest: 'breath' })
        }
      ],
      completedCount,
      gearCount,
      // map
      hotspots,
      mapHasSel: !!selH,
      mapSel: selH
        ? { label: selH.label, purpose: selH.purpose, playable: !!selH.playable, soon: !selH.playable }
        : { label: '', purpose: '', playable: false, soon: false },
      mapClose: () => this.setState({ mapSel: null }),
      // gear
      tools,
      gearList: !gd,
      gearDetail: !!gd,
      gd: gd || { steps: [] },
      gearBack: () => this.setState({ gearSel: null }),
      gearCols: big ? 'repeat(5,minmax(0,1fr))' : wide ? 'repeat(3,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))',
      detailCols: wide ? 'minmax(0,1fr) minmax(0,1.2fr)' : '1fr',
      detailPad: wide ? '32px' : '18px',
      // rest
      restMinH: narrow ? 'calc(100dvh - 92px)' : '100dvh',
      restMenu: !S.rest,
      restBreath: S.rest === 'breath',
      restText: S.rest === 'quiet' || S.rest === 'move',
      restInfo,
      sphereEl,
      rmOn: rm,
      restChoices: [
        { icon: 'dark_mode', label: 'Csendben pihenek', onClick: () => this.setState({ rest: 'quiet' }) },
        {
          icon: 'air',
          label: 'Lassan megérkezem',
          onClick: () => this.setState({ rest: 'breath', breathPaused: false })
        },
        { icon: 'accessibility_new', label: 'Mozdulok egy kicsit', onClick: () => this.setState({ rest: 'move' }) }
      ],
      toggleBreath: () => this.setState((s) => ({ breathPaused: !s.breathPaused })),
      breathLabel: S.breathPaused ? 'Folytatás' : 'Szünet',
      breathIcon: S.breathPaused ? 'play_arrow' : 'pause',
      restExit: () => this.setState({ rest: null }),
      restFromMission: S.restFromMission && m.started && !m.completed && !S.rest,
      // parent
      pGate: !S.parentIn,
      pIn: S.parentIn,
      pinTitle: S.pinCode ? 'Add meg a PIN-kódot' : 'Állíts be egy PIN-kódot',
      pinBtn: S.pinCode ? 'Belépés' : 'PIN beállítása és belépés',
      pinInput: S.pinInput,
      pinErr: S.pinErr,
      onPin: (e) => this.setState({ pinInput: e.target.value.replace(/\D/g, '').slice(0, 4), pinErr: '' }),
      pinKey: (e) => {
        if (e.key === 'Enter') this.submitPin();
      },
      submitPin: () => this.submitPin(),
      leaveParent: () => this.go('home', { parentIn: false, pinInput: '' }),
      goParent: () => this.go('parent', { parentIn: false, pinInput: '', pinErr: '' }),
      pTabs,
      pOverview: S.pTab === 'overview',
      pSettings: S.pTab === 'settings',
      pHomework: S.pTab === 'homework',
      hasActivity: E.length > 0,
      noActivity: E.length === 0,
      obsRows,
      eventRows,
      retellTexts,
      hasRetellTexts: retellTexts.length > 0,
      noteDraft: S.noteDraft,
      onNoteDraft: (e) => this.setState({ noteDraft: e.target.value }),
      addNote: () => {
        const t = S.noteDraft.trim();
        if (!t) return;
        this.setState((s) => ({ notes: [{ t: Date.now(), text: t }, ...s.notes], noteDraft: '' }));
      },
      notes: S.notes.map((n, i) => ({
        text: n.text,
        time: fmt(n.t),
        onDelete: () => this.setState((s) => ({ notes: s.notes.filter((_, j) => j !== i) }))
      })),
      nameVal: st.name,
      onName: (e) => this.setSettings({ name: e.target.value.slice(0, 24) }),
      textSize: st.textSize,
      textSizeLabel: st.textSize + ' px',
      onTextSize: (e) => this.setSettings({ textSize: +e.target.value }),
      readSize: st.textSize + 'px',
      rateOpts,
      narrStatusText,
      toggles,
      confirmClear: S.confirmClear,
      notConfirmClear: !S.confirmClear,
      askClear: () => this.setState({ confirmClear: true }),
      cancelClear: () => this.setState({ confirmClear: false }),
      doClear: () => {
        Narrator.stop();
        this.setState({
          mission: freshMission(),
          events: [],
          tools: [],
          notes: [],
          hw: blankHw(),
          hwSaved: [],
          confirmClear: false,
          hwPreview: null
        });
      },
      hw,
      hwEditing: !pv,
      hwPreviewing: !!pv,
      hwSections,
      hwNoSections: !hw.sections.length,
      hwOptions,
      hwMsg: S.hwMsg,
      onHwText: (e) => this.setHw({ text: e.target.value }),
      onHwQuestion: (e) => this.setHw({ question: e.target.value }),
      hwSplit: () => this.hwSplit(),
      hwAddSection: () => this.setHw({ sections: [...hw.sections, ''] }),
      hwPreviewOpen: () => {
        const err = this.hwValidate();
        if (err) {
          this.setState({ hwMsg: err });
          return;
        }
        this.setState({ hwPreview: this.hwBuild(hw), hwMsg: '' });
        this.top();
      },
      hwSave: () => {
        const err = this.hwValidate();
        if (err) {
          this.setState({ hwMsg: err });
          return;
        }
        const b = this.hwBuild(hw);
        this.setState((s) => ({
          hwSaved: [{ id: Date.now(), t: Date.now(), ...b }, ...s.hwSaved],
          hwMsg: 'Elmentve ezen az eszközön.'
        }));
      },
      hwHasSaved: S.hwSaved.length > 0,
      hwSaved: S.hwSaved.map((x, i) => ({
        title: x.question,
        meta: `${x.sections.length} szakasz · ${x.options.length} válasz · ${fmt(x.t)}`,
        onOpen: () => {
          this.setState({ hwPreview: { ...x, picked: [] } });
          this.top();
        },
        onDelete: () => this.setState((s) => ({ hwSaved: s.hwSaved.filter((_, j) => j !== i) }))
      })),
      pv: pv || { question: '' },
      pvSections: pv ? pv.sections.map((t, i) => ({ label: `${i + 1}. rész`, text: t })) : [],
      pvOptions,
      pvFeedback,
      pvClose: () => this.setState({ hwPreview: null }),
      // mission chrome
      exitMission: () => this.go('home'),
      exitLabel: wide ? 'Kilépés' : 'Ki',
      openHelp: () => this.setState({ sheet: { kind: 'help' }, helpHint: false }),
      helpLabel: wide ? 'Segítség' : 'Súgó',
      stageNum: `${m.stage + 1}/8`,
      stageName: STAGES[m.stage],
      stageDots: STAGES.map((_, i) => ({
        w: i === m.stage ? '22px' : '8px',
        bg: i < m.stage ? '#F3C568' : i === m.stage ? '#91D7E8' : 'rgba(235,213,163,.25)'
      })),
      showTopAudio: listenMode && S.narr && (m.stage === 3 || m.stage === 5),
      topAudioIcon: S.speaking ? 'stop_circle' : 'volume_up',
      topAudioLabel: S.speaking ? 'Felolvasás leállítása' : 'Kérdés meghallgatása',
      topAudio: () =>
        m.stage === 3
          ? this.speak('q', 'Miért aludtak ki a híd lámpái? ' + MISSION.question.options.map((o) => o.text).join(' '))
          : this.speak(
              'ev',
              'Melyik mondatból tudjuk, hogy a szerelő befejezte a munkát? ' + MISSION.sections[1].join(' ')
            ),
      missionPad: wide ? '36px 32px 60px' : '20px 18px 40px',
      st0: m.stage === 0,
      st1: m.stage === 1,
      st2: m.stage === 2,
      st3: m.stage === 3,
      st4: m.stage === 4,
      st5: m.stage === 5,
      st6: m.stage === 6,
      st7: m.stage === 7,
      begin: () => this.stageTo(1),
      modes: Object.keys(MODES).map((k) => {
        const dis = k !== 'read' && S.narr !== true;
        const on = m.mode === k;
        return {
          label: MODES[k],
          icon: k === 'read' ? 'menu_book' : k === 'listen' ? 'headphones' : 'auto_stories',
          desc:
            k === 'read'
              ? 'Saját tempóban olvasod a szöveget.'
              : k === 'listen'
                ? 'Felolvasva hallod, a szöveget bármikor megnyithatod.'
                : 'Látod a szöveget, és közben meg is hallgathatod.',
          disabled: dis,
          cursor: dis ? 'not-allowed' : 'pointer',
          opacity: dis ? 0.55 : 1,
          border: on ? '#F3C568' : 'rgba(235,213,163,.22)',
          onClick: () => this.setMode(k)
        };
      }),
      narrNotice: S.narr !== true,
      narrNoticeText:
        S.narr === null
          ? 'Felolvasóhang keresése ezen az eszközön…'
          : 'Ezen az eszközön most nem érhető el magyar felolvasóhang, ezért a meghallgatás nem indítható. Az Elolvasom mód teljesen működik, és egy felnőtt is felolvashatja a szöveget.',
      secLabel: `A történet ${m.section + 1}/3. része`,
      secBars: [0, 1, 2].map((i) => ({ bg: i <= m.section ? '#F3C568' : 'rgba(235,213,163,.25)' })),
      secSegs,
      textVisible: m.showText,
      textHidden: !m.showText,
      toggleText: () => this.mset({ showText: true }),
      showSecAudio: listenMode && !!S.narr && m.showText,
      playSection: () => this.speak('s' + m.section, secText),
      playIcon: S.speaking === 's' + m.section ? 'stop_circle' : 'play_arrow',
      playLabel: S.speaking === 's' + m.section ? 'Felolvasás leállítása' : 'Meghallgatom',
      playBtnLabel: S.speaking === 's' + m.section ? 'Leállítás' : 'Meghallgatom',
      readBack: this.readBack,
      readNext: this.readNext,
      readPad: wide ? '34px 40px' : '22px 22px',
      evPad: wide ? '22px 20px' : '16px 10px',
      openGlossary: () => {
        this.setState({ sheet: { kind: 'glossary' } });
        this.log('gloss', { word: 'lista' });
      },
      qOptions,
      qWrong: qWrongCount > 0 && !m.q.solved,
      qGuided: qWrongCount >= 2,
      qHintOnly: qWrongCount === 1,
      qSolved: m.q.solved,
      openStory2: () => {
        this.setState({ sheet: { kind: 'story', only: 1, mark: qWrongCount >= 2 ? [1, 0] : null } });
        this.log('reread', { section: 1 });
      },
      toStage4: () => this.stageTo(4),
      seqSlots,
      seqPool,
      seqPoolHas: pool.length > 0,
      poolDragOver: (e) => e.preventDefault(),
      poolDrop: (e) => {
        e.preventDefault();
        const d = this.dragId;
        this.dragId = null;
        if (d) this.seqRemove(d);
      },
      seqHintShow: sq.hint && !sq.solved,
      seqShowHintBtn: !sq.hint && !sq.solved,
      seqHint: () => {
        this.mset((mm) => ({ seq: { ...mm.seq, hint: true } }));
        this.log('hint', { stage: 4 });
      },
      seqSolved: sq.solved,
      seqCanRetry: !!sq.result && !sq.solved,
      seqCanCheckShow: !sq.result && !sq.solved,
      seqCheck: this.seqCheck,
      seqRetry: this.seqRetry,
      seqCheckDisabled: !allFilled,
      seqCheckOpacity: allFilled ? 1 : 0.45,
      toStage5: () => this.stageTo(5),
      evSentences,
      evWrong: evWrongCount > 0 && !evs.solved,
      evWrongText: evWrongCount >= 2 ? MISSION.evidence.wrong2 : MISSION.evidence.wrong1,
      evSolved: evs.solved,
      toStage6: () => this.stageTo(6),
      exGuides: ['Mi volt a probléma?', 'Mit derített ki Mira?', 'Hogyan oldódott meg a helyzet?'],
      exTabs,
      exSpokenOpen: ex.kind === 'spoken',
      exWriteOpen: ex.kind === 'write',
      exSpoken: ex.spoken,
      exNotSpoken: !ex.spoken,
      markSpoken: () => {
        this.mset((mm) => ({ ex: { ...mm.ex, spoken: true } }));
        this.log('retell', { kind: 'spoken' });
        this.tone('ok');
      },
      exText: ex.text,
      onExText: (e) => {
        const v = e.target.value;
        this.setState({ exMsg: '' });
        this.mset((mm) => ({ ex: { ...mm.ex, text: v, saved: false } }));
      },
      exSaved: ex.saved,
      exMsg: S.exMsg,
      saveEx: () => {
        if (ex.text.trim().length < 3) {
          this.setState({ exMsg: 'Írj le legalább egy rövid mondatot.' });
          return;
        }
        this.mset((mm) => ({ ex: { ...mm.ex, saved: true } }));
        this.log('retell', { kind: 'write', text: ex.text.trim() });
      },
      exCanFinish: ex.spoken || ex.saved,
      finishMission: this.finishMission,
      glowEl,
      resAspect: wide ? '16/8' : '4/3',
      goHome: () => this.go('home'),
      goGearGoggles: () => this.go('gear', { gearSel: 'goggles' }),
      // sheets
      sheetOpen,
      closeSheet: () => this.setState({ sheet: null }),
      stop: (e) => e.stopPropagation(),
      sheetTitle,
      sheetAlign: wide ? 'center' : 'flex-end',
      sheetRadius: wide ? '26px' : '26px 26px 0 0',
      sheetOuterPad: wide ? '24px' : '0',
      shGlossary: !!sh && sh.kind === 'glossary',
      shStory: !!sh && sh.kind === 'story',
      shHelp: !!sh && sh.kind === 'help',
      shProfile: !!sh && sh.kind === 'profile',
      glossList: MISSION.glossary.map((g) => ({
        word: g.word,
        def: g.def,
        border: sh && sh.word === g.key ? '#F3C568' : 'transparent'
      })),
      storySecs,
      helpActions,
      helpHintShown: S.helpHint,
      helpHintText: MISSION.hints[m.stage]
    };
  }

  renderVals() {
    const b = this.baseVals();
    return { ...b, ...this.practiceVals(b), ...this.splashVals() };
  }
  splashVals() {
    const s = this.state.splash == null ? 5 : this.state.splash;
    const E = React.createElement;
    const dot = (x, y, anim, extra) => ({
      position: 'absolute',
      left: x,
      top: y,
      pointerEvents: 'none',
      animation: anim,
      ...extra
    });
    const fx = E(
      'div',
      { 'aria-hidden': true, style: { position: 'absolute', inset: 0, pointerEvents: 'none' } },
      s >= 2 &&
        s < 5 &&
        E('div', {
          key: 'w',
          style: dot('68.8%', '39.3%', 'novaWatch 1.3s ease-in-out both', {
            width: '9%',
            aspectRatio: '1',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(145,215,232,.95) 0%, rgba(145,215,232,.45) 40%, rgba(145,215,232,0) 70%)'
          })
        }),
      s >= 2 &&
        s < 4 &&
        E('div', {
          key: 'wr',
          style: dot('68.8%', '39.3%', 'novaRing 1.2s ease-out .15s both', {
            width: '7%',
            aspectRatio: '1',
            borderRadius: '50%',
            border: '2px solid rgba(145,215,232,.8)'
          })
        }),
      s >= 3 &&
        s < 4 &&
        E('div', {
          key: 'bm',
          style: dot('60%', '34.5%', 'novaBeam .9s ease-out both', {
            width: '20%',
            height: '3px',
            borderRadius: '3px',
            transformOrigin: '100% 50%',
            rotate: '-30deg',
            background: 'linear-gradient(90deg, rgba(243,197,104,0), rgba(243,197,104,.9), rgba(145,215,232,.9))'
          })
        }),
      s >= 3 &&
        E('div', {
          key: 'h',
          style: dot('52.2%', '29.8%', 'novaHalo 1.4s ease-out both', {
            width: '26%',
            aspectRatio: '1',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,228,160,.9) 0%, rgba(243,197,104,.5) 30%, rgba(243,197,104,0) 68%)'
          })
        }),
      s >= 3 &&
        E('img', {
          key: 'c',
          src: 'assets/nova-star.webp',
          alt: '',
          style: dot('52.2%', '29.8%', 'novaChest 1.1s cubic-bezier(.2,.9,.3,1.2) both', {
            width: '9%',
            height: 'auto',
            filter: 'drop-shadow(0 0 10px rgba(255,236,180,.95)) drop-shadow(0 0 22px rgba(243,197,104,.8))'
          })
        })
    );
    return {
      splashFx: fx,
      splashRunning: this.state.tab === 'welcome' && s < 5,
      splashSkip: () => {
        if (s < 5) {
          (this.splashT || []).forEach(clearTimeout);
          this.setState({ splash: 5 });
        }
      },
      sHeroOp: s >= 1 ? 1 : 0,
      sHeroTf: s >= 1 ? 'none' : 'translateY(28px)',
      sLogoOp: s >= 4 ? 1 : 0,
      sLogoTf: s >= 4 ? 'none' : 'scale(.9) translateY(10px)',
      sTextOp: s >= 5 ? 1 : 0,
      sTextTf: s >= 5 ? 'none' : 'translateY(12px)'
    };
  }
  curAct() {
    const ps = this.state.ps;
    if (!ps) return null;
    const it = ps.plan[ps.idx];
    if (!it) return null;
    const a = ACTS[it.act];
    const tasks = it.type === 'later' ? [{ ...a.later, type: 'later' }] : a.tasks;
    return { it, a, tasks, task: tasks[Math.min(ps.taskIdx, tasks.length - 1)] };
  }
  pset(p) {
    this.setState((s) => (s.ps ? { ps: { ...s.ps, ...(typeof p === 'function' ? p(s.ps) : p) } } : null));
  }
  rset(p) {
    this.setState((s) =>
      s.ps ? { ps: { ...s.ps, run: { ...s.ps.run, ...(typeof p === 'function' ? p(s.ps.run) : p) } } } : null
    );
  }
  reminder() {
    const n = this.state.prog.sessions;
    return n < 2 ? 'full' : n < 5 ? 'compact' : 'minimal';
  }
  modeFor(p) {
    return p === 'listen' ? 'listen' : 'read';
  }
  pickAct(path) {
    const P = this.state.prog;
    const L = (P.levels || {})[path] || 1;
    const all = Object.keys(ACTS).filter((k) => ACTS[k].path === path);
    for (let l = L; l >= 1; l--) {
      const c = all.filter((k) => ACTS[k].level === l);
      if (c.length) {
        c.sort((x, y) => (P.done[x] || 0) - (P.done[y] || 0));
        return c[0];
      }
    }
    return all[0];
  }
  buildPlan() {
    const P = this.state.prog;
    const odd = P.sessions % 2 === 1;
    const order = odd ? ['listen', 'main', 'read', 'seq'] : ['read', 'seq', 'listen', 'main'];
    const n = this.state.settings.sessionLen || 3;
    const plan = order.slice(0, n).map((p) => ({ type: 'act', act: this.pickAct(p), path: p }));
    if (ACTS[plan[0].act].later) plan.push({ type: 'later', act: plan[0].act, path: plan[0].path });
    return plan;
  }
  startSession(path) {
    const S = this.state;
    Narrator.stop();
    if (!path && S.ps && !S.ps.single && S.ps.phase !== 'end') {
      this.setState({ tab: 'practice', sheet: null, helpHint: false, speaking: null });
      this.top();
      return;
    }
    if (!path && S.psSaved) {
      this.setState({ ps: S.psSaved, psSaved: null, tab: 'practice', sheet: null, helpHint: false, speaking: null });
      this.top();
      return;
    }
    const keep = path && S.ps && !S.ps.single && S.ps.phase !== 'end' ? S.ps : S.psSaved || null;
    const plan = path ? [{ type: 'act', act: this.pickAct(path), path }] : this.buildPlan();
    const mode = this.modeFor(plan[0].path);
    const ps = {
      id: Date.now(),
      single: !!path,
      plan,
      idx: 0,
      taskIdx: 0,
      phase: !path && this.reminder() === 'full' ? 'intro' : 'present',
      mode,
      showText: mode !== 'listen',
      played: false,
      adultShow: false,
      adultRead: false,
      prevPhase: null,
      run: freshRun(ACTS[plan[0].act].tasks[0])
    };
    this.setState({ ps, psSaved: path ? keep : null, tab: 'practice', sheet: null, helpHint: false, speaking: null });
    this.log('p_start', { single: !!path });
    this.top();
  }
  pSpeak = () => {
    const ps = this.state.ps;
    const c = this.curAct();
    if (!c) return;
    const id = 'p' + c.it.act;
    if (this.state.speaking === id) {
      Narrator.stop();
      this.setState({ speaking: null });
      return;
    }
    if (ps.played || ps.phase === 'task') this.rset((r) => ({ replays: r.replays + 1 }));
    this.setState({ speaking: id });
    Narrator.speak(id, c.a.sentences.join(' '), this.state.settings.rate, () => {
      this.setState((s) => (s.speaking === id ? { speaking: null } : null));
      this.pset({ played: true });
    });
    this.log('audio', { id });
  };
  pTranscript = () => {
    this.rset({ transcript: true, supportOpen: true });
    this.pset({ showText: true });
    this.log('transcript');
  };
  pSupport = () => {
    const ps = this.state.ps;
    const listen = ps.mode === 'listen';
    this.log('p_support');
    if (listen && this.state.narr === true) {
      this.pSpeak();
      return;
    }
    if (listen) this.rset((r) => ({ replays: r.replays + 1, supportOpen: true }));
    else this.rset((r) => ({ rereads: r.rereads + 1, supportOpen: true }));
  };
  record(c, r) {
    const ps = this.state.ps;
    const x = {
      t: Date.now(),
      sid: ps.id,
      act: c.it.act,
      title: c.a.title,
      path: c.it.path,
      mode: ps.mode,
      len: c.a.sentences.length,
      transfer: !!c.a.transfer,
      type: c.task.type,
      first: !!r.first,
      tries: c.task.type === 'seq' ? r.seqChecks : r.picked.length,
      rereads: r.rereads,
      replays: r.replays,
      transcript: !!r.transcript,
      hints: r.hints
    };
    this.setState((s) => ({ attempts: [...s.attempts, x].slice(-600) }));
  }
  pPick(i) {
    const c = this.curAct();
    const r = this.state.ps.run;
    if (!c || r.solved || r.picked.includes(i)) return;
    const ok = i === c.task.correct;
    const picked = [...r.picked, i];
    const first = r.first === null ? ok : r.first;
    const nr = { ...r, picked, first, solved: ok, hints: ok ? r.hints : r.hints + 1 };
    this.rset(nr);
    if (ok) {
      this.record(c, nr);
      this.tone('ok');
    }
  }
  pSeqPlace(ix, slot) {
    const r = this.state.ps.run;
    const s = r.seqSlots.map((x) => (x === ix ? null : x));
    s[slot] = ix;
    this.rset({ seqSlots: s, seqSel: null, seqResult: null });
  }
  pSeqRemove(ix) {
    const r = this.state.ps.run;
    this.rset({ seqSlots: r.seqSlots.map((x) => (x === ix ? null : x)), seqSel: null, seqResult: null });
  }
  pSeqDropTo(ix, to) {
    if (to === 'pool') this.pSeqRemove(ix);
    else this.pSeqPlace(ix, Number(to));
  }
  pSeqSlot(i) {
    const r = this.state.ps.run;
    if (r.solved) return;
    if (r.seqSel !== null) {
      this.pSeqPlace(r.seqSel, i);
      return;
    }
    const v = r.seqSlots[i];
    if (v !== null && !(r.seqResult && r.seqResult[i])) this.pSeqRemove(v);
  }
  pSeqCheck = () => {
    const c = this.curAct();
    const r = this.state.ps.run;
    if (r.seqSlots.some((x) => x === null)) return;
    const res = r.seqSlots.map((v, i) => v === i);
    const ok = res.every(Boolean);
    const first = r.first === null ? ok : r.first;
    const nr = {
      ...r,
      seqResult: res,
      seqChecks: r.seqChecks + 1,
      solved: ok,
      first,
      hints: ok ? r.hints : r.hints + 1
    };
    this.rset(nr);
    if (ok) {
      this.record(c, nr);
      this.tone('ok');
    }
  };
  pSeqRetry = () => {
    const r = this.state.ps.run;
    this.rset({
      seqSlots: r.seqSlots.map((v, i) => (r.seqResult && r.seqResult[i] ? v : null)),
      seqResult: null,
      seqSel: null
    });
  };
  adapt(it, sid) {
    const st = this.state.settings;
    const rec = this.state.attempts.filter((x) => x.sid === sid && x.act === it.act && x.type !== 'later');
    const good = rec.length > 0 && rec.every((x) => x.first);
    this.setState((s) => {
      const P = s.prog;
      const done = { ...P.done, [it.act]: (P.done[it.act] || 0) + 1 };
      const sk = { g: 0, b: 0, ...(P.streak[it.path] || {}) };
      const levels = { ...P.levels };
      if (good) {
        sk.g++;
        sk.b = 0;
      } else {
        sk.b++;
        sk.g = 0;
      }
      if (st.autoLevel !== false) {
        if (sk.g >= 2 && levels[it.path] < 3) {
          levels[it.path]++;
          sk.g = 0;
        }
        if (sk.b >= 2 && levels[it.path] > 1) {
          levels[it.path]--;
          sk.b = 0;
        }
      }
      return { prog: { ...P, done, levels, streak: { ...P.streak, [it.path]: sk } } };
    });
  }
  pNext = () => {
    Narrator.stop();
    this.setState({ speaking: null, helpHint: false });
    const c = this.curAct();
    const ps = this.state.ps;
    if (!c) return;
    if (ps.taskIdx + 1 < c.tasks.length) {
      this.pset({ taskIdx: ps.taskIdx + 1, run: freshRun(c.tasks[ps.taskIdx + 1]), phase: 'task' });
      this.top();
      return;
    }
    if (c.it.type === 'act') this.adapt(c.it, ps.id);
    const idx = ps.idx + 1;
    if (idx >= ps.plan.length) {
      this.pset({ phase: 'end', idx });
      if (!ps.single) this.setState((s) => ({ prog: { ...s.prog, sessions: s.prog.sessions + 1 } }));
      this.log('p_end');
      this.tone('done');
      this.top();
      return;
    }
    const it = ps.plan[idx];
    const a = ACTS[it.act];
    const mode = this.modeFor(it.path);
    if (it.type === 'later') this.pset({ idx, taskIdx: 0, phase: 'laterIntro', mode, run: freshRun(null) });
    else
      this.pset({
        idx,
        taskIdx: 0,
        phase: 'present',
        mode,
        showText: mode !== 'listen',
        played: false,
        adultShow: false,
        adultRead: false,
        run: freshRun(a.tasks[0])
      });
    this.top();
  };

  practiceVals(b) {
    const S = this.state,
      st = S.settings,
      ps = S.ps,
      w = S.w;
    const wide = w >= 900,
      big = w >= 1240,
      tabT = w >= 600 && w < 900,
      narrow = !wide;
    const chrome = !['mission', 'practice', 'welcome'].includes(S.tab);
    const sb = 'env(safe-area-inset-bottom)',
      stp = 'env(safe-area-inset-top)';
    const sel = (on) => ({
      border: on ? '#91D7E8' : 'rgba(235,213,163,.3)',
      bg: on ? 'rgba(145,215,232,.16)' : 'transparent',
      color: on ? '#91D7E8' : '#F6EAD2',
      pressed: on ? 'true' : 'false'
    });
    const o = {
      showRail: wide && chrome,
      showBottomNav: narrow && chrome,
      mainPadBottom: narrow && chrome ? 'calc(92px + ' + sb + ')' : '0',
      sMission: S.tab === 'mission',
      sPractice: S.tab === 'practice',
      h1Size: wide ? '40px' : tabT ? '34px' : '28px',
      h2Size: wide ? '32px' : tabT ? '28px' : '25px',
      pagePad: wide
        ? '44px 52px 56px'
        : tabT
          ? 'calc(24px + ' + stp + ') 32px 40px'
          : 'calc(18px + ' + stp + ') 16px 28px',
      homePad: big
        ? '36px 48px'
        : wide
          ? '28px 36px'
          : tabT
            ? 'calc(20px + ' + stp + ') 32px 32px'
            : 'calc(12px + ' + stp + ') 16px 24px',
      homeGap: wide ? '18px' : '16px',
      cardImgAspect: wide ? 'auto' : tabT ? '16/6' : '16/7',
      cardImgMinH: wide ? '240px' : '0',
      cardPad: wide ? '22px 26px' : '18px 18px 20px',
      cardTitleSize: wide ? '26px' : tabT ? '24px' : '22px',
      ctaFlex: narrow && !tabT ? '1 1 100%' : '0 0 auto',
      destCols: wide || tabT ? 'repeat(3,minmax(0,1fr))' : '1fr',
      pathCols: wide || tabT ? 'repeat(4,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))',
      gearCols: big ? 'repeat(5,minmax(0,1fr))' : wide || tabT ? 'repeat(3,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))',
      welcomeHeroH: wide ? 'min(76dvh,720px)' : tabT ? 'min(46dvh,520px)' : 'min(38dvh,340px)',
      wordmarkSize: wide ? '88px' : tabT ? '72px' : '56px',
      welcomePad: wide ? '48px 64px' : 'calc(28px + ' + stp + ') 20px calc(36px + ' + sb + ')',
      restMinH: narrow ? 'calc(100dvh - 92px - ' + sb + ')' : '100dvh',
      missionPad: wide ? '32px 32px 60px' : tabT ? '28px 32px 48px' : '20px 16px calc(40px + ' + sb + ')',
      readPad: wide ? '30px 36px' : tabT ? '26px 30px' : '20px 20px',
      stratList: STRAT.map((x, i) => ({ ...x, n: i + 1 }))
    };
    // home: daily plan + paths
    const active = ps && !ps.single && ps.phase !== 'end' ? ps : S.psSaved || null;
    const plan = active ? active.plan : this.buildPlan();
    o.planRows = plan.map((it, i) => {
      const a = ACTS[it.act];
      const done = !!active && i < active.idx;
      const cur = !!active && i === active.idx;
      return {
        icon: done ? 'check_circle' : it.type === 'later' ? 'history' : PATHS[it.path].icon,
        label: it.type === 'later' ? 'Emlékszel még?' : PATHS[it.path].label,
        sub: it.type === 'later' ? 'egy korábbi szövegről' : a.sentences.length + ' mondat',
        color: done ? '#91D7E8' : cur ? '#F3C568' : '#91D7E8',
        weight: cur ? 900 : 700
      };
    });
    o.planBtnLabel = active ? 'Folytatás' : 'Kezdjük';
    o.planMinutes = 'Kb. ' + plan.length * 2 + '–' + plan.length * 3 + ' perc';
    o.startDaily = () => this.startSession();
    o.pathTiles = Object.keys(PATHS).map((p) => ({
      icon: PATHS[p].icon,
      label: PATHS[p].label,
      sub: LEVEL_SHORT[S.prog.levels[p] || 1],
      onClick: () => this.startSession(p)
    }));
    const m = S.mission;
    o.destCards = [
      {
        icon: 'auto_awesome',
        label: 'Kaland: Az eltűnt energiamag',
        sub: m.completed ? 'Teljesítve' : m.started && m.stage > 0 ? 'Folytatható' : 'Kb. 8–10 perc',
        onClick: this.startMission
      },
      { icon: 'backpack', label: 'Hősfelszerelésem', sub: b.gearCount + ' / 5 eszköz', onClick: () => this.go('gear') },
      {
        icon: 'air',
        label: 'Egy perc megérkezés',
        sub: 'Nyugodt légzés',
        onClick: () => this.go('rest', { rest: 'breath' })
      }
    ];
    // parent: practice observations from recorded attempts
    const A = S.attempts;
    const agg = (l) => {
      const n = l.length,
        f = l.filter((x) => x.first).length;
      return n ? n + ' feladat · első válasz helyes: ' + f + ' · segítséggel: ' + (n - f) : '–';
    };
    o.hasPractice = A.length > 0;
    o.pracGroups = [
      {
        title: 'Mód szerint',
        rows: ['read', 'listen', 'both'].map((k) => ({
          label: MODE_LABELS[k],
          value: agg(A.filter((x) => x.mode === k))
        }))
      },
      {
        title: 'Feladattípus szerint',
        rows: Object.keys(TASK_LABELS).map((k) => ({
          label: TASK_LABELS[k],
          value: agg(A.filter((x) => x.type === k))
        }))
      },
      {
        title: 'Szöveghossz és új szövegek',
        rows: [1, 2, 3]
          .map((l) => ({
            label: LEVEL_LABELS[l],
            value: agg(A.filter((x) => (l === 1 ? x.len <= 3 : l === 2 ? x.len === 4 : x.len >= 5)))
          }))
          .concat([
            { label: 'Új, korábban nem látott történetek', value: agg(A.filter((x) => x.transfer)) },
            {
              label: 'Jelenlegi szint',
              value: Object.keys(PATHS)
                .map((p) => PATHS[p].label + ': ' + (LEVEL_SHORT[S.prog.levels[p] || 1] || '').toLowerCase())
                .join(' · ')
            },
            { label: 'Befejezett napi hősküldetések', value: String(S.prog.sessions) }
          ])
      }
    ];
    o.pracLog = A.slice(-25)
      .reverse()
      .map((x) => {
        const sup =
          [
            x.rereads && 'újraolvasás: ' + x.rereads,
            x.replays && 'újrahallgatás: ' + x.replays,
            x.transcript && 'átiratot használt',
            x.hints && 'tipp: ' + x.hints
          ]
            .filter(Boolean)
            .join(' · ') || 'nem kért segítséget';
        return {
          time: fmt(x.t),
          title: x.title,
          meta:
            MODE_LABELS[x.mode] +
            ' · ' +
            x.len +
            ' mondat' +
            (x.transfer ? ' · új történet' : '') +
            ' · ' +
            TASK_LABELS[x.type],
          result: x.first ? 'Első válasz helyes' : 'Segítséggel megoldva',
          resultColor: x.first ? '#91D7E8' : '#EBD5A3',
          supports: sup
        };
      });
    o.noteTagChips = NOTE_TAGS.map((t) => {
      const on = S.noteTags.includes(t);
      return {
        label: t,
        ...sel(on),
        onClick: () => this.setState((s) => ({ noteTags: on ? s.noteTags.filter((x) => x !== t) : [...s.noteTags, t] }))
      };
    });
    o.addNote = () => {
      const t = S.noteDraft.trim();
      if (!t && !S.noteTags.length) return;
      this.setState((s) => ({
        notes: [{ t: Date.now(), text: t, tags: s.noteTags }, ...s.notes],
        noteDraft: '',
        noteTags: []
      }));
    };
    o.notes = S.notes.map((n, i) => ({
      text: (n.tags && n.tags.length ? n.tags.join(', ') + (n.text ? ' — ' : '') : '') + (n.text || ''),
      time: fmt(n.t),
      onDelete: () => this.setState((s) => ({ notes: s.notes.filter((_, j) => j !== i) }))
    }));
    o.practiceSettings = [
      {
        label: 'Egy napi hősküldetés hossza',
        sub: 'Ennyi rövid feladatból áll, plusz egy későbbi felidézős kérdés.',
        opts: [2, 3, 4].map((n) => ({
          label: n + ' feladat',
          ...sel(st.sessionLen === n),
          onClick: () => this.setSettings({ sessionLen: n })
        }))
      },
      {
        label: 'Szöveghossz',
        sub: 'Minden gyakorlástípust erre a szintre állít. Automatikus igazításnál a szint később változhat.',
        opts: [1, 2, 3].map((l) => ({
          label: LEVEL_LABELS[l],
          ...sel(Object.values(S.prog.levels).every((v) => v === l)),
          onClick: () =>
            this.setState((s) => ({ prog: { ...s.prog, levels: { read: l, listen: l, seq: l, main: l }, streak: {} } }))
        }))
      }
    ];
    const auto = st.autoLevel !== false;
    o.toggles = [
      ...b.toggles,
      {
        label: 'Szöveghossz automatikus igazítása',
        sub: 'Két egymás utáni önálló siker után hosszabb, két segítséggel megoldott feladat után rövidebb szöveg jön.',
        on: auto ? 'true' : 'false',
        onClick: () => this.setSettings({ autoLevel: !auto }),
        track: auto ? '#91D7E8' : 'rgba(235,213,163,.25)',
        knob: auto ? '30px' : '4px'
      }
    ];
    o.doClear = () => {
      Narrator.stop();
      this.setState({
        mission: freshMission(),
        events: [],
        tools: [],
        notes: [],
        hw: blankHw(),
        hwSaved: [],
        confirmClear: false,
        hwPreview: null,
        attempts: [],
        prog: defaultProg(),
        ps: null,
        psSaved: null
      });
    };
    const sh = S.sheet;
    o.shStrategy = !!sh && sh.kind === 'strategy';
    if (o.shStrategy) o.sheetTitle = 'A hősök módszere';
    // practice runner
    const c = this.curAct();
    const ph = ps ? ps.phase : '';
    const r = ps ? ps.run : freshRun(null);
    const mode = ps ? ps.mode : 'read';
    const listen = mode === 'listen';
    const it = c && c.it,
      a = c && c.a,
      task = c && c.task;
    const rl = this.reminder();
    Object.assign(o, {
      phIntro: ph === 'intro',
      phPresent: ph === 'present' && !!c,
      phPause: ph === 'pause' && !!c,
      phLaterIntro: ph === 'laterIntro' && !!c,
      phTask: ph === 'task' && !!c,
      phBreak: ph === 'break',
      phEnd: ph === 'end',
      pExit: () => this.go('home'),
      pHelpLabel: w >= 420 ? 'Segítséget kérek' : 'Segítség',
      pIntroDone: () => this.pset({ phase: 'present' }),
      pLaterGo: () => {
        this.pset({ phase: 'task' });
        this.top();
      },
      pResume: () => this.pset((p) => ({ phase: p.prevPhase || 'present' })),
      pToRest: () => this.go('rest')
    });
    if (!ps) return o;
    const total = ps.plan.length;
    o.pHead =
      ph === 'end'
        ? 'Kész'
        : ph === 'intro'
          ? 'Kezdés'
          : Math.min(ps.idx + 1, total) +
            '/' +
            total +
            ' · ' +
            (it ? (it.type === 'later' ? 'Emlékszel még?' : PATHS[it.path].label) : '');
    o.pDots = ps.plan.map((_, i) => ({
      w: i === ps.idx && ph !== 'end' ? '22px' : '8px',
      bg: i < ps.idx || ph === 'end' ? '#F3C568' : i === ps.idx ? '#91D7E8' : 'rgba(235,213,163,.25)'
    }));
    const stepIdx = ph === 'pause' ? 1 : ph === 'task' ? (r.solved ? 3 : 2) : ph === 'present' ? 0 : -1;
    o.pShowStrip = rl !== 'minimal' && ['present', 'pause', 'task'].includes(ph);
    o.pStrip = STRAT.map((x, i) => ({
      icon: x.icon,
      label: x.label,
      showIcon: w >= 480,
      font: w >= 480 ? '14px' : '13px',
      current: i === stepIdx ? 'step' : 'false',
      bg: i === stepIdx ? '#F3C568' : i < stepIdx ? 'rgba(243,197,104,.18)' : 'rgba(235,213,163,.08)',
      color: i === stepIdx ? '#18343A' : i < stepIdx ? '#F3C568' : '#CFC3A8'
    }));
    o.pEndTitle = ps.single ? 'Gyakorlás kész!' : 'Mai hősküldetés kész!';
    o.pEndRows = ps.plan.map((x) => ({
      icon: x.type === 'later' ? 'history' : PATHS[x.path].icon,
      label: x.type === 'later' ? 'Emlékszel még?' : ACTS[x.act].title,
      sub:
        x.type === 'later'
          ? 'Későbbi felidézés: „' + ACTS[x.act].title + '”'
          : PATHS[x.path].label + ' · ' + ACTS[x.act].sentences.length + ' mondat'
    }));
    if (!c) return o;
    const isSeq = task.type === 'seq';
    const wrongs = isSeq ? r.seqChecks - (r.solved ? 1 : 0) : r.picked.filter((i) => i !== task.correct).length;
    const ev = task.ev != null ? task.ev : -1;
    const hl = ph === 'task' && (r.solved || wrongs >= 2);
    o.pSents = a.sentences.map((t, i) => ({
      text: t + ' ',
      bg: hl && i === ev ? 'rgba(243,197,104,.6)' : 'transparent'
    }));
    o.pEyebrow = PATHS[it.path].label + ' · ' + a.sentences.length + ' mondat';
    o.pTransfer = !!a.transfer;
    o.pInstr =
      a.kind === 'instruction'
        ? listen
          ? 'Hallgasd meg figyelmesen az utasítást.'
          : 'Olvasd el figyelmesen az utasítást.'
        : listen
          ? 'Hallgasd meg figyelmesen a szöveget.'
          : mode === 'both'
            ? 'Olvasd és hallgasd, a saját tempódban.'
            : 'Olvasd el a saját tempódban.';
    const spId = 'p' + it.act,
      speaking = S.speaking === spId;
    o.pListenCard = (listen || mode === 'both') && S.narr === true;
    o.pSpeak = this.pSpeak;
    o.pPlayIcon = speaking ? 'stop_circle' : ps.played ? 'replay' : 'play_arrow';
    o.pPlayLabel = speaking ? 'Leállítás' : ps.played ? 'Újra meghallgatom' : 'Meghallgatom';
    o.pPresentTranscriptBtn = listen && !ps.showText;
    o.pTranscript = this.pTranscript;
    o.pAdultCard = listen && S.narr !== true;
    o.pAdultText =
      S.narr === null
        ? 'Felolvasóhang keresése ezen az eszközön…'
        : 'Ezen az eszközön nincs magyar felolvasóhang. Kérj meg egy felnőttet, hogy olvassa fel a szöveget, majd rejtse el.';
    o.pAdultBtn = ps.adultShow ? 'Felolvastam, elrejtem' : 'Felnőttnek: szöveg megjelenítése';
    o.pAdultToggle = () =>
      this.pset((p) => (p.adultShow ? { adultShow: false, adultRead: true } : { adultShow: true }));
    o.pPresentText = ps.showText || ps.adultShow;
    o.pPresentLabel = ps.adultShow ? 'Felnőtt olvassa fel hangosan' : listen && r.transcript ? 'Átirat' : '';
    o.pCanListenAlong = mode === 'read' && S.narr === true;
    o.pListenAlong = () => {
      this.pset({ mode: 'both' });
      setTimeout(() => this.pSpeak(), 0);
    };
    o.pDoneLabel = listen ? 'Meghallgattam' : 'Elolvastam';
    const doneOk = !listen || ps.played || r.transcript || ps.adultRead;
    o.pDoneDisabled = !doneOk;
    o.pDoneOpacity = doneOk ? 1 : 0.45;
    o.pPresentDone = () => {
      if (!doneOk) return;
      Narrator.stop();
      this.setState({ speaking: null });
      this.pset({ phase: rl === 'minimal' ? 'task' : 'pause', adultShow: false, showText: false });
      this.top();
    };
    o.pPauseText = isSeq
      ? 'Állj meg egy pillanatra. Gondold át: mi történt először, és mi a végén?'
      : task.type === 'main'
        ? 'Állj meg egy pillanatra. Gondold át: miről szól az egész szöveg?'
        : rl === 'full'
          ? 'Állj meg egy pillanatra. Gondold át: ki szerepelt, és mi volt a legfontosabb?'
          : 'Gondold át, mi volt a legfontosabb.';
    o.pPauseSay = rl === 'full';
    o.pPauseDone = () => {
      this.pset({ phase: 'task' });
      this.top();
    };
    o.pLaterTitle = a.title;
    o.pTaskEyebrow = TASK_CHILD[task.type];
    o.pPrompt = task.prompt;
    o.pTaskNote =
      (task.type === 'recall' || task.type === 'later') && !r.solved
        ? listen
          ? 'Most nincs felolvasás és szöveg. Gondold át, mit hallottál!'
          : 'A szöveg most el van rejtve. Gondold át, mire emlékszel!'
        : '';
    o.pIsChoice = !isSeq;
    o.pIsSeq = isSeq;
    o.pOptions = isSeq
      ? []
      : task.options.map((t, i) => {
          const pk = r.picked.includes(i);
          const okp = pk && i === task.correct;
          const no = pk && !okp;
          return {
            text: t,
            onClick: () => this.pPick(i),
            pressed: pk ? 'true' : 'false',
            showTag: pk,
            tag: okp ? 'Helyes' : 'Nem ez',
            icon: okp ? ICON_OK : ICON_NO,
            tagColor: okp ? '#91D7E8' : '#EBD5A3',
            border: okp ? '#91D7E8' : 'rgba(235,213,163,.3)',
            bg: okp ? 'rgba(145,215,232,.14)' : '#1C454D',
            opacity: no || (r.solved && !pk) ? 0.6 : 1
          };
        });
    const supportType = task.type === 'understand' || isSeq || task.type === 'main';
    const canSupport = !r.solved && (supportType || wrongs >= 1);
    o.pHintShow = !r.solved && wrongs >= 1 && !(isSeq && !r.seqResult);
    o.pHintText =
      wrongs >= 2 && ev >= 0
        ? 'Nézzük meg együtt a szövegben! A kiemelt mondat segít.'
        : task.hint || 'Gondold át újra!';
    o.pSupportRow = canSupport;
    o.pSupport = this.pSupport;
    o.pSupportIcon = listen ? 'replay' : 'menu_book';
    o.pSupportLabel = listen ? (S.narr === true ? 'Újra meghallgatom' : 'Felnőtt olvassa fel újra') : 'Újra elolvasom';
    o.pTranscriptTaskBtn = listen && S.narr === true && !r.transcript;
    o.pPassageShow = (r.supportOpen && (!listen || r.transcript || S.narr !== true)) || (r.solved && ev >= 0);
    o.pPassageLabel = r.solved ? 'Ellenőrzöm: itt van a szövegben' : 'A szöveg';
    o.pSolved = r.solved;
    o.pOkText = isSeq
      ? 'Pontos sorrend! Végigkövetted, mi történt.'
      : task.type === 'later'
        ? 'Emlékeztél! Ezt egy korábbi szövegből idézted fel.'
        : task.type === 'main'
          ? 'Ez a lényeg: röviden elmondja az egész szöveget.'
          : r.first
            ? 'Megtaláltad a mondatot, amely segít megérteni a szöveget.'
            : 'Megvan! A segítséggel megtaláltad a választ.';
    o.pSayShow = r.solved && task.type === 'main';
    o.pSaid = r.said;
    o.pNotSaid = !r.said;
    o.pMarkSaid = () => {
      this.rset({ said: true });
      this.log('p_said');
    };
    o.pNext = this.pNext;
    o.pNextLabel = ps.idx === total - 1 && ps.taskIdx === c.tasks.length - 1 ? 'Befejezem' : 'Tovább';
    if (isSeq) {
      const L = a.kind === 'instruction' ? ['1. lépés', '2. lépés', '3. lépés'] : ['Először', 'Azután', 'Végül'];
      const order = r.seqOrder || [0, 1, 2];
      const sel2 = r.seqSel !== null;
      o.pSeqSlots = r.seqSlots.map((v, i) => {
        const res = r.seqResult ? r.seqResult[i] : null;
        const filled = v !== null;
        return {
          label: L[i],
          text: filled ? task.events[v] : sel2 ? 'Koppints ide a kiválasztott kártyáért' : 'Ide tedd a kártyát',
          align: filled ? 'left' : 'center',
          aria: filled ? L[i] + ': ' + task.events[v] + '. Koppints a visszavételhez.' : L[i] + ': üres hely',
          onClick: () => this.pSeqSlot(i),
          onDragOver: (e) => e.preventDefault(),
          onDrop: (e) => {
            e.preventDefault();
            const d = this.pDrag;
            this.pDrag = null;
            if (d != null) this.pSeqPlace(d, i);
          },
          draggable: filled && !r.solved ? 'true' : 'false',
          onDragStart: (e) => {
            this.pDrag = v;
            try {
              e.dataTransfer.setData('text/plain', String(v));
            } catch (_) {}
          },
          onTouchStart: filled && !r.solved ? touchDrag((to) => this.pSeqDropTo(v, to)) : undefined,
          borderStyle: filled ? 'solid' : 'dashed',
          border:
            res === true
              ? '#91D7E8'
              : res === false
                ? '#EBD5A3'
                : filled
                  ? 'transparent'
                  : sel2
                    ? '#F3C568'
                    : 'rgba(235,213,163,.4)',
          bg: filled ? '#FFF4DF' : sel2 ? 'rgba(243,197,104,.08)' : 'rgba(11,35,41,.4)',
          color: filled ? '#18343A' : '#CFC3A8',
          showStatus: res !== null,
          status: res ? 'Jó helyen' : 'Próbáld máshova',
          statusIcon: res ? ICON_OK : 'swap_vert',
          statusColor: res ? '#91D7E8' : '#EBD5A3'
        };
      });
      const pool = order.filter((x) => !r.seqSlots.includes(x));
      o.pSeqPool = pool.map((x) => {
        const on = r.seqSel === x;
        return {
          text: task.events[x],
          pressed: on,
          pressedStr: on ? 'true' : 'false',
          border: on ? '#F3C568' : 'transparent',
          onClick: () => {
            if (!r.solved) this.rset({ seqSel: on ? null : x });
          },
          onDragStart: (e) => {
            this.pDrag = x;
            try {
              e.dataTransfer.setData('text/plain', String(x));
            } catch (_) {}
          },
          onTouchStart: r.solved ? undefined : touchDrag((to) => this.pSeqDropTo(x, to))
        };
      });
      o.pSeqPoolHas = pool.length > 0;
      o.pPoolDragOver = (e) => e.preventDefault();
      o.pPoolDrop = (e) => {
        e.preventDefault();
        const d = this.pDrag;
        this.pDrag = null;
        if (d != null) this.pSeqRemove(d);
      };
      const full = r.seqSlots.every((x) => x !== null);
      o.pSeqCanCheck = !r.seqResult && !r.solved;
      o.pSeqCanRetry = !!r.seqResult && !r.solved;
      o.pSeqCheck = this.pSeqCheck;
      o.pSeqRetry = this.pSeqRetry;
      o.pSeqCheckDisabled = !full;
      o.pSeqCheckOpacity = full ? 1 : 0.45;
    }
    if (S.tab === 'practice') {
      o.helpHintShown = S.helpHint;
      o.helpHintText =
        ph === 'task'
          ? task.hint || 'Gondold át újra!'
          : 'Haladj a saját tempódban. Ha készen állsz, koppints a sárga gombra.';
      o.helpActions = [
        !S.helpHint && {
          icon: 'lightbulb',
          label: 'Kérek egy tippet',
          sub: 'Egy kis nyom a mostani lépéshez',
          onClick: () => {
            this.setState({ helpHint: true });
            if (ph === 'task') this.rset((rr) => ({ hints: rr.hints + 1 }));
            this.log('hint', { practice: true });
          }
        },
        ph === 'task' &&
          canSupport && {
            icon: listen ? 'replay' : 'menu_book',
            label: o.pSupportLabel,
            sub: 'A választ ezután is te adod meg',
            onClick: () => {
              this.setState({ sheet: null });
              this.pSupport();
            }
          },
        {
          icon: 'checklist',
          label: 'A hősök módszere',
          sub: 'Megállok → Átgondolom → Elmondom → Ellenőrzöm',
          onClick: () => this.setState({ sheet: { kind: 'strategy' } })
        },
        {
          icon: 'nights_stay',
          label: 'Szünetet kérek',
          sub: 'A feladat megvár',
          onClick: () => {
            this.setState({ sheet: null });
            this.pset((p) => ({ prevPhase: p.phase === 'break' ? p.prevPhase : p.phase, phase: 'break' }));
            this.log('break');
          }
        }
      ].filter(Boolean);
    }
    return o;
  }

  submitPin() {
    const p = this.state.pinInput;
    if (p.length !== 4) {
      this.setState({ pinErr: 'A PIN 4 számjegyből áll.' });
      return;
    }
    if (!this.state.pinCode) {
      this.setState({ pinCode: p, parentIn: true, pinInput: '', pinErr: '' });
      return;
    }
    if (p === this.state.pinCode) this.setState({ parentIn: true, pinInput: '', pinErr: '' });
    else this.setState({ pinErr: 'Ez a PIN nem egyezik. Próbáld újra.', pinInput: '' });
  }

  hwSplit() {
    const t = this.state.hw.text.trim();
    if (!t) {
      this.setState({ hwMsg: 'Előbb illessz be egy szöveget.' });
      return;
    }
    let parts = t
      .split(/\n\s*\n/)
      .map((x) => x.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    if (parts.length === 1) {
      const sents = parts[0].match(/[^.!?…]+[.!?…]+["”»]?|[^.!?…]+$/g) || [parts[0]];
      const n = Math.min(3, Math.max(1, Math.ceil(sents.length / 2)));
      const size = Math.ceil(sents.length / n);
      parts = [];
      for (let i = 0; i < sents.length; i += size)
        parts.push(
          sents
            .slice(i, i + size)
            .map((x) => x.trim())
            .join(' ')
        );
    }
    this.setHw({ sections: parts });
    this.setState({ hwMsg: '' });
  }

  render() {
    return <AppView v={this.renderVals()} />;
  }
}

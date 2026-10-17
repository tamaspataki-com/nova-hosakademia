import { useCallback, useEffect, useMemo, useState } from 'react';
import { StoreProvider, useStore } from './app/store.jsx';
import { initAudio } from './app/audio.js';
import UpdateBar from './app/UpdateBar.jsx';
import { fromHash, toHash } from './app/routes.js';
import { Icon, Sheet, Btn } from './app/ui.jsx';
import { allAdventures, customAdventures, findAdventure } from './content/index.js';
import Welcome from './screens/Welcome.jsx';
import Today from './screens/Today.jsx';
import Explore, { WorldView } from './screens/Explore.jsx';
import MyWorld, { ToolDemo } from './screens/MyWorld.jsx';
import Rest from './screens/Rest.jsx';
import Parent from './screens/Parent.jsx';
import Adventure from './screens/Adventure.jsx';
import Complete from './screens/Complete.jsx';

const NAV = [
  ['today', 'Mai kaland', 'home'],
  ['explore', 'Felfedezés', 'explore'],
  ['myworld', 'Saját világom', 'backpack'],
  ['rest', 'Pihenő', 'nights_stay']
];
// Which main destination a route belongs to (for the highlighted nav item).
const TAB_OF = {
  today: 'today',
  explore: 'explore',
  world: 'explore',
  myworld: 'myworld',
  tool: 'myworld',
  rest: 'rest',
  parent: 'today'
};
const NO_NAV = new Set(['welcome', 'adventure', 'complete']);

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

function Shell() {
  const { state } = useStore();
  // A link such as #/dino opens that screen directly (no welcome screen); otherwise the app starts at the welcome.
  const [route, setRoute] = useState(() => fromHash(window.location.hash) || { name: 'welcome' });
  const [profile, setProfile] = useState(false);
  const settings = state.settings;

  // history entries carry their depth (i), so "back" only leaves the app's own screens.
  const url = (r) => window.location.pathname + window.location.search + toHash(r);

  useEffect(() => {
    initAudio();
    history.replaceState({ route, i: 0 }, '', url(route));
    const onPop = (e) => setRoute(e.state?.route || fromHash(window.location.hash) || { name: 'today' });
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigation keeps the browser history in step, so the phone's back gesture works inside the app.
  const go = useCallback((r) => {
    if (r.name === 'back') {
      if ((history.state?.i || 0) > 0) history.back();
      else {
        const t = { name: 'today' };
        history.replaceState({ route: t, i: 0 }, '', url(t));
        setRoute(t);
      }
      return;
    }
    setProfile(false);
    const { replace, ...clean } = r;
    const i = history.state?.i || 0;
    if (replace) history.replaceState({ route: clean, i }, '', url(clean));
    else history.pushState({ route: clean, i: i + 1 }, '', url(clean));
    setRoute(clean);
    window.scrollTo(0, 0);
  }, []);

  // Reading size and reduced motion follow the settings (and the system preference).
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--read', `${settings.textSize}px`);
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const apply = () => root.toggleAttribute('data-rm', settings.reducedMotion || !!mq?.matches);
    apply();
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, [settings.textSize, settings.reducedMotion]);

  const custom = useMemo(() => customAdventures(state.hwSaved), [state.hwSaved]);
  const adventures = useMemo(() => allAdventures(custom), [custom]);

  const tab = TAB_OF[route.name];
  const showNav = !NO_NAV.has(route.name);
  // While an adventure is active – its screens and help panels, a break taken from it, and its completion screen –
  // no update is offered and nothing can reload. The bar appears once the child is back in the main app.
  const inAdventure =
    route.name === 'adventure' || route.name === 'complete' || (route.name === 'rest' && !!route.from);

  let screen = null;
  switch (route.name) {
    case 'welcome':
      screen = <Welcome go={go} />;
      break;
    case 'today':
      screen = <Today go={go} adventures={adventures} />;
      break;
    case 'explore':
      screen = <Explore go={go} custom={custom} />;
      break;
    case 'world':
      screen = <WorldView key={route.id} id={route.id} go={go} />;
      break;
    case 'myworld':
      screen = <MyWorld key={route.tab} go={go} tab={route.tab} adventures={adventures} />;
      break;
    case 'tool':
      screen = <ToolDemo key={route.id} id={route.id} go={go} />;
      break;
    case 'rest':
      screen = <Rest key={route.from || 'r'} go={go} from={route.from} breath={route.breath} />;
      break;
    case 'parent':
      screen = <Parent go={go} adventures={adventures} tab={route.tab} />;
      break;
    case 'adventure': {
      const adv = findAdventure(route.id, custom);
      screen = adv ? <Adventure key={adv.id} adv={adv} go={go} /> : <Missing go={go} />;
      break;
    }
    case 'complete': {
      const adv = findAdventure(route.id, custom);
      screen = adv ? <Complete adv={adv} go={go} /> : <Missing go={go} />;
      break;
    }
    default:
      screen = <Missing go={go} />;
  }

  const name = (settings.name || '').trim() || 'Hős';
  const initial = name[0].toUpperCase();

  return (
    <>
      {!inAdventure ? <UpdateBar /> : null}
      <div className={`app ${showNav ? 'has-nav' : ''}`}>
        {showNav ? (
          <nav className="rail" aria-label="Fő navigáció">
            <button
              type="button"
              className="rail-logo logo-btn"
              aria-label="NOVA – főoldal"
              onClick={() => go({ name: 'today' })}
            >
              <img src="assets/nova-star.webp" alt="" />
              <span>NOVA</span>
            </button>
            {NAV.map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                className={`rail-item ${tab === id ? 'on' : ''}`}
                aria-current={tab === id ? 'page' : undefined}
                onClick={() => go({ name: id })}
              >
                <Icon name={icon} size={27} />
                <span>{label}</span>
              </button>
            ))}
            <div className="grow" />
            <button
              type="button"
              className="profile-btn"
              aria-label="Profil és beállítások"
              onClick={() => setProfile(true)}
            >
              {initial}
            </button>
          </nav>
        ) : null}

        <main className="main">
          {showNav ? (
            <div className="topbar">
              <button
                type="button"
                className="topbar-logo logo-btn"
                aria-label="NOVA – főoldal"
                onClick={() => go({ name: 'today' })}
              >
                <img src="assets/nova-star.webp" alt="" />
                NOVA
              </button>
              <button
                type="button"
                className="profile-btn small"
                aria-label="Profil és beállítások"
                onClick={() => setProfile(true)}
              >
                {initial}
              </button>
            </div>
          ) : null}
          {screen}
        </main>

        {showNav ? (
          <nav className="bottomnav" aria-label="Fő navigáció">
            {NAV.map(([id, label, icon]) => (
              <button
                key={id}
                type="button"
                className={`bn-item ${tab === id ? 'on' : ''}`}
                aria-current={tab === id ? 'page' : undefined}
                onClick={() => go({ name: id })}
              >
                <Icon name={icon} size={26} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        ) : null}

        {profile ? (
          <Sheet title="Profil" onClose={() => setProfile(false)}>
            <div className="stack">
              <div className="row">
                <span className="profile-btn static" aria-hidden="true">
                  {initial}
                </span>
                <strong className="h3">{name}</strong>
              </div>
              <Btn kind="ghost" icon="lock" onClick={() => go({ name: 'parent' })}>
                Szülői tér
              </Btn>
            </div>
          </Sheet>
        ) : null}
      </div>
    </>
  );
}

function Missing({ go }) {
  return (
    <div className="page narrow stack">
      <h1 className="h1">Ez a kaland nem található.</h1>
      <Btn onClick={() => go({ name: 'today' })}>Vissza a Mai kalandhoz</Btn>
    </div>
  );
}

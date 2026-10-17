import { useStore } from '../app/store.jsx';
import { Btn, Icon, Chip } from '../app/ui.jsx';
import { classLabel } from '../content/index.js';
import { journeyCurrent } from '../content/journey.js';

// Mai kaland: continue the unfinished adventure; else offer the next unfinished adventure of the journey (the only
// new one that can be opened). When the whole journey is done nothing "next" is suggested: replay and the optional
// practice texts are offered instead.
export function suggest(state, adventures) {
  const active = adventures
    .filter((a) => state.progress[a.id])
    .sort((a, b) => state.progress[b.id].startedAt - state.progress[a.id].startedAt)[0];
  if (active) return { adv: active, kind: 'continue' };
  const id = journeyCurrent(state);
  const next = id ? adventures.find((a) => a.id === id) : null;
  if (next) return { adv: next, kind: 'new' };
  return { adv: null, kind: 'journeyDone' };
}

export default function Today({ go, adventures }) {
  const { state } = useStore();
  const name = (state.settings.name || '').trim() || 'Hős';
  const { adv, kind } = suggest(state, adventures);
  const run = adv ? state.progress[adv.id] : null;
  const firstVisit = !state.events.length && !Object.keys(state.history).length && !run;
  const lastDone = run && run.mode && run.stepIndex > 0 ? adv.steps[run.stepIndex - 1]?.title : null;

  const heading = kind === 'continue' && !firstVisit ? 'Folytassuk a kalandot!' : `Szia, ${name}!`;
  const sub = 'Válassz egy kalandot, és fedezz fel valami érdekeset!';
  const eyebrow = kind === 'continue' ? 'Folyamatban' : 'Ajánlott kaland';
  const label = kind === 'continue' ? 'Folytatás' : 'Kaland indítása';

  return (
    <div className="today">
      <img className="today-bg" src="assets/command-room.webp" alt="" />
      <div className="today-scrim" />
      <div className="page stack today-body">
        <div className="greet">
          <img className="avatar" src="assets/hero.webp" alt="" />
          <div>
            <h1 className="h1">{heading}</h1>
            <p className="lead">{sub}</p>
          </div>
        </div>

        {kind === 'journeyDone' ? (
          <article className="card feature">
            <div className="feature-art">
              <img src="assets/map.webp" alt="" />
            </div>
            <div className="stack">
              <span className="eyebrow gold">Minden jelenlegi kaland kész</span>
              <h2 className="h2">Végigjártad az összes jelenlegi kalandot!</h2>
              <p className="lead">
                Bármelyik kalandot újra kipróbálhatod, vagy gyakorolhatsz a rövid szövegekkel. A gyakorlás nem kötelező.
              </p>
              <div className="row">
                <Btn iconAfter="arrow_forward" onClick={() => go({ name: 'explore' })}>
                  Kalandok újrajátszása
                </Btn>
                <Btn kind="ghost" onClick={() => go({ name: 'world', id: 'heroes' })}>
                  Gyakorlás
                </Btn>
              </div>
            </div>
          </article>
        ) : (
          <article className="card feature">
            <div className="feature-art">
              <img src={adv.coverAsset || 'assets/map.webp'} alt="" />
            </div>
            <div className="stack">
              <span className="eyebrow gold">{eyebrow}</span>
              <h2 className="h2">{adv.title}</h2>
              <p className="lead">{adv.description}</p>
              {lastDone ? (
                <p className="muted">
                  <Icon name="check_circle" /> Utoljára befejezett lépés: {lastDone}
                </p>
              ) : null}
              {classLabel(adv) ? <Chip>{classLabel(adv)}</Chip> : null}
              <div className="row">
                <Btn iconAfter="arrow_forward" onClick={() => go({ name: 'adventure', id: adv.id })}>
                  {label}
                </Btn>
              </div>
            </div>
          </article>
        )}

        <div className="tiles">
          <button type="button" className="tile" onClick={() => go({ name: 'explore' })}>
            <Icon name="explore" size={30} /> <span>Világok felfedezése</span>
          </button>
          <button type="button" className="tile" onClick={() => go({ name: 'myworld', tab: 'tools' })}>
            <Icon name="backpack" size={30} /> <span>Eszközeim</span>
          </button>
          <button type="button" className="tile" onClick={() => go({ name: 'rest', breath: true })}>
            <Icon name="air" size={30} /> <span>Egy kis megérkezés</span>
          </button>
        </div>
      </div>
    </div>
  );
}

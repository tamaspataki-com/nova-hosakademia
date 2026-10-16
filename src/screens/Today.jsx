import { useStore, statusOf } from '../app/store.jsx';
import { Btn, Icon, Chip } from '../app/ui.jsx';
import { classLabel } from '../content/index.js';

// Mai kaland: continue the unfinished adventure, else suggest the next one the child has not completed.
// Nothing unavailable is ever suggested, and finished content is offered as practice, not as new.
export function suggest(state, adventures) {
  const active = adventures
    .filter((a) => state.progress[a.id])
    .sort((a, b) => state.progress[b.id].startedAt - state.progress[a.id].startedAt)[0];
  if (active) return { adv: active, kind: 'continue' };
  const level = state.settings.level;
  const fresh = adventures.find((a) => !a.custom && statusOf(state, a.id) === 'new' && a.level <= level);
  if (fresh) return { adv: fresh, kind: 'new' };
  const any = adventures.find((a) => !a.custom && statusOf(state, a.id) === 'new');
  if (any) return { adv: any, kind: 'new' };
  return { adv: adventures[0], kind: 'practice' };
}

export default function Today({ go, adventures }) {
  const { state } = useStore();
  const name = (state.settings.name || '').trim() || 'Hős';
  const { adv, kind } = suggest(state, adventures);
  const run = state.progress[adv.id];
  const firstVisit = !state.events.length && !Object.keys(state.history).length && !run;
  const lastDone = run && run.mode && run.stepIndex > 0 ? adv.steps[run.stepIndex - 1]?.title : null;

  const heading = kind === 'continue' && !firstVisit ? 'Folytassuk a kalandot!' : `Szia, ${name}!`;
  const sub = 'Válassz egy kalandot, és fedezz fel valami érdekeset!';
  const eyebrow = kind === 'continue' ? 'Folyamatban' : kind === 'practice' ? 'Gyakorlás' : 'Ajánlott kaland';
  const label = kind === 'continue' ? 'Folytatás' : kind === 'practice' ? 'Gyakorlás indítása' : 'Kaland indítása';

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
            {kind === 'practice' ? (
              <p className="muted">Ezt a kalandot újra is kipróbálhatod. Új történetek hamarosan érkeznek.</p>
            ) : null}
          </div>
        </article>

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

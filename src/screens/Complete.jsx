import { useStore } from '../app/store.jsx';
import { Btn, Icon, Glyph, useHeadingFocus } from '../app/ui.jsx';
import { BADGES } from '../content/index.js';

// Shown after the last step. Opening it again changes nothing: completion was recorded once, by the run ending.
// The badge is decorative and awarded once; it never gates the strategy tools.
const DEFAULT_ACTIONS = [
  { to: 'today', label: 'Vissza a Mai kalandhoz' },
  { to: 'tools', label: 'Eszközeim megnézése' }
];

export default function Complete({ adv, go }) {
  const { state, act } = useStore();
  const headRef = useHeadingFocus();
  const badge = BADGES[adv.badge];
  const c = adv.completion || { title: 'Kész!', text: 'Befejezted ezt a kalandot.' };
  const repeat = (state.history[adv.id]?.completions || 0) > 1;
  const fav = state.favourites.includes(adv.id);
  const actions = c.actions || DEFAULT_ACTIONS;
  const route = {
    today: { name: 'today' },
    tools: { name: 'myworld', tab: 'tools' },
    discoveries: { name: 'myworld', tab: 'discoveries' },
    world: adv.worldId ? { name: 'world', id: adv.worldId } : { name: 'explore' }
  };

  return (
    <div className="page narrow stack center-text">
      <Icon name="verified" size={56} className="gold" />
      <h1 className="h1" tabIndex={-1} ref={headRef}>
        {c.title}
      </h1>
      <p className="lead">{c.text}</p>
      {repeat ? <p className="muted">Ez gyakorlás volt – a jelvényt egyszer kapod meg.</p> : null}

      {adv.discoveries?.map((d) => (
        <section key={d.id} className="card stack center-text" aria-label="Felfedezés">
          <span className="eyebrow">{d.label}</span>
          <strong className="h3">{d.title}</strong>
          <span>{d.text}</span>
        </section>
      ))}

      {badge && state.badges.includes(badge.id) ? (
        <section className="card stack center-text" aria-label="Jelvény">
          <span className="eyebrow">Jelvény</span>
          {badge.art ? (
            <img className="tool-img" src={badge.art} alt="" />
          ) : (
            <span className="gold">
              <Glyph name={badge.icon} size={72} />
            </span>
          )}
          <strong className="h3">{badge.name}</strong>
          <span className="muted">A jelvény csak dísz. Az eszközeidet bármikor használhatod.</span>
        </section>
      ) : null}

      <div className="row center">
        {actions.map((a, i) => (
          <Btn key={a.to} kind={i === 0 ? 'primary' : 'ghost'} onClick={() => go(route[a.to])}>
            {a.label}
          </Btn>
        ))}
        <Btn kind="ghost" icon={fav ? 'favorite' : 'favorite_border'} onClick={() => act.fav(adv.id)}>
          {fav ? 'Kedvencekből kiveszem' : 'Kedvencekhez adom'}
        </Btn>
      </div>
    </div>
  );
}

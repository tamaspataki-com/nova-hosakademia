import { useStore } from '../app/store.jsx';
import { Btn, Icon } from '../app/ui.jsx';
import { TOOLS } from '../content/index.js';

// Shown after the last step. Opening it again changes nothing: completion was recorded once, by the run ending.
export default function Complete({ adv, go }) {
  const { state, act } = useStore();
  const badge = TOOLS.find((t) => t.id === adv.badge);
  const c = adv.completion || { title: 'Kész!', text: 'Befejezted ezt a kalandot.' };
  const repeat = (state.history[adv.id]?.completions || 0) > 1;
  return (
    <div className="page narrow stack center-text">
      <Icon name="verified" size={56} className="gold" />
      <h1 className="h1">{c.title}</h1>
      <p className="lead">{c.text}</p>
      {repeat ? <p className="muted">Ez gyakorlás volt – a jelvényt egyszer kapod meg.</p> : null}

      {badge && state.badges.includes(badge.id) ? (
        <section className="card stack center-text" aria-label="Jelvény">
          <span className="eyebrow">Jelvény</span>
          <img className="tool-img" src={badge.src} alt="" />
          <strong className="h3">{badge.name}</strong>
          <span className="muted">Ezt a stratégiát bármikor kipróbálhatod az Eszközeim között.</span>
        </section>
      ) : null}

      <div className="row center">
        <Btn onClick={() => go({ name: 'today' })}>Vissza a Mai kalandhoz</Btn>
        {badge ? (
          <Btn kind="ghost" onClick={() => go({ name: 'myworld', tab: 'tools' })}>
            Eszközeim megnézése
          </Btn>
        ) : null}
        <Btn
          kind="ghost"
          icon={state.favourites.includes(adv.id) ? 'favorite' : 'favorite_border'}
          onClick={() => act.fav(adv.id)}
        >
          {state.favourites.includes(adv.id) ? 'Kedvencekből kiveszem' : 'Kedvencekhez adom'}
        </Btn>
      </div>
    </div>
  );
}

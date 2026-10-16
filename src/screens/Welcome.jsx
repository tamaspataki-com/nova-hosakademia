import { useStore } from '../app/store.jsx';
import { Btn } from '../app/ui.jsx';

export default function Welcome({ go }) {
  const { state } = useStore();
  const name = (state.settings.name || '').trim() || 'Hős';
  return (
    <div className="welcome">
      <img className="welcome-bg" src="assets/command-room.webp" alt="" />
      <div className="welcome-scrim" />
      <div className="welcome-body">
        <div className="welcome-text">
          <img className="welcome-star" src="assets/nova-star.webp" alt="" />
          <h1 className="wordmark">NOVA</h1>
          <p className="welcome-lead">A megértés kalandot nyit.</p>
          <p className="welcome-sub">Szia, {name}! Az akadémia hősei már várnak a lebegő városban.</p>
          <Btn iconAfter="arrow_forward" onClick={() => go({ name: 'today', replace: true })}>
            Belépés az akadémiára
          </Btn>
        </div>
        <img className="welcome-hero" src="assets/hero.webp" alt="" aria-hidden="true" />
      </div>
    </div>
  );
}

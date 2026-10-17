import { useState } from 'react';
import { useStore, statusOf, STATUS_LABEL } from '../app/store.jsx';
import { Icon, Chip, Glyph } from '../app/ui.jsx';
import { canOpen } from '../content/journey.js';
import { lockText } from '../app/access.js';
import { canPlayAdventure, useVoiceReady } from '../app/audio.js';
import { useOfflineStatus } from '../app/offline.js';
import { FORMATS, MODE_NAMES, UPCOMING_TEXT, WORLDS, availableIn, worldById } from '../content/index.js';

export function AdventureCard({ adv, go }) {
  const { state, act } = useStore();
  const voiceReady = useVoiceReady();
  const status = statusOf(state, adv.id);
  const fav = state.favourites.includes(adv.id);
  const fmt = FORMATS.find((f) => f.id === adv.format)?.label;
  const audio = canPlayAdventure(voiceReady, adv);
  const offline = useOfflineStatus(adv); // only 'ready' is ever claimed
  if (!canOpen(state, adv.id)) {
    // A locked journey adventure: its title and what unlocks it, nothing else, and no way in.
    return (
      <article className="card adv-card locked">
        <div className="adv-main">
          <span className="adv-head">
            <span className="adv-icon" aria-hidden="true">
              <Icon name="lock" size={36} />
            </span>
            <span className="stack tight adv-text">
              <span className="adv-title">{adv.title}</span>
              <span className="muted">
                <span className="sr-only">Zárolt kaland. </span>
                {lockText(state, adv.id)}
              </span>
            </span>
          </span>
        </div>
        <button
          type="button"
          className="icon-btn fav"
          aria-pressed={fav}
          aria-label={fav ? 'Kedvencekből kiveszem' : 'Kedvencekhez adom'}
          title={fav ? 'Kedvencekből kiveszem' : 'Kedvencekhez adom'}
          onClick={() => act.fav(adv.id)}
        >
          <Icon name={fav ? 'favorite' : 'favorite_border'} fill={fav} />
        </button>
      </article>
    );
  }
  return (
    <article className="card adv-card">
      <button type="button" className="adv-main" onClick={() => go({ name: 'adventure', id: adv.id })}>
        <span className="adv-head">
          {adv.coverAsset ? (
            <img className="adv-thumb" src={adv.coverAsset} srcSet={adv.coverSet} sizes="108px" alt="" />
          ) : adv.coverIcon ? (
            <span className="adv-icon" aria-hidden="true">
              <Glyph name={adv.coverIcon} size={48} />
            </span>
          ) : null}
          <span className="stack tight adv-text">
            <span className="adv-title">{adv.title}</span>
            <span className="muted">{adv.description}</span>
          </span>
        </span>
        <span className="chips">
          <Chip>{fmt}</Chip>
          {adv.modes.map((m) => {
            const off = m !== 'read' && !audio;
            return (
              <Chip key={m} tone={off ? 'dim' : ''} title={off ? 'Ezen az eszközön most nem elérhető' : undefined}>
                {MODE_NAMES[m]}
                {off ? <span className="sr-only"> (most nem elérhető ezen az eszközön)</span> : null}
              </Chip>
            );
          })}
          <Chip tone={status === 'done' ? 'good' : status === 'active' ? 'gold' : ''}>{STATUS_LABEL[status]}</Chip>
          {offline === 'ready' ? <Chip tone="good">Offline is elérhető</Chip> : null}
        </span>
      </button>
      <button
        type="button"
        className="icon-btn fav"
        aria-pressed={fav}
        aria-label={fav ? 'Kedvencekből kiveszem' : 'Kedvencekhez adom'}
        title={fav ? 'Kedvencekből kiveszem' : 'Kedvencekhez adom'}
        onClick={() => act.fav(adv.id)}
      >
        <Icon name={fav ? 'favorite' : 'favorite_border'} fill={fav} />
      </button>
    </article>
  );
}

export default function Explore({ go, custom }) {
  return (
    <div className="page stack">
      <h1 className="h1">Felfedezés</h1>
      <p className="lead">Válassz egy világot.</p>
      <div className="world-grid">
        {WORLDS.map((w) => {
          const n = availableIn(w.id).length;
          return (
            <button key={w.id} type="button" className="world-card" onClick={() => go({ name: 'world', id: w.id })}>
              {w.art ? (
                <img src={w.art} srcSet={w.artSet} sizes="(min-width: 800px) 400px, 100vw" alt="" />
              ) : (
                <span className="world-icon">
                  <Glyph name={w.icon} size={w.icon === 'dino' ? 96 : 44} />
                </span>
              )}
              <span className="stack tight">
                <strong className="h3">{w.name}</strong>
                <span className="muted">{w.description}</span>
                <span className={n ? 'eyebrow gold' : 'muted'}>{n ? `${n} kaland` : UPCOMING_TEXT}</span>
              </span>
            </button>
          );
        })}
      </div>

      {custom.length ? (
        <section className="stack">
          <h2 className="h2">Szülő által készített szövegek</h2>
          {custom.map((a) => (
            <AdventureCard key={a.id} adv={a} go={go} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

export function WorldView({ id, go }) {
  const world = worldById(id);
  const [format, setFormat] = useState('all');
  if (!world) return null;
  const adventures = availableIn(world.id);
  const has = (f) => adventures.some((a) => a.format === f);
  const shown = adventures.filter((a) => format === 'all' || a.format === format);
  return (
    <div className="page stack">
      <button type="button" className="back" onClick={() => go({ name: 'back' })}>
        <Icon name="arrow_back" /> Világok
      </button>
      {world.art ? (
        <img
          className="cover"
          src={world.art}
          srcSet={world.artSet}
          sizes="(min-width: 900px) 900px, 100vw"
          alt={world.artAlt || ''}
        />
      ) : null}
      <h1 className="h1">{world.name}</h1>
      <p className="lead">{world.description}</p>

      {adventures.length ? (
        <>
          <div className="chips" role="group" aria-label="Szűrés">
            {[{ id: 'all', label: 'Mind' }, ...FORMATS].map((f) => {
              const enabled = f.id === 'all' || has(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`pill ${format === f.id ? 'on' : ''}`}
                  aria-pressed={format === f.id}
                  aria-disabled={!enabled}
                  disabled={!enabled}
                  title={enabled ? undefined : 'Ebben a világban még nincs ilyen kaland.'}
                  onClick={() => setFormat(f.id)}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          {world.series.map((s) => {
            const list = shown.filter((a) => a.seriesId === s.id);
            if (!list.length) return null;
            return (
              <section key={s.id} className="stack">
                <h2 className="h2">{s.name}</h2>
                {s.note ? <p className="muted">{s.note}</p> : null}
                {list.map((a) => (
                  <AdventureCard key={a.id} adv={a} go={go} />
                ))}
              </section>
            );
          })}
        </>
      ) : (
        <div className="card">
          <Icon name="hourglass_empty" /> <strong>{UPCOMING_TEXT}</strong>
        </div>
      )}
    </div>
  );
}

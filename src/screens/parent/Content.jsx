import { REVIEW_LABEL, WORLDS, classLabel } from '../../content/index.js';

// What each adventure is: fiction or factual, where its facts come from, and whether an adult has reviewed it.
// Factual content cannot be shown to the child without sources and an adult review (see validateAdventure).
export default function Content({ adventures }) {
  const seriesName = (a) =>
    a.custom
      ? 'Szülő által készített szövegek'
      : WORLDS.find((w) => w.id === a.worldId)?.series.find((s) => s.id === a.seriesId)?.name || '';
  const worldName = (a) => WORLDS.find((w) => w.id === a.worldId)?.name || '–';
  return (
    <div className="stack">
      <section className="card stack">
        <h2 className="h3">Tartalom állapota</h2>
        <p className="muted">
          Minden kalandnál rögzítjük, hogy kitalált vagy valós információt tartalmaz-e, milyen forrásokra épül, és
          átnézte-e egy felnőtt. Valós információt tartalmazó kaland csak forrásokkal és felnőtt általi ellenőrzéssel
          jelenhet meg.
        </p>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Kaland</th>
                <th>Világ / sorozat</th>
                <th>Verzió</th>
                <th>Jelleg</th>
                <th>Források</th>
                <th>Felülvizsgálat</th>
              </tr>
            </thead>
            <tbody>
              {adventures.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>
                    {worldName(a)} / {seriesName(a)}
                  </td>
                  <td>v{a.version}</td>
                  <td>{classLabel(a) || 'Nincs megadva'}</td>
                  <td>
                    {a.sources?.length ? a.sources.length : a.classification === 'fiction' ? 'nem szükséges' : '–'}
                  </td>
                  <td>
                    {REVIEW_LABEL[a.review?.status]}
                    {a.review?.note ? <div className="muted">{a.review.note}</div> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
